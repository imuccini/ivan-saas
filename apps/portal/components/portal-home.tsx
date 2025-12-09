"use client";

import type { Term } from "@repo/portal-shared";
import { useState } from "react";
import { Button } from "./ui-components/button";
import { Input } from "./ui-components/input";

interface FormField {
	id: string;
	label: string;
	placeholder?: string;
	required: boolean;
	type: string;
	isCustom?: boolean;
	options?: string[];
}

interface SelectedTerm {
	id: string;
	termDefinitionId: string;
	required: boolean;
}

interface PortalHomeProps {
	// Content
	title: string;
	description: string;
	signupButtonText: string;
	loginButtonText: string;
	// Auth config
	showLoginOption: boolean;
	appleIdEnabled: boolean;
	googleEnabled: boolean;
	azureEnabled: boolean;
	oktaEnabled: boolean;
	accessCodesEnabled: boolean;
	guestRegistrationEnabled: boolean;
	registrationMode: "form" | "button";
	registrationFields?: FormField[];
	selectedTerms?: SelectedTerm[];
	availableTerms?: Term[];
	// Styling
	primaryColor: string;
	baseFontSize: string;
	spacing: string;
	// Callbacks
	onLogin: () => void;
	onRegister: () => void;
	onSocialLogin: (provider: string) => void;
	onAccessCodeSubmit: (code: string) => void;
}

