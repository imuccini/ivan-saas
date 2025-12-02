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
	AlertTriangleIcon,
	ArrowRightIcon,
	EyeIcon,
	EyeOffIcon,
	MailboxIcon,
} from "lucide-react";
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

// Step 3: Password Setup
const step3Schema = z
	.object({
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must include an uppercase letter")
			.regex(/[0-9]/, "Password must include a number"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type Step1Data = z.infer<typeof step1Schema>;
type Step3Data = z.infer<typeof step3Schema>;

export function SignupForm({ prefillEmail }: { prefillEmail?: string }) {
	const t = useTranslations();
	const router = useRouter();
	const { getAuthErrorMessage } = useAuthErrorMessages();
	const searchParams = useSearchParams();

	const [currentStep, setCurrentStep] = useState(1);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [emailExists, setEmailExists] = useState(false);
	const [isCheckingEmail, setIsCheckingEmail] = useState(false);
	const [signupData, setSignupData] = useState<{
		step1?: Step1Data;
		step3?: Step3Data;
	}>({});

	const invitationId = searchParams.get("invitationId");
	const email = searchParams.get("email");
	const redirectTo = searchParams.get("redirectTo");

	// Check if we're coming from magic link verification
	const verificationToken = searchParams.get("token");
	useEffect(() => {
		if (verificationToken) {
			setCurrentStep(3); // Go to password setup
		}
	}, [verificationToken]);

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

	// Step 3 Form
	const step3Form = useForm<Step3Data>({
		resolver: zodResolver(step3Schema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const invitationOnlyMode = !config.auth.enableSignup && invitationId;

	const redirectPath = invitationId
		? `/organization-invitation/${invitationId}`
		: (redirectTo ?? config.auth.redirectAfterSignIn);

	// Check if email exists when user types
	const checkEmailExists = async (email: string) => {
		if (!email || !email.includes("@")) {
			return;
		}

		setIsCheckingEmail(true);
		try {
			const response = await fetch(
				`/api/auth/check-email?email=${encodeURIComponent(email)}`,
			);
			const data = await response.json();
			setEmailExists(data.exists || false);
		} catch (error) {
			console.error("Error checking email:", error);
			setEmailExists(false);
		} finally {
			setIsCheckingEmail(false);
		}
	};

	// Step 1: Submit user details and send magic link
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

			// Send magic link
			const { error } = await authClient.signIn.magicLink({
				email: data.email,
				name: `${data.firstName} ${data.lastName}`,
				callbackURL: `${window.location.origin}/auth/signup?token=verify&email=${encodeURIComponent(data.email)}`,
			});

			if (error) {
				throw error;
			}

			setCurrentStep(2); // Show magic link sent confirmation
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

	// Step 3: Submit password and create account
	const onStep3Submit = step3Form.handleSubmit(async (data) => {
		try {
			if (!signupData.step1) {
				throw new Error("Missing signup data");
			}

			// Create account with password
			const { error } = await authClient.signUp.email({
				email: signupData.step1.email,
				password: data.password,
				name: `${signupData.step1.firstName} ${signupData.step1.lastName}`,
				callbackURL: redirectPath,
			});

			if (error) {
				throw error;
			}

			// Redirect to onboarding where company data will be collected
			router.push(redirectPath);
		} catch (e) {
			step3Form.setError("root", {
				message: getAuthErrorMessage(
					e && typeof e === "object" && "code" in e
						? (e.code as string)
						: undefined,
				),
			});
		}
	});

	const totalSteps = 3;
	const progress = (currentStep / totalSteps) * 100;

	return (
		<div>
			<h1 className="font-bold text-xl md:text-2xl">
				{currentStep === 1 && "Create a free account"}
				{currentStep === 2 && "Check your email"}
				{currentStep === 3 && "Set your password"}
			</h1>
			<p className="mt-1 mb-6 text-foreground/60">
				{currentStep === 1 && "Get started in less than 2 minutes."}
				{currentStep === 2 && "We sent you a verification link"}
				{currentStep === 3 &&
					"Create a secure password for your account"}
			</p>

			{/* Progress Indicator */}
			<div className="mb-6">
				<div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
					<span>
						Step {currentStep} of {totalSteps}
					</span>
					<span>{Math.round(progress)}%</span>
				</div>
				<div className="h-2 bg-muted rounded-full overflow-hidden">
					<div
						className="h-full bg-primary transition-all duration-300"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

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
													className="text-primary hover:underline"
													target="_blank"
												>
													Terms & Conditions
												</Link>{" "}
												and{" "}
												<Link
													href="/privacy"
													className="text-primary hover:underline"
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

								<div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2">
									{Object.keys(oAuthProviders).map(
										(providerId) => (
											<SocialSigninButton
												key={providerId}
												provider={
													providerId as OAuthProvider
												}
											/>
										),
									)}
								</div>
							</>
						)}
				</>
			)}

			{/* Step 2: Magic Link Sent */}
			{currentStep === 2 && (
				<div className="space-y-6">
					<div className="flex flex-col items-center text-center space-y-4">
						<div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
							<MailboxIcon className="size-8 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<h2 className="text-xl font-semibold">
								Check your email
							</h2>
							<p className="mt-2 text-muted-foreground">
								We sent a verification link to
							</p>
							<p className="mt-1 font-medium">
								{signupData.step1?.email}
							</p>
						</div>
					</div>

					<Alert>
						<AlertDescription className="text-sm">
							Click the link in the email to continue setting up
							your account. The link will expire in 15 minutes.
						</AlertDescription>
					</Alert>

					<div className="text-center">
						<p className="text-sm text-muted-foreground mb-3">
							Didn't receive the email?
						</p>
						<Button
							variant="outline"
							onClick={async () => {
								if (signupData.step1) {
									try {
										await authClient.signIn.magicLink({
											email: signupData.step1.email,
											name: `${signupData.step1.firstName} ${signupData.step1.lastName}`,
											callbackURL: `${window.location.origin}/auth/signup?token=verify&email=${encodeURIComponent(signupData.step1.email)}`,
										});
									} catch (error) {
										console.error(
											"Failed to resend:",
											error,
										);
									}
								}
							}}
						>
							Resend Email
						</Button>
					</div>
				</div>
			)}

			{/* Step 3: Password Setup */}
			{currentStep === 3 && (
				<Form {...step3Form}>
					<form
						className="flex flex-col items-stretch gap-4"
						onSubmit={onStep3Submit}
					>
						{step3Form.formState.isSubmitted &&
							step3Form.formState.errors.root && (
								<Alert variant="destructive">
									<AlertTriangleIcon />
									<AlertDescription>
										{
											step3Form.formState.errors.root
												.message
										}
									</AlertDescription>
								</Alert>
							)}

						<FormField
							control={step3Form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Create Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={
													showPassword
														? "text"
														: "password"
												}
												className="pr-10"
												{...field}
												autoComplete="new-password"
											/>
											<button
												type="button"
												onClick={() =>
													setShowPassword(
														!showPassword,
													)
												}
												className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary text-xl"
											>
												{showPassword ? (
													<EyeOffIcon className="size-4" />
												) : (
													<EyeIcon className="size-4" />
												)}
											</button>
										</div>
									</FormControl>
									<p className="text-xs text-muted-foreground">
										Must be at least 8 characters, include
										an uppercase letter and a number.
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={step3Form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={
													showConfirmPassword
														? "text"
														: "password"
												}
												className="pr-10"
												{...field}
												autoComplete="new-password"
											/>
											<button
												type="button"
												onClick={() =>
													setShowConfirmPassword(
														!showConfirmPassword,
													)
												}
												className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary text-xl"
											>
												{showConfirmPassword ? (
													<EyeOffIcon className="size-4" />
												) : (
													<EyeIcon className="size-4" />
												)}
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button loading={step3Form.formState.isSubmitting}>
							Set Password
						</Button>
					</form>
				</Form>
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
