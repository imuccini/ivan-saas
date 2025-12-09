"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import equal from "fast-deep-equal";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

// --- Types ---

export interface FormField {
	id: string;
	label: string;
	placeholder?: string;
	required: boolean;
	type: string;
	isCustom?: boolean;
	options?: string[];
}

export interface SelectedTerm {
	id: string;
	termDefinitionId: string;
	required: boolean;
}

export interface TermTranslations {
	[languageCode: string]: {
		label: string;
		linkText: string;
		documentTitle: string;
		documentContent: string;
	};
}

export interface WizardState {
	// Navigation
	currentStep: number;
	setCurrentStep: (step: number) => void;

	// Authentication
	guestRegistrationEnabled: boolean;
	setGuestRegistrationEnabled: (enabled: boolean) => void;
	registrationMode: "form" | "button";
	setRegistrationMode: (mode: "form" | "button") => void;
	showLoginOption: boolean;
	setShowLoginOption: (show: boolean) => void;
	appleIdEnabled: boolean;
	setAppleIdEnabled: (enabled: boolean) => void;
	accessCodesEnabled: boolean;
	setAccessCodesEnabled: (enabled: boolean) => void;
	enterpriseIdpEnabled: boolean;
	setEnterpriseIdpEnabled: (enabled: boolean) => void;
	selectedIdps: string[];
	setSelectedIdps: (idps: string[]) => void;
	terms: SelectedTerm[];
	setTerms: (terms: SelectedTerm[]) => void;
	registrationFields: FormField[];
	setRegistrationFields: (fields: FormField[]) => void;
	sponsorshipEnabled: boolean;
	setSponsorshipEnabled: (enabled: boolean) => void;
	sponsorSelectionMode: "dropdown" | "type";
	setSponsorSelectionMode: (mode: "dropdown" | "type") => void;
	phoneValidationEnabled: boolean;
	setPhoneValidationEnabled: (enabled: boolean) => void;

	// Journey
	easyWifiEnabled: boolean;
	setEasyWifiEnabled: (enabled: boolean) => void;
	successRedirectMode: string;
	setSuccessRedirectMode: (mode: string) => void;

	// Style
	fontFamily: string;
	setFontFamily: (font: string) => void;
	baseFontSize: string;
	setBaseFontSize: (size: string) => void;
	baseColor: string;
	setBaseColor: (color: string) => void;
	primaryColor: string;
	setPrimaryColor: (color: string) => void;
	spacing: string;
	setSpacing: (spacing: string) => void;
	backgroundType: string;
	setBackgroundType: (type: string) => void;
	backgroundImage: string | null;
	setBackgroundImage: (url: string | null) => void;
	backgroundColor: string;
	setBackgroundColor: (color: string) => void;
	gradientColor1: string;
	setGradientColor1: (color: string) => void;
	gradientColor2: string;
	setGradientColor2: (color: string) => void;

	// Content
	logo: string | null;
	setLogo: (url: string | null) => void;
	logoSize: number;
	setLogoSize: (size: number) => void;
	selectedLanguages: string[];
	setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>;
	activeLanguage: string;
	setActiveLanguage: React.Dispatch<React.SetStateAction<string>>;
	content: Record<string, any>;
	setContent: React.Dispatch<React.SetStateAction<Record<string, any>>>;
	getContentForLanguage: (lang: string) => any;
	updateContentForLanguage: (
		lang: string,
		field: string,
		value: string,
	) => void;

	// Preview
	previewPage: string;
	setPreviewPage: (page: string) => void;

	// Data
	availableTerms: any[];
	isLoadingConfig: boolean;
	saveMutation: any;
	hasUnsavedChanges: boolean;

	// Actions
	handleSaveAndContinue: () => void;
	handleClose: () => void;
}

// --- Context ---

const WizardContext = createContext<WizardState | undefined>(undefined);

export function useWizard() {
	const context = useContext(WizardContext);
	if (!context) {
		throw new Error("useWizard must be used within a WizardProvider");
	}
	return context;
}

// --- Provider ---

interface WizardProviderProps {
	children: ReactNode;
	open: boolean;
	onClose: () => void;
}

