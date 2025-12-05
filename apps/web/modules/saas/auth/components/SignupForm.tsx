"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@repo/auth/client";
import { config } from "@repo/config";
import { useAuthErrorMessages } from "@saas/auth/hooks/errors-messages";
import { OrganizationInvitationAlert } from "@saas/organizations/components/OrganizationInvitationAlert";
import { Alert, AlertDescription } from "@ui/components/alert";
import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@ui/components/input-otp";
import { AlertTriangleIcon, ArrowRightIcon, MailboxIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { withQuery } from "ufo";
import { z } from "zod";
import {
	type OAuthProvider,
	oAuthProviders,
} from "../constants/oauth-providers";
import { SocialSigninButton } from "./SocialSigninButton";

// Step 1: User Details
// Common free email providers to block
const FREE_EMAIL_PROVIDERS = [
	"gmail.com",
	"yahoo.com",
	"hotmail.com",
	"outlook.com",
	"aol.com",
	"icloud.com",
	"mail.com",
	"protonmail.com",
	"zoho.com",
	"yandex.com",
	"gmx.com",
	"live.com",
	"msn.com",
];

const step1Schema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z
		.string()
		.email("Invalid email address")
		.refine(
			(email) => {
				const domain = email.split("@")[1]?.toLowerCase();
				return !FREE_EMAIL_PROVIDERS.includes(domain);
			},
			{
				message:
					"Please use a work email address. Free email providers are not allowed.",
			},
		),
	consent: z.boolean().refine((val) => val === true, {
		message: "You must accept the terms and privacy policy",
	}),
});

type Step1Data = z.infer<typeof step1Schema>;