export function PortalHome({
	title,
	description,
	signupButtonText,
	loginButtonText,
	showLoginOption,
	appleIdEnabled,
	googleEnabled,
	azureEnabled,
	oktaEnabled,
	accessCodesEnabled,
	guestRegistrationEnabled,
	registrationMode,
	registrationFields = [],
	selectedTerms = [],
	availableTerms = [],
	primaryColor,
	baseFontSize,
	spacing,
	onLogin,
	onRegister,
	onSocialLogin,
	onAccessCodeSubmit,
}: PortalHomeProps) {
	const [accessCode, setAccessCode] = useState("");

	const handleAccessCodeSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (accessCode.trim()) {
			onAccessCodeSubmit(accessCode);
		}
	};

	const enterpriseIdpEnabled = googleEnabled || azureEnabled || oktaEnabled;
	const selectedIdps = [
		...(googleEnabled ? ["google"] : []),
		...(azureEnabled ? ["azure"] : []),
		...(oktaEnabled ? ["okta"] : []),
	];

	return (
		<>
			{/* Title & Description */}
			<div
				className={`text-center ${
					spacing === "compact"
						? "space-y-1"
						: spacing === "spacious"
							? "space-y-4"
							: "space-y-2"
				}`}
			>
				<h2
					className="font-bold"
					style={{
						fontSize: `${Number.parseInt(baseFontSize) * 1.25}px`,
					}}
				>
					{title}
				</h2>
				<p
					className="text-muted-foreground"
					style={{
						fontSize: `${baseFontSize}px`,
					}}
				>
					{description}
				</p>
			</div>

			{/* Authentication Options */}
			<div
				className={`flex flex-col ${
					spacing === "compact"
						? "gap-2"
						: spacing === "spacious"
							? "gap-5"
							: "gap-3"
				}`}
			>
				{/* Apple ID */}
				{appleIdEnabled && (
					<>
						<Button
							variant="outline"
							className="w-full gap-2"
							onClick={() => onSocialLogin("apple")}
							style={{
								fontSize: `${baseFontSize}px`,
							}}
						>
							<svg
								viewBox="0 0 24 24"
								fill="currentColor"
								className="h-4 w-4"
							>
								<title>Apple Logo</title>
								<path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
							</svg>
							Sign in with Apple
						</Button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									or
								</span>
							</div>
						</div>
					</>
				)}

				{/* Enterprise IDPs */}
				{enterpriseIdpEnabled && selectedIdps.length > 0 && (
					<>
						{selectedIdps.map((idp) => (
							<Button
								key={idp}
								variant="outline"
								className="w-full gap-2"
								onClick={() => onSocialLogin(idp)}
								style={{
									fontSize: `${baseFontSize}px`,
								}}
							>
								{/* IDP Icons */}
								{idp === "google" && (
									<svg
										viewBox="0 0 24 24"
										className="h-4 w-4"
									>
										<title>Google Logo</title>
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
								)}
								{idp === "azure" && (
									<svg
										viewBox="0 0 24 24"
										className="h-4 w-4"
										fill="currentColor"
									>
										<title>Microsoft Logo</title>
										<path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
									</svg>
								)}
								{idp === "okta" && (
									<svg
										viewBox="0 0 24 24"
										className="h-4 w-4"
										fill="currentColor"
									>
										<title>Okta Logo</title>
										<path d="M12 0C5.389 0 0 5.389 0 12s5.389 12 12 12 12-5.389 12-12S18.611 0 12 0zm0 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z" />
									</svg>
								)}
								Login with{" "}
								{idp === "azure"
									? "Entra ID"
									: idp === "google"
										? "Google"
										: "Okta"}
							</Button>
						))}

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									or
								</span>
							</div>
						</div>
					</>
				)}

				{/* Register Form */}
				{guestRegistrationEnabled && registrationMode === "form" && (
					<div
						className={`flex flex-col ${
							spacing === "compact"
								? "gap-2"
								: spacing === "spacious"
									? "gap-5"
									: "gap-3"
						}`}
					>
						{registrationFields.map((field) => (
							<Input
								key={field.id}
								type={field.type}
								placeholder={field.placeholder || field.label}
								style={{
									fontSize: `${baseFontSize}px`,
								}}
							/>
						))}

						{selectedTerms.length > 0 && (
							<div className="space-y-2">
								{selectedTerms.map((term) => {
									const definition = availableTerms.find(
										(t) => t.id === term.termDefinitionId,
									);
									if (!definition) return null;

									return (
										<div
											key={term.id}
											className="flex items-start gap-2"
										>
											<input
												type="checkbox"
												id={`term-${term.id}`}
												className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
												required={term.required}
											/>
											<label
												htmlFor={`term-${term.id}`}
												className="text-sm text-muted-foreground"
												style={{
													fontSize: `${Math.max(
														12,
														Number.parseInt(
															baseFontSize,
														) - 2,
													)}px`,
												}}
											>
												{definition.name}
												{term.required && (
													<span className="text-destructive ml-1">
														*
													</span>
												)}
											</label>
										</div>
									);
								})}
							</div>
						)}

						<Button
							className="w-full"
							onClick={onRegister}
							style={{
								backgroundColor: primaryColor,
								fontSize: `${baseFontSize}px`,
							}}
						>
							{signupButtonText}
						</Button>
					</div>
				)}

				{/* Register Button (when mode is button) */}
				{guestRegistrationEnabled && registrationMode === "button" && (
					<Button
						className="w-full"
						onClick={onRegister}
						style={{
							backgroundColor: primaryColor,
							fontSize: `${baseFontSize}px`,
						}}
					>
						{signupButtonText}
					</Button>
				)}

				{/* Login Button */}
				{showLoginOption && (
					<Button
						variant="outline"
						className="w-full"
						onClick={onLogin}
						style={{ fontSize: `${baseFontSize}px` }}
					>
						{loginButtonText}
					</Button>
				)}

				{/* Access Code */}
				{accessCodesEnabled && (
					<>
						{(appleIdEnabled ||
							enterpriseIdpEnabled ||
							guestRegistrationEnabled ||
							showLoginOption) && (
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										or
									</span>
								</div>
							</div>
						)}

						<form
							onSubmit={handleAccessCodeSubmit}
							className="flex gap-2"
						>
							<Input
								type="text"
								placeholder="Enter access code"
								value={accessCode}
								onChange={(e) => setAccessCode(e.target.value)}
								style={{ fontSize: `${baseFontSize}px` }}
							/>
							<Button
								type="submit"
								style={{
									backgroundColor: primaryColor,
									fontSize: `${baseFontSize}px`,
								}}
							>
								Submit
							</Button>
						</form>
					</>
				)}
			</div>
		</>
	);
}