export function WizardProvider({
	children,
	open,
	onClose,
}: WizardProviderProps) {
	const { activeWorkspace: workspace } = useActiveWorkspace();
	const queryClient = useQueryClient();
	const [currentStep, setCurrentStep] = useState(1);

	// Fetch existing config
	const { data: savedConfig, isLoading: isLoadingConfig } = useQuery({
		...orpc.guestWifi.get.queryOptions({
			input: { workspaceId: workspace?.id || "" },
		}),
		enabled: !!workspace?.id && open,
	});

	// Fetch available terms
	const { data: termsData = [] } = useQuery(
		orpc.terms.list.queryOptions({
			input: {
				workspaceId: workspace?.id || "",
				status: "PUBLISHED",
			},
			enabled: !!workspace?.id,
		}),
	);

	const availableTerms = termsData.map((term) => {
		const translations = term.translations as TermTranslations;
		return {
			id: term.id,
			title: term.name,
			label: translations?.en?.label || term.name,
		};
	});

	// Shared state across steps - initialized from saved config
	const [easyWifiEnabled, setEasyWifiEnabled] = useState(false);
	const [sponsorshipEnabled, setSponsorshipEnabled] = useState(false);
	const [sponsorSelectionMode, setSponsorSelectionMode] = useState<
		"dropdown" | "type"
	>("dropdown");
	const [phoneValidationEnabled, setPhoneValidationEnabled] = useState(false);
	const [successRedirectMode, setSuccessRedirectMode] = useState("text");

	// Style State
	const [fontFamily, setFontFamily] = useState("Inter");
	const [baseFontSize, setBaseFontSize] = useState("16");
	const [baseColor, setBaseColor] = useState("#1F2937");
	const [primaryColor, setPrimaryColor] = useState("#111827");
	const [spacing, setSpacing] = useState("balanced");

	// Content State
	const [logo, setLogo] = useState<string | null>(null);
	const [logoSize, setLogoSize] = useState(50);
	const [backgroundType, setBackgroundType] = useState("image");
	const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
	const [backgroundColor, setBackgroundColor] = useState("#6366f1");
	const [gradientColor1, setGradientColor1] = useState("#6366f1");
	const [gradientColor2, setGradientColor2] = useState("#ec4899");

	// Multi-language content state
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
		"en",
	]);
	const [activeLanguage, setActiveLanguage] = useState("en");

	// Default content per language
	const defaultContent = {
		title: "Get online with free WiFi",
		description: "How do you want to connect?",
		signupButtonText: "Register",
		loginButtonText: "Login with your account",
		registrationTitle: "Register for WiFi",
		registrationDescription: "Please fill in your details to get online",
		registrationSubmitButtonText: "Register",
		sponsorMessage: "You need to wait that your host approves your access",
		phoneValidationMessage: "You need to validate your phone number",
		successMessage: "You're all set! Enjoy your WiFi connection.",
		blockedMessage:
			"Sorry, you have used all your WiFi time allowance for today.",
		easyWifiCtaMessage:
			"You need to wait that your host approves your access",
		easyWifiSkipMessage: "I'll take my chances",
	};

	const [content, setContent] = useState<
		Record<string, typeof defaultContent>
	>({
		en: { ...defaultContent },
	});

	// Helper to get content for active language (with fallback to English)
	const getContentForLanguage = (lang: string) => {
		return content[lang] || content.en || defaultContent;
	};

	// Helper to update content for a specific language
	const updateContentForLanguage = (
		lang: string,
		field: string,
		value: string,
	) => {
		setContent((prev) => ({
			...prev,
			[lang]: {
				...(prev[lang] || defaultContent),
				[field]: value,
			},
		}));
	};

	// Authentication State
	const [guestRegistrationEnabled, setGuestRegistrationEnabled] =
		useState(true);
	const [registrationMode, setRegistrationMode] = useState<"form" | "button">(
		"form",
	);
	const [showLoginOption, setShowLoginOption] = useState(true);
	const [appleIdEnabled, setAppleIdEnabled] = useState(false);
	const [accessCodesEnabled, setAccessCodesEnabled] = useState(false);
	const [enterpriseIdpEnabled, setEnterpriseIdpEnabled] = useState(false);
	const [selectedIdps, setSelectedIdps] = useState<string[]>([]);
	const [terms, setTerms] = useState<SelectedTerm[]>([]);

	const [previewPage, setPreviewPage] = useState("home");
	const [initialConfig, setInitialConfig] = useState<any>(null);

	const [registrationFields, setRegistrationFields] = useState<FormField[]>([
		{
			id: "1",
			label: "First Name",
			placeholder: "Enter your first name",
			required: false,
			type: "text",
		},
		{
			id: "3",
			label: "Email",
			placeholder: "Enter your email address",
			required: true,
			type: "email",
		},
	]);

	// Load saved config into state when it arrives
	useEffect(() => {
		if (savedConfig?.config) {
			const config = savedConfig.config;

			// Authentication
			if (config.authentication.guestRegistrationEnabled !== undefined) {
				setGuestRegistrationEnabled(
					config.authentication.guestRegistrationEnabled,
				);
			}
			if (config.authentication.registrationMode) {
				setRegistrationMode(
					config.authentication.registrationMode as "form" | "button",
				);
			}
			setShowLoginOption(config.authentication.showLoginOption);
			setAppleIdEnabled(config.authentication.appleIdEnabled);
			setAccessCodesEnabled(config.authentication.accessCodesEnabled);
			setEnterpriseIdpEnabled(config.authentication.enterpriseIdpEnabled);
			setSelectedIdps(config.authentication.selectedIdps);
			setSponsorshipEnabled(config.authentication.sponsorshipEnabled);
			setPhoneValidationEnabled(
				config.authentication.phoneValidationEnabled,
			);
			setRegistrationFields(config.authentication.registrationFields);
			setTerms(config.authentication.terms);

			// Journey
			setEasyWifiEnabled(config.journey.easyWifiEnabled);
			setSuccessRedirectMode(config.journey.successRedirectMode);

			// Style
			setFontFamily(config.style.fontFamily);
			setBaseFontSize(config.style.baseFontSize);
			setBaseColor(config.style.baseColor);
			setPrimaryColor(config.style.primaryColor);
			setSpacing(config.style.spacing);
			setBackgroundType(config.style.backgroundType);
			if (config.style.backgroundColor) {
				setBackgroundColor(config.style.backgroundColor);
			}
			if (config.style.gradientColor1) {
				setGradientColor1(config.style.gradientColor1);
			}
			if (config.style.gradientColor2) {
				setGradientColor2(config.style.gradientColor2);
			}

			// Assets
			setLogoSize(config.assets.logoSize);
			if (config.assets.logoUrl) setLogo(config.assets.logoUrl);
			if (config.assets.backgroundImageUrl) {
				setBackgroundImage(config.assets.backgroundImageUrl);
			}

			// Languages
			if (config.languages) {
				setSelectedLanguages(config.languages);
			}
			if (config.defaultLanguage) {
				setActiveLanguage(config.defaultLanguage);
			}

			// Content - load all languages
			if (config.content) {
				setContent(config.content);
			}

			// Set initial config for dirty checking
			setInitialConfig({
				authentication: {
					guestRegistrationEnabled:
						config.authentication.guestRegistrationEnabled ?? true,
					registrationMode:
						config.authentication.registrationMode || "form",
					showLoginOption: config.authentication.showLoginOption,
					appleIdEnabled: config.authentication.appleIdEnabled,
					accessCodesEnabled:
						config.authentication.accessCodesEnabled,
					enterpriseIdpEnabled:
						config.authentication.enterpriseIdpEnabled,
					selectedIdps: config.authentication.selectedIdps,
					sponsorshipEnabled:
						config.authentication.sponsorshipEnabled,
					phoneValidationEnabled:
						config.authentication.phoneValidationEnabled,
					registrationFields:
						config.authentication.registrationFields,
					terms: config.authentication.terms,
				},
				journey: {
					easyWifiEnabled: config.journey.easyWifiEnabled,
					successRedirectMode: config.journey.successRedirectMode,
					autoConnectReturning: true,
					allowBypassWithCode: true,
					allowExtensionRequest: true,
				},
				style: {
					fontFamily: config.style.fontFamily,
					baseFontSize: config.style.baseFontSize,
					baseColor: config.style.baseColor,
					primaryColor: config.style.primaryColor,
					spacing: config.style.spacing,
					backgroundType: config.style.backgroundType,
					backgroundColor: config.style.backgroundColor || "#6366f1",
					gradientColor1: config.style.gradientColor1 || "#6366f1",
					gradientColor2: config.style.gradientColor2 || "#ec4899",
				},
				content: config.content || { en: { ...defaultContent } },
				assets: {
					logoUrl: config.assets.logoUrl || undefined,
					logoSize: config.assets.logoSize,
					backgroundImageUrl:
						config.assets.backgroundImageUrl || undefined,
				},
				languages: config.languages || ["en"],
				defaultLanguage: config.defaultLanguage || "en",
			});
		}
	}, [savedConfig]);

	// Save mutation
	const saveMutation = useMutation(
		orpc.guestWifi.save.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.guestWifi.get.queryKey({
						input: { workspaceId: workspace?.id || "" },
					}),
				});
			},
		}),
	);

	const buildConfigFromState = () => ({
		authentication: {
			guestRegistrationEnabled,
			registrationMode,
			showLoginOption,
			appleIdEnabled,
			accessCodesEnabled,
			enterpriseIdpEnabled,
			selectedIdps,
			sponsorshipEnabled,
			phoneValidationEnabled,
			registrationFields,
			terms,
		},
		journey: {
			easyWifiEnabled,
			successRedirectMode: successRedirectMode as "external" | "text",
			autoConnectReturning: true,
			allowBypassWithCode: true,
			allowExtensionRequest: true,
		},
		style: {
			fontFamily,
			baseFontSize,
			baseColor,
			primaryColor,
			spacing,
			backgroundType: backgroundType as "image" | "color" | "gradient",
			backgroundColor,
			gradientColor1,
			gradientColor2,
		},
		content,
		assets: {
			logoUrl: logo || undefined,
			logoSize,
			backgroundImageUrl: backgroundImage || undefined,
		},
		languages: selectedLanguages,
		defaultLanguage: activeLanguage,
	});

	// Check for unsaved changes
	const hasUnsavedChanges = useMemo(() => {
		if (!initialConfig) return false;

		const currentConfig = buildConfigFromState();

		// Use fast-deep-equal for comparison
		return !equal(currentConfig, initialConfig);
	}, [
		initialConfig,
		guestRegistrationEnabled,
		registrationMode,
		showLoginOption,
		appleIdEnabled,
		accessCodesEnabled,
		enterpriseIdpEnabled,
		selectedIdps,
		sponsorshipEnabled,
		phoneValidationEnabled,
		registrationFields,
		terms,
		easyWifiEnabled,
		successRedirectMode,
		fontFamily,
		baseFontSize,
		baseColor,
		primaryColor,
		spacing,
		backgroundType,
		backgroundColor,
		gradientColor1,
		gradientColor2,
		content,
		logo,
		logoSize,
		backgroundImage,
		selectedLanguages,
		activeLanguage,
		savedConfig,
	]);

	const handleSaveAndContinue = () => {
		// Save current state
		if (workspace?.id) {
			saveMutation.mutate({
				workspaceId: workspace.id,
				name: "Default",
				config: buildConfigFromState(),
			});
		}

		if (currentStep < 3) {
			// Hardcoded max steps for now
			setCurrentStep(currentStep + 1);
		} else {
			// Final save and close
			onClose();
		}
	};

	const handleClose = () => {
		// This logic will be handled by the consumer using hasUnsavedChanges
		onClose();
	};

	const value: WizardState = {
		currentStep,
		setCurrentStep,
		guestRegistrationEnabled,
		setGuestRegistrationEnabled,
		registrationMode,
		setRegistrationMode,
		showLoginOption,
		setShowLoginOption,
		appleIdEnabled,
		setAppleIdEnabled,
		accessCodesEnabled,
		setAccessCodesEnabled,
		enterpriseIdpEnabled,
		setEnterpriseIdpEnabled,
		selectedIdps,
		setSelectedIdps,
		terms,
		setTerms,
		registrationFields,
		setRegistrationFields,
		sponsorshipEnabled,
		setSponsorshipEnabled,
		sponsorSelectionMode,
		setSponsorSelectionMode,
		phoneValidationEnabled,
		setPhoneValidationEnabled,
		easyWifiEnabled,
		setEasyWifiEnabled,
		successRedirectMode,
		setSuccessRedirectMode,
		fontFamily,
		setFontFamily,
		baseFontSize,
		setBaseFontSize,
		baseColor,
		setBaseColor,
		primaryColor,
		setPrimaryColor,
		spacing,
		setSpacing,
		backgroundType,
		setBackgroundType,
		backgroundImage,
		setBackgroundImage,
		backgroundColor,
		setBackgroundColor,
		gradientColor1,
		setGradientColor1,
		gradientColor2,
		setGradientColor2,
		logo,
		setLogo,
		logoSize,
		setLogoSize,
		selectedLanguages,
		setSelectedLanguages,
		activeLanguage,
		setActiveLanguage,
		content,
		setContent,
		getContentForLanguage,
		updateContentForLanguage,
		previewPage,
		setPreviewPage,
		availableTerms,
		isLoadingConfig,
		saveMutation,
		hasUnsavedChanges,
		handleSaveAndContinue,
		handleClose,
	};

	return (
		<WizardContext.Provider value={value}>
			{children}
		</WizardContext.Provider>
	);
}