export function SignupForm({ prefillEmail }: { prefillEmail?: string }) {
	const t = useTranslations();
	const router = useRouter();
	const { getAuthErrorMessage } = useAuthErrorMessages();
	const searchParams = useSearchParams();

	const [currentStep, setCurrentStep] = useState(1);
	const [emailExists, setEmailExists] = useState(false);
	const [otp, setOtp] = useState("");
	const [otpError, setOtpError] = useState<string | null>(null);
	const [isVerifying, setIsVerifying] = useState(false);
	const [signupData, setSignupData] = useState<{
		step1?: Step1Data;
	}>({});

	const invitationId = searchParams.get("invitationId");
	const email = searchParams.get("email");




	// Step 1 Form
	const step1Form = useForm<Step1Data>({
		resolver: zodResolver(step1Schema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: prefillEmail ?? email ?? "",
			consent: false,
		},
	});

	// Check if email exists when user types
	const checkEmailExists = async (email: string) => {
		if (!email || !email.includes("@")) {
			return;
		}

		try {
			const response = await fetch(
				`/api/auth/check-email?email=${encodeURIComponent(email)}`,
			);
			const data = await response.json();
			setEmailExists(data.exists || false);
		} catch (error) {
			console.error("Error checking email:", error);
			setEmailExists(false);
		}
	};

	// Step 1: Submit user details and send OTP
	const onStep1Submit = step1Form.handleSubmit(async (data) => {
		try {
			// Check if email already exists
			if (emailExists) {
				step1Form.setError("email", {
					message: "This email is already registered.",
				});
				return;
			}

			setSignupData({ ...signupData, step1: data });
			sessionStorage.setItem(
				"signupData",
				JSON.stringify({ step1: data }),
			);

			// Send OTP (using direct fetch due to client/server path mismatch)
			await sendOtp(data.email);

			setCurrentStep(2); // Show OTP input
		} catch (e) {
			step1Form.setError("root", {
				message: getAuthErrorMessage(
					e && typeof e === "object" && "code" in e
						? (e.code as string)
						: undefined,
				),
			});
		}
	});

	const sendOtp = async (email: string) => {
		const response = await fetch(
			"/api/auth/email-otp/send-verification-otp",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					type: "sign-in",
				}),
			},
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.message || "Failed to send verification code",
			);
		}
	};

	const verifyOtp = async (code: string) => {
		if (!signupData.step1?.email || isVerifying) return;

		setIsVerifying(true);
		setOtpError(null);

		try {
			const { error } = await authClient.signIn.emailOtp({
				email: signupData.step1.email,
				otp: code,
			});

			if (error) {
				setOtpError(error.message || "Invalid code");
				setIsVerifying(false);
				return;
			}

			// IMPORTANT: Use full page navigation (not router.push)
			// The set-password page is a Server Component that calls getSession()
			// With client-side navigation, the server won't see the new session cookie
			// Full page navigation forces a new HTTP request with all cookies included
			window.location.href = "/auth/set-password";
		} catch (e) {
			setOtpError("An error occurred. Please try again.");
			setIsVerifying(false);
		}
	};

	return (
		<div>
			<h1 className="font-bold text-xl md:text-2xl">
				{currentStep === 1 && "Create a free account"}
			</h1>
			<p className="mt-1 mb-6 text-foreground/60">
				{currentStep === 1 && "Get started in less than 2 minutes."}
			</p>

			{/* Step 1: User Details */}
			{currentStep === 1 && (
				<>
					{invitationId && (
						<OrganizationInvitationAlert className="mb-6" />
					)}

					<Form {...step1Form}>
						<form
							className="flex flex-col items-stretch gap-4"
							onSubmit={onStep1Submit}
						>
							{step1Form.formState.isSubmitted &&
								step1Form.formState.errors.root && (
									<Alert variant="destructive">
										<AlertTriangleIcon />
										<AlertDescription>
											{
												step1Form.formState.errors.root
													.message
											}
										</AlertDescription>
									</Alert>
								)}

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={step1Form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={step1Form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={step1Form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Work Email</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="email"
												autoComplete="email"
												readOnly={!!prefillEmail}
												onBlur={(e) => {
													field.onBlur();
													checkEmailExists(
														e.target.value,
													);
												}}
											/>
										</FormControl>
										{emailExists && (
											<Alert
												variant="destructive"
												className="mt-2"
											>
												<AlertDescription>
													This email is already
													registered.{" "}
													<Link
														href="/auth/login"
														className="font-medium underline"
													>
														Log in instead
													</Link>
												</AlertDescription>
											</Alert>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={step1Form.control}
								name="consent"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel className="text-sm font-normal">
												I accept Cloud4Wi's{" "}
												<Link
													href="/terms"
													className="text-primary underline"
													target="_blank"
												>
													Terms & Conditions
												</Link>{" "}
												and{" "}
												<Link
													href="/privacy"
													className="text-primary underline"
													target="_blank"
												>
													Privacy Policy
												</Link>
											</FormLabel>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<Button loading={step1Form.formState.isSubmitting}>
								Create Account
							</Button>
						</form>
					</Form>

					{config.auth.enableSignup &&
						config.auth.enableSocialLogin && (
							<>
								<div className="relative my-6 h-4">
									<hr className="relative top-2" />
									<p className="-translate-x-1/2 absolute top-0 left-1/2 mx-auto inline-block h-4 bg-card px-2 text-center font-medium text-foreground/60 text-sm leading-tight">
										{t("auth.login.continueWith")}
									</p>
								</div>

								<div className="grid grid-cols-1 items-stretch gap-2">
									{Object.keys(oAuthProviders).map(
										(providerId) => (
											<SocialSigninButton
												key={providerId}
												provider={
													providerId as OAuthProvider
												}
												disabled={true}
											/>
										),
									)}
								</div>
							</>
						)}
				</>
			)}

			{/* Step 2: Magic Link Sent */}
			{/* Step 2: OTP Verification */}
			{currentStep === 2 && (
				<div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
					<div className="flex flex-col items-center text-center space-y-4">
						<div className="flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
							<MailboxIcon className="size-8 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<h2 className="text-xl font-semibold">
								Enter verification code
							</h2>
							<p className="mt-2 text-muted-foreground">
								We sent a code to{" "}
								<span className="font-medium text-foreground">
									{signupData.step1?.email}
								</span>
							</p>
						</div>
					</div>

					<div className="flex justify-center py-4">
						<InputOTP
							maxLength={6}
							value={otp}
							onChange={(value) => {
								setOtp(value);
								if (value.length === 6) {
									verifyOtp(value);
								}
							}}
						>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
					</div>

					{otpError && (
						<Alert variant="destructive">
							<AlertTriangleIcon />
							<AlertDescription>{otpError}</AlertDescription>
						</Alert>
					)}

					<Button
						onClick={() => verifyOtp(otp)}
						disabled={otp.length !== 6 || isVerifying}
						className="w-full"
					>
						{isVerifying ? "Verifying..." : "Verify Code"}
					</Button>

					<div className="text-center">
						<p className="text-sm text-muted-foreground mb-3">
							Didn't receive the code?
						</p>
						<Button
							variant="outline"
							onClick={async () => {
								if (signupData.step1) {
									try {
										await sendOtp(signupData.step1.email);
									} catch (error) {
										console.error(
											"Failed to resend:",
											error,
										);
									}
								}
							}}
						>
							Resend Code
						</Button>
					</div>
				</div>
			)}

			{/* Login Link */}
			{currentStep === 1 && (
				<div className="mt-6 text-center text-sm">
					<span className="text-foreground/60">
						{t("auth.signup.alreadyHaveAccount")}{" "}
					</span>
					<Link
						href={withQuery(
							"/auth/login",
							Object.fromEntries(searchParams.entries()),
						)}
					>
						{t("auth.signup.signIn")}
						<ArrowRightIcon className="ml-1 inline size-4 align-middle" />
					</Link>
				</div>
			)}
		</div>
	);
}
