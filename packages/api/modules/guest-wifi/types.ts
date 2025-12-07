import { z } from "zod";

// Form field schema
export const formFieldSchema = z.object({
	id: z.string(),
	label: z.string(),
	placeholder: z.string().optional(),
	required: z.boolean(),
	type: z.string(),
	isCustom: z.boolean().optional(),
	options: z.array(z.string()).optional(),
});

// Selected term schema
export const selectedTermSchema = z.object({
	id: z.string(),
	termDefinitionId: z.string(),
	required: z.boolean(),
});

// Content per language schema
export const contentPerLanguageSchema = z.object({
	title: z.string(),
	description: z.string(),
	signupButtonText: z.string(),
	loginButtonText: z.string(),
	registrationTitle: z.string().default("Register for WiFi"),
	registrationDescription: z.string().default("Please fill in your details to get online"),
	registrationSubmitButtonText: z.string().default("Register"),
	sponsorMessage: z.string(),
	phoneValidationMessage: z.string(),
	successMessage: z.string(),
	blockedMessage: z.string(),
	easyWifiCtaMessage: z.string(),
	easyWifiSkipMessage: z.string(),
});

// Main config schema
export const guestWifiConfigDataSchema = z.object({
	// Authentication settings
	authentication: z.object({
		guestRegistrationEnabled: z.boolean().optional(),
		registrationMode: z.enum(["form", "button"]).optional(),
		showLoginOption: z.boolean(),
		appleIdEnabled: z.boolean(),
		accessCodesEnabled: z.boolean(),
		enterpriseIdpEnabled: z.boolean(),
		selectedIdps: z.array(z.string()),
		sponsorshipEnabled: z.boolean(),
		phoneValidationEnabled: z.boolean(),
		registrationFields: z.array(formFieldSchema),
		terms: z.array(selectedTermSchema),
	}),

	// Journey settings
	journey: z.object({
		easyWifiEnabled: z.boolean(),
		successRedirectMode: z.enum(["external", "text"]),
		successRedirectUrl: z.string().optional(),
		autoConnectReturning: z.boolean(),
		allowBypassWithCode: z.boolean(),
		allowExtensionRequest: z.boolean(),
	}),

	// Style settings
	style: z.object({
		fontFamily: z.string(),
		baseFontSize: z.string(),
		baseColor: z.string(),
		primaryColor: z.string(),
		spacing: z.string(),
		backgroundType: z.enum(["image", "color", "gradient"]),
		backgroundColor: z.string().optional(),
		gradientColor1: z.string().optional(),
		gradientColor2: z.string().optional(),
	}),

	// Content per language
	content: z.record(z.string(), contentPerLanguageSchema),

	// Assets
	assets: z.object({
		logoUrl: z.string().optional(),
		logoSize: z.number(),
		backgroundImageUrl: z.string().optional(),
	}),

	// Languages
	languages: z.array(z.string()),
	defaultLanguage: z.string(),
});

// TypeScript types
export type FormField = z.infer<typeof formFieldSchema>;
export type SelectedTerm = z.infer<typeof selectedTermSchema>;
export type ContentPerLanguage = z.infer<typeof contentPerLanguageSchema>;
export type GuestWifiConfigData = z.infer<typeof guestWifiConfigDataSchema>;

// Default config
export const defaultGuestWifiConfig: GuestWifiConfigData = {
	authentication: {
		guestRegistrationEnabled: true,
		registrationMode: "form" as const,
		showLoginOption: true,
		appleIdEnabled: false,
		accessCodesEnabled: false,
		enterpriseIdpEnabled: false,
		selectedIdps: [],
		sponsorshipEnabled: false,
		phoneValidationEnabled: false,
		registrationFields: [
			{
				id: "1",
				label: "First Name",
				placeholder: "Enter your first name",
				required: false,
				type: "text",
			},
			{
				id: "2",
				label: "Email",
				placeholder: "Enter your email address",
				required: true,
				type: "email",
			},
		],
		terms: [],
	},
	journey: {
		easyWifiEnabled: false,
		successRedirectMode: "text",
		autoConnectReturning: true,
		allowBypassWithCode: true,
		allowExtensionRequest: true,
	},
	style: {
		fontFamily: "Inter",
		baseFontSize: "16",
		baseColor: "#1F2937",
		primaryColor: "#111827",
		spacing: "balanced",
		backgroundType: "image",
	},
	content: {
		en: {
			title: "Get online with free WiFi",
			description: "How do you want to connect?",
			signupButtonText: "Register",
			loginButtonText: "Login with your account",
			sponsorMessage:
				"You need to wait that your host approves your access",
			phoneValidationMessage: "You need to validate your phone number",
			successMessage: "You're all set! Enjoy your WiFi connection.",
			blockedMessage:
				"Sorry, you have used all your WiFi time allowance for today.",
			easyWifiCtaMessage:
				"You need to wait that your host approves your access",
			easyWifiSkipMessage: "I'll take my chances",
		},
	},
	assets: {
		logoSize: 50,
	},
	languages: ["en"],
	defaultLanguage: "en",
};
