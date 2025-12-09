"use client";

import type { CustomField, Sponsor, Term } from "@repo/portal-shared";
import { useState } from "react";
import { PortalContainer } from "./portal-container";
import { PortalHome } from "./portal-home";

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
	| "sponsorship"
	| "easy-wifi"
	| "success";

export function PortalShell({
	config,
	workspaceId,
	customFields,
	sponsors,
	terms,
}: PortalShellProps) {
	const [currentStep, setCurrentStep] = useState<PortalStep>("home");

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
	const style = wizardConfig.style || {};
	const assets = wizardConfig.assets || {};
	const defaultLang =
		wizardConfig.defaultLanguage || wizardConfig.languages?.[0] || "en";
	const content = wizardConfig.content?.[defaultLang] || {};

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

	const handleRegister = () => {
		setCurrentStep("registration");
	};

	const handleSocialLogin = (provider: string) => {
		// TODO: Implement social login
		console.log("Social login:", provider);
	};

	const handleAccessCodeSubmit = (code: string) => {
		// TODO: Implement access code validation
		console.log("Access code:", code);
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
					onRegister={handleRegister}
					onSocialLogin={handleSocialLogin}
					onAccessCodeSubmit={handleAccessCodeSubmit}
				/>
			)}

			{currentStep === "registration" && (
				<div className="text-center">
					<p>Registration form coming next...</p>
					<button
						type="button"
						onClick={() => setCurrentStep("home")}
						className="text-blue-500 underline mt-4"
					>
						Back to home
					</button>
				</div>
			)}

			{/* Debug info */}
			<div className="mt-4 text-xs text-muted-foreground text-center">
				Workspace: {workspaceId} | Step: {currentStep}
			</div>
		</PortalContainer>
	);
}
