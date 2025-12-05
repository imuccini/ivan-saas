"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { StepAuthentication } from "./steps/step-1-authentication";
import { StepContent } from "./steps/step-2-content";
import { StepJourney } from "./steps/step-3-journey";
import { WizardPreview } from "./wizard-preview";

interface OnboardingJourneyWizardProps {
	open: boolean;
	onClose: () => void;
}

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

const STEPS = [
	{ id: 1, name: "Authentication", component: StepAuthentication },
	{ id: 2, name: "Journey", component: StepJourney },
	{ id: 3, name: "Content", component: StepContent },
];

export function OnboardingJourneyWizard({
	open,
	onClose,
}: OnboardingJourneyWizardProps) {
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

	// Shared state across steps - initialized from saved config
	const [easyWifiEnabled, setEasyWifiEnabled] = useState(false);
	const [sponsorshipEnabled, setSponsorshipEnabled] = useState(false);
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
		field: keyof typeof defaultContent,
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
	const [showLoginOption, setShowLoginOption] = useState(true);
	const [appleIdEnabled, setAppleIdEnabled] = useState(false);
	const [accessCodesEnabled, setAccessCodesEnabled] = useState(false);
	const [enterpriseIdpEnabled, setEnterpriseIdpEnabled] = useState(false);
	const [selectedIdps, setSelectedIdps] = useState<string[]>([]);
	const [terms, setTerms] = useState<SelectedTerm[]>([]);

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

	if (!open) return null;

	const handleSaveAndContinue = () => {
		// Save current state
		if (workspace?.id) {
			saveMutation.mutate({
				workspaceId: workspace.id,
				name: "Default",
				config: buildConfigFromState(),
			});
		}

		if (currentStep < STEPS.length) {
			setCurrentStep(currentStep + 1);
		} else {
			// Final save and close
			onClose();
		}
	};

	// Show loading while fetching config
	if (isLoadingConfig) {
		return (
			<div
				className="fixed inset-0 z-40 flex items-center justify-center"
				style={{ backgroundColor: "var(--sidebar)" }}
			>
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					<p className="text-muted-foreground">
						Loading configuration...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="fixed inset-0 z-40"
			style={{ backgroundColor: "var(--sidebar)" }}
		>
			<div className="h-full w-full p-5">
				<div className="h-full flex flex-col">
					{/* Header */}
					<div className="rounded-t-2xl border bg-card text-card-foreground shadow-sm">
						<div className="flex items-center justify-between px-6 py-4">
							{/* Breadcrumb Navigation */}
							<div className="flex items-center gap-2">
								{STEPS.map((step, index) => (
									<div
										key={step.id}
										className="flex items-center gap-2"
									>
										<button
											type="button"
											onClick={() =>
												setCurrentStep(step.id)
											}
											className={`text-sm font-medium transition-colors ${
												currentStep === step.id
													? "text-foreground"
													: "text-muted-foreground hover:text-foreground"
											}`}
										>
											{step.name}
										</button>
										{index < STEPS.length - 1 && (
											<span className="text-muted-foreground">
												›
											</span>
										)}
									</div>
								))}
							</div>

							{/* Actions */}
							<div className="flex items-center gap-2">
								<Button variant="ghost" onClick={onClose}>
									Exit
								</Button>
								<Button
									onClick={handleSaveAndContinue}
									className="gap-2"
									disabled={saveMutation.isPending}
								>
									{saveMutation.isPending && (
										<Loader2 className="h-4 w-4 animate-spin" />
									)}
									{currentStep === STEPS.length
										? "Publish"
										: "Save & Continue"}
									<ArrowRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* Content Area - Split View */}
					<div className="flex-1 flex overflow-hidden rounded-b-2xl border border-t-0 bg-card text-card-foreground shadow-sm">
						{/* Left Panel - Configuration */}
						<div className="w-1/2 overflow-y-auto border-r">
							{currentStep === 1 && (
								<StepAuthentication
									registrationFields={registrationFields}
									setRegistrationFields={
										setRegistrationFields
									}
									sponsorshipEnabled={sponsorshipEnabled}
									setSponsorshipEnabled={
										setSponsorshipEnabled
									}
									phoneValidationEnabled={
										phoneValidationEnabled
									}
									setPhoneValidationEnabled={
										setPhoneValidationEnabled
									}
									showLoginOption={showLoginOption}
									setShowLoginOption={setShowLoginOption}
									appleIdEnabled={appleIdEnabled}
									setAppleIdEnabled={setAppleIdEnabled}
									accessCodesEnabled={accessCodesEnabled}
									setAccessCodesEnabled={
										setAccessCodesEnabled
									}
									enterpriseIdpEnabled={enterpriseIdpEnabled}
									setEnterpriseIdpEnabled={
										setEnterpriseIdpEnabled
									}
									selectedIdps={selectedIdps}
									setSelectedIdps={setSelectedIdps}
									terms={terms}
									setTerms={setTerms}
								/>
							)}
							{currentStep === 2 && (
								<StepJourney
									easyWifiEnabled={easyWifiEnabled}
									setEasyWifiEnabled={setEasyWifiEnabled}
									successRedirectMode={successRedirectMode}
									setSuccessRedirectMode={
										setSuccessRedirectMode
									}
								/>
							)}
							{currentStep === 3 && (
								<StepContent
									registrationFields={registrationFields}
									easyWifiEnabled={easyWifiEnabled}
									sponsorshipEnabled={sponsorshipEnabled}
									phoneValidationEnabled={
										phoneValidationEnabled
									}
									successRedirectMode={successRedirectMode}
									fontFamily={fontFamily}
									setFontFamily={setFontFamily}
									baseFontSize={baseFontSize}
									setBaseFontSize={setBaseFontSize}
									baseColor={baseColor}
									setBaseColor={setBaseColor}
									primaryColor={primaryColor}
									setPrimaryColor={setPrimaryColor}
									spacing={spacing}
									setSpacing={setSpacing}
									logo={logo}
									setLogo={setLogo}
									logoSize={logoSize}
									setLogoSize={setLogoSize}
									backgroundType={backgroundType}
									setBackgroundType={setBackgroundType}
									backgroundImage={backgroundImage}
									setBackgroundImage={setBackgroundImage}
									backgroundColor={backgroundColor}
									setBackgroundColor={setBackgroundColor}
									gradientColor1={gradientColor1}
									setGradientColor1={setGradientColor1}
									gradientColor2={gradientColor2}
									setGradientColor2={setGradientColor2}
									content={content}
									setContent={setContent}
									selectedLanguages={selectedLanguages}
									setSelectedLanguages={setSelectedLanguages}
									activeLanguage={activeLanguage}
									setActiveLanguage={setActiveLanguage}
								/>
							)}
						</div>

						{/* Right Panel - Preview */}
						<div className="w-1/2 overflow-y-auto bg-muted/50">
							<WizardPreview
								registrationFields={registrationFields}
								logo={logo}
								logoSize={logoSize}
								title={
									getContentForLanguage(activeLanguage).title
								}
								description={
									getContentForLanguage(activeLanguage)
										.description
								}
								signupButtonText={
									getContentForLanguage(activeLanguage)
										.signupButtonText
								}
								loginButtonText={
									getContentForLanguage(activeLanguage)
										.loginButtonText
								}
								showLoginOption={showLoginOption}
								appleIdEnabled={appleIdEnabled}
								accessCodesEnabled={accessCodesEnabled}
								enterpriseIdpEnabled={enterpriseIdpEnabled}
								selectedIdps={selectedIdps}
								terms={terms}
								fontFamily={fontFamily}
								baseFontSize={baseFontSize}
								baseColor={baseColor}
								primaryColor={primaryColor}
								spacing={spacing}
								backgroundType={backgroundType}
								backgroundColor={backgroundColor}
								gradientColor1={gradientColor1}
								gradientColor2={gradientColor2}
								backgroundImage={backgroundImage}
								easyWifiEnabled={easyWifiEnabled}
								sponsorshipEnabled={sponsorshipEnabled}
								phoneValidationEnabled={phoneValidationEnabled}
								successRedirectMode={successRedirectMode}
								sponsorMessage={
									getContentForLanguage(activeLanguage)
										.sponsorMessage
								}
								phoneValidationMessage={
									getContentForLanguage(activeLanguage)
										.phoneValidationMessage
								}
								successMessage={
									getContentForLanguage(activeLanguage)
										.successMessage
								}
								blockedMessage={
									getContentForLanguage(activeLanguage)
										.blockedMessage
								}
								easyWifiCtaMessage={
									getContentForLanguage(activeLanguage)
										.easyWifiCtaMessage
								}
								easyWifiSkipMessage={
									getContentForLanguage(activeLanguage)
										.easyWifiSkipMessage
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
