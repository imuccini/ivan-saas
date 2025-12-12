"use client";

import type { CustomField, Sponsor, Term } from "@repo/portal-shared";
import { useState } from "react";
import { PortalAccessCode } from "./portal-access-code";
import { PortalApprovalPending } from "./portal-approval-pending";
import { PortalApprovalRequest } from "./portal-approval-request";
import { PortalBlocked } from "./portal-blocked";
import { PortalContainer } from "./portal-container";
import { PortalEasyWifi } from "./portal-easy-wifi";
import { PortalHome } from "./portal-home";
import { PortalRegistration } from "./portal-registration";
import { PortalSuccess } from "./portal-success";

interface PortalShellProps {
	config: Record<string, unknown>;
	workspaceId: string;
	customFields: CustomField[];
	sponsors: Sponsor[];
	terms: Term[];
}

type PortalStep =
	| "home"
	| "registration"
	| "access-code"
	| "approval-request"
	| "approval-pending"
	| "easy-wifi"
	| "blocked"
	| "success";

export function PortalShell({
	config,
	workspaceId,
	customFields,
	sponsors,
	terms,
}: PortalShellProps) {
	// Extract configuration - matching GuestWifiConfigData structure
	const wizardConfig = config as {
		authentication?: {
			showLoginOption?: boolean;
			appleIdEnabled?: boolean;
			accessCodesEnabled?: boolean;
			enterpriseIdpEnabled?: boolean;
			selectedIdps?: string[];
			guestRegistrationEnabled?: boolean;
			registrationMode?: "form" | "button";
			sponsorshipEnabled?: boolean;
			registrationFields?: FormField[];
			terms?: SelectedTerm[];
		};
		journey?: {
			easyWifiEnabled?: boolean;
			successRedirectMode?: "external" | "text";
			successRedirectUrl?: string;
		};
		style?: {
			fontFamily?: string;
			baseFontSize?: string;
			baseColor?: string;
			primaryColor?: string;
			spacing?: string;
			backgroundType?: "image" | "color" | "gradient";
			backgroundColor?: string;
			gradientColor1?: string;
			gradientColor2?: string;
		};
		content?: Record<
			string,
			{
				title?: string;
				description?: string;
				signupButtonText?: string;
				loginButtonText?: string;
				registrationTitle?: string;
				registrationDescription?: string;
				registrationSubmitButtonText?: string;
				sponsorMessage?: string;
				successMessage?: string;
				blockedMessage?: string;
				easyWifiCtaMessage?: string;
				easyWifiSkipMessage?: string;
			}
		>;
		assets?: {
			logoUrl?: string;
			logoSize?: number;
			backgroundImageUrl?: string;
		};
		languages?: string[];
		defaultLanguage?: string;
	};

	const auth = wizardConfig.authentication || {};
	const journey = wizardConfig.journey || {};
	const style = wizardConfig.style || {};
	const assets = wizardConfig.assets || {};
	const defaultLang =
		wizardConfig.defaultLanguage || wizardConfig.languages?.[0] || "en";
	const content = wizardConfig.content?.[defaultLang] || {};

	// Initialize step based on Easy WiFi
	const [currentStep, setCurrentStep] = useState<PortalStep>(
		journey.easyWifiEnabled ? "easy-wifi" : "home",
	);

	// Interfaces for config objects
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

	// Parse numeric values
	const baseFontSize = Number.parseInt(style.baseFontSize || "16");
	const logoSize = assets.logoSize || 64;

	// Map spacing to numeric value
	const getSpacing = () => {
		switch (style.spacing) {
			case "compact":
				return 2;
			case "spacious":
				return 8;
			default:
				return 4;
		}
	};

	// Check if any IDP is enabled
	const googleEnabled = auth.selectedIdps?.includes("google") ?? false;
	const azureEnabled = auth.selectedIdps?.includes("azure") ?? false;
	const oktaEnabled = auth.selectedIdps?.includes("okta") ?? false;

	// Handlers
	const handleLogin = () => {
		// TODO: Implement login flow
		console.log("Login clicked");
	};

	const handleRegisterStart = () => {
		if (auth.sponsorshipEnabled) {
			setCurrentStep("approval-request");
		} else {
			setCurrentStep("registration");
		}
	};

	const handleRegisterSubmit = (data: Record<string, string>) => {
		// TODO: Implement registration submission
		console.log("Registration data:", data);
		setCurrentStep("success");
	};

	const handleSocialLogin = (provider: string) => {
		// TODO: Implement social login
		console.log("Social login:", provider);
	};

	const handleAccessCodeSubmit = (code: string) => {
		// TODO: Implement access code validation
		console.log("Access code:", code);
		setCurrentStep("success");
	};

	const handleSponsorSubmit = (email: string) => {
		// TODO: Implement sponsor request
		console.log("Sponsor email:", email);
		setCurrentStep("approval-pending");
	};

	const handleEasyWifiConnect = () => {
		// TODO: Implement easy wifi connection
		console.log("Easy WiFi connect");
		setCurrentStep("success");
	};

	return (
		<PortalContainer
			fontFamily={style.fontFamily || "Inter"}
			baseFontSize={String(baseFontSize)}
			baseColor={style.baseColor || "#1a1a1a"}
			primaryColor={style.primaryColor || "#3b82f6"}
			spacing={getSpacing()}
			backgroundType={
				style.backgroundType === "image"
					? "image"
					: style.backgroundType === "gradient"
						? "gradient"
						: "color"
			}
			backgroundColor={style.backgroundColor || "#ffffff"}
			gradientColor1={style.gradientColor1 || "#ffffff"}
			gradientColor2={style.gradientColor2 || "#f0f0f0"}
			backgroundImage={assets.backgroundImageUrl || undefined}
			logo={assets.logoUrl || undefined}
			logoSize={logoSize}
		>
			{currentStep === "easy-wifi" && (
				<PortalEasyWifi
					title={content.title || "Welcome"}
					description={
						content.description || "Connect to our WiFi network"
					}
					ctaText={content.easyWifiCtaMessage || "Connect Now"}
					skipText={
						content.easyWifiSkipMessage || "I'll take my chances"
					}
					primaryColor={style.primaryColor || "#3b82f6"}
					baseFontSize={style.baseFontSize || "16"}
					spacing={style.spacing || "balanced"}
					onConnect={handleEasyWifiConnect}
					onSkip={() => setCurrentStep("home")}
				/>
			)}

			{currentStep === "home" && (
				<PortalHome
					title={content.title || "Welcome"}
					description={
						content.description || "Connect to our WiFi network"
					}
					signupButtonText={content.signupButtonText || "Sign Up"}
					loginButtonText={content.loginButtonText || "Login"}
					showLoginOption={auth.showLoginOption ?? false}
					appleIdEnabled={auth.appleIdEnabled ?? false}
					googleEnabled={googleEnabled}
					azureEnabled={azureEnabled}
					oktaEnabled={oktaEnabled}
					accessCodesEnabled={auth.accessCodesEnabled ?? false}
					guestRegistrationEnabled={
						auth.guestRegistrationEnabled ?? true
					}
					registrationMode={auth.registrationMode || "button"}
					registrationFields={auth.registrationFields || []}
					selectedTerms={auth.terms || []}
					availableTerms={terms}
					primaryColor={style.primaryColor || "#3b82f6"}
					baseFontSize={style.baseFontSize || "16"}
					spacing={style.spacing || "balanced"}
					onLogin={handleLogin}
					onRegister={handleRegisterStart}
					onSocialLogin={handleSocialLogin}
					onAccessCodeSubmit={handleAccessCodeSubmit}
				/>
			)}

			{currentStep === "registration" && (
				<PortalRegistration
					title={content.registrationTitle || "Register"}
					description={
						content.registrationDescription ||
						"Please fill in your details"
					}
					submitButtonText={
						content.registrationSubmitButtonText || "Register"
					}
					fields={auth.registrationFields || []}
					selectedTerms={auth.terms || []}
					availableTerms={terms}
					primaryColor={style.primaryColor || "#3b82f6"}
					baseFontSize={style.baseFontSize || "16"}
					spacing={style.spacing || "balanced"}
					onBack={() => setCurrentStep("home")}
					onSubmit={handleRegisterSubmit}
				/>
			)}

			{currentStep === "access-code" && (
				<PortalAccessCode
					title="Enter Access Code"
					description="Please enter the access code provided to you."
					submitButtonText="Submit"
					primaryColor={style.primaryColor || "#3b82f6"}
					baseFontSize={style.baseFontSize || "16"}
					spacing={style.spacing || "balanced"}
					onBack={() => setCurrentStep("home")}
					onSubmit={handleAccessCodeSubmit}
				/>
			)}

			{currentStep === "approval-request" && (
				<PortalApprovalRequest
					title="Sponsorship Required"
					description={
						content.sponsorMessage ||
						"Please enter your sponsor's email address."
					}
					submitButtonText="Request Access"
					primaryColor={style.primaryColor || "#3b82f6"}
					baseFontSize={style.baseFontSize || "16"}
					spacing={style.spacing || "balanced"}
					onBack={() => setCurrentStep("home")}
					onSubmit={handleSponsorSubmit}
				/>
			)}

			{currentStep === "approval-pending" && (
				<PortalApprovalPending
					title="Approval Pending"
					description="Your request has been sent. Please wait for approval."
					primaryColor={style.primaryColor || "#3b82f6"}
					baseFontSize={style.baseFontSize || "16"}
					spacing={style.spacing || "balanced"}
					onCheckStatus={() => {
						// TODO: Check status
						console.log("Checking status...");
					}}
				/>
			)}

			{currentStep === "blocked" && (
				<PortalBlocked
					title="Access Blocked"
					description={
						content.blockedMessage ||
						"You do not have permission to access this network."
					}
					primaryColor={style.primaryColor || "#3b82f6"}
					baseFontSize={style.baseFontSize || "16"}
					spacing={style.spacing || "balanced"}
					onRetry={() => setCurrentStep("home")}
				/>
			)}

			{currentStep === "success" && (
				<PortalSuccess
					title="Success!"
					description={
						content.successMessage || "You are now connected."
					}
					redirectUrl={journey.successRedirectUrl}
					redirectMode={journey.successRedirectMode || "text"}
					primaryColor={style.primaryColor || "#3b82f6"}
					baseFontSize={style.baseFontSize || "16"}
					spacing={style.spacing || "balanced"}
				/>
			)}

			{/* Debug info */}
			<div className="mt-4 text-xs text-muted-foreground text-center opacity-50">
				Workspace: {workspaceId} | Step: {currentStep}
			</div>
		</PortalContainer>
	);
}
