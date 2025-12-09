// Types shared between admin app and portal app

export interface CustomField {
	id: string;
	workspaceId: string;
	name: string;
	type: "text" | "select" | "boolean";
	validationType?: string | null;
	options?: unknown;
	translations: Record<string, { label: string; placeholder?: string }>;
	isRequired: boolean;
}

export interface Sponsor {
	id: string;
	fullName: string;
	email: string;
}

export interface Term {
	id: string;
	name: string;
	category: "PRIVACY_POLICY" | "TERMS_OF_USE" | "COOKIE_POLICY" | "OTHER";
	isMandatory: boolean;
	isPreChecked: boolean;
	translations: Record<
		string,
		{
			label: string;
			linkText?: string;
			documentTitle?: string;
			documentContent?: string;
		}
	>;
}

export interface PortalConfig {
	id: string;
	workspaceId: string;
	workspaceName: string;
	workspaceSlug: string;
	instanceName: string;
	config: Record<string, unknown>;
	customFields: CustomField[];
	sponsors: Sponsor[];
	terms: Term[];
	updatedAt: Date;
}

// Wizard configuration structure (from admin app)
export interface WizardConfig {
	// Authentication
	guestRegistrationEnabled: boolean;
	registrationMode: "simple" | "full";
	registrationFields: string[];
	appleIdEnabled: boolean;
	accessCodesEnabled: boolean;
	enterpriseIdpEnabled: boolean;
	selectedIdps: string[];
	sponsorshipEnabled: boolean;
	sponsorSelectionMode: "dropdown" | "input";
	phoneValidationEnabled: boolean;
	showLoginOption: boolean;
	terms: string[];

	// Journey
	easyWifiEnabled: boolean;
	successRedirectMode: "default" | "custom";
	successRedirectUrl?: string;

	// Content
	selectedLanguages: string[];
	content: Record<
		string,
		{
			title: string;
			description: string;
			signupButtonText: string;
			loginButtonText: string;
			registrationTitle: string;
			registrationDescription: string;
			registrationSubmitButtonText: string;
			sponsorMessage: string;
			phoneValidationMessage: string;
			successMessage: string;
			blockedMessage: string;
			easyWifiCtaMessage: string;
			easyWifiSkipMessage: string;
		}
	>;

	// Styling
	fontFamily: string;
	baseFontSize: number;
	baseColor: string;
	primaryColor: string;
	spacing: number;
	logo: string | null;
	logoSize: number;
	backgroundType: "solid" | "gradient" | "image";
	backgroundColor: string;
	gradientColor1: string;
	gradientColor2: string;
	backgroundImage: string | null;
}
