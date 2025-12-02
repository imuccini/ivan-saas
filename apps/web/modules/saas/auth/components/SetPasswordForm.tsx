"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { config } from "@repo/config";
import { useRouter } from "@shared/hooks/router";
import { Alert, AlertDescription } from "@ui/components/alert";
import { Button } from "@ui/components/button";
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
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const passwordSchema = z
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

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function SetPasswordForm() {
	const t = useTranslations();
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		form.clearErrors("root");

		try {
			// Set password via API
			const response = await fetch("/api/auth/set-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					password: data.password,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to set password");
			}

			// Determine next route
			const nextRoute = config.users.enableOnboarding 
				? "/auth/onboarding" 
				: "/app";

			// Navigate immediately for better UX
			router.push(nextRoute);
		} catch (e) {
			form.setError("root", {
				message:
					e instanceof Error ? e.message : "Failed to set password",
			});
		}
	});

	// Prefetch the next page on mount to speed up navigation
	React.useEffect(() => {
		const nextRoute = config.users.enableOnboarding 
			? "/auth/onboarding" 
			: "/app";
		router.prefetch(nextRoute);
	}, [router]);

	return (
		<div>
			<h1 className="font-bold text-xl md:text-2xl">Set your password</h1>
			<p className="mt-1 mb-6 text-foreground/60">
				Create a secure password for your account
			</p>

			<Form {...form}>
				<form
					className="flex flex-col items-stretch gap-4"
					onSubmit={onSubmit}
				>
					{form.formState.isSubmitted && form.formState.errors.root && (
						<Alert variant="destructive">
							<AlertTriangleIcon />
							<AlertDescription>
								{form.formState.errors.root.message}
							</AlertDescription>
						</Alert>
					)}

					<FormField
						control={form.control}
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
												setShowPassword(!showPassword)
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
									Must be at least 8 characters, include an
									uppercase letter and a number.
								</p>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
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

					<Button
						className="w-full"
						type="submit"
						loading={form.formState.isSubmitting}
					>
						Continue
						<ArrowRightIcon className="ml-2 size-4" />
					</Button>
				</form>
			</Form>
		</div>
	);
}
