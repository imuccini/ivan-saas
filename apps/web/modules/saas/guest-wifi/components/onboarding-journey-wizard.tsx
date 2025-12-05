"use client";

import { Button } from "@ui/components/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
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
	const [currentStep, setCurrentStep] = useState(1);

	// Shared state across steps
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
	const [title, setTitle] = useState("Get online with free WiFi");
	const [description, setDescription] = useState(
		"How do you want to connect?",
	);
	const [backgroundType, setBackgroundType] = useState("image");
	const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
	const [backgroundColor, setBackgroundColor] = useState("#6366f1");
	const [gradientColor1, setGradientColor1] = useState("#6366f1");
	const [gradientColor2, setGradientColor2] = useState("#ec4899");

	// Authentication State
	const [showLoginOption, setShowLoginOption] = useState(true);
	const [appleIdEnabled, setAppleIdEnabled] = useState(false);
	const [accessCodesEnabled, setAccessCodesEnabled] = useState(false);
	const [enterpriseIdpEnabled, setEnterpriseIdpEnabled] = useState(false);
	const [selectedIdps, setSelectedIdps] = useState<string[]>([]);
	const [terms, setTerms] = useState<SelectedTerm[]>([
		{
			id: "1",
			termDefinitionId: "term-1",
			required: true,
		},
		{
			id: "2",
			termDefinitionId: "term-2",
			required: false,
		},
	]);

	// Text & Labels State
	const [signupButtonText, setSignupButtonText] = useState("Register");
	const [loginButtonText, setLoginButtonText] = useState(
		"Login with your account",
	);
	const [sponsorMessage, setSponsorMessage] = useState(
		"You need to wait that your host approves your access",
	);
	const [phoneValidationMessage, setPhoneValidationMessage] = useState(
		"You need to validate your phone number",
	);
	const [successMessage, setSuccessMessage] = useState(
		"You're all set! Enjoy your WiFi connection.",
	);
	const [blockedMessage, setBlockedMessage] = useState(
		"Sorry, you have used all your WiFi time allowance for today.",
	);
	const [easyWifiCtaMessage, setEasyWifiCtaMessage] = useState(
		"You need to wait that your host approves your access",
	);
	const [easyWifiSkipMessage, setEasyWifiSkipMessage] = useState(
		"I'll take my chances",
	);

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

	if (!open) return null;

	const handleSaveAndContinue = () => {
		if (currentStep < STEPS.length) {
			setCurrentStep(currentStep + 1);
		} else {
			// Save and close
			onClose();
		}
	};

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
								>
									Save & Continue
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
									// Content props
									logo={logo}
									setLogo={setLogo}
									logoSize={logoSize}
									setLogoSize={setLogoSize}
									title={title}
									setTitle={setTitle}
									description={description}
									setDescription={setDescription}
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
									signupButtonText={signupButtonText}
									setSignupButtonText={setSignupButtonText}
									loginButtonText={loginButtonText}
									setLoginButtonText={setLoginButtonText}
									sponsorMessage={sponsorMessage}
									setSponsorMessage={setSponsorMessage}
									phoneValidationMessage={
										phoneValidationMessage
									}
									setPhoneValidationMessage={
										setPhoneValidationMessage
									}
									successMessage={successMessage}
									setSuccessMessage={setSuccessMessage}
									blockedMessage={blockedMessage}
									setBlockedMessage={setBlockedMessage}
									easyWifiCtaMessage={easyWifiCtaMessage}
									setEasyWifiCtaMessage={
										setEasyWifiCtaMessage
									}
									easyWifiSkipMessage={easyWifiSkipMessage}
									setEasyWifiSkipMessage={
										setEasyWifiSkipMessage
									}
								/>
							)}
						</div>

						{/* Right Panel - Preview */}
						<div className="w-1/2 bg-muted/30">
							<WizardPreview
								registrationFields={registrationFields}
								easyWifiEnabled={easyWifiEnabled}
								sponsorshipEnabled={sponsorshipEnabled}
								phoneValidationEnabled={phoneValidationEnabled}
								successRedirectMode={successRedirectMode}
								fontFamily={fontFamily}
								baseFontSize={baseFontSize}
								baseColor={baseColor}
								primaryColor={primaryColor}
								spacing={spacing}
								logo={logo}
								logoSize={logoSize}
								title={title}
								description={description}
								backgroundType={backgroundType}
								backgroundImage={backgroundImage}
								backgroundColor={backgroundColor}
								gradientColor1={gradientColor1}
								gradientColor2={gradientColor2}
								signupButtonText={signupButtonText}
								loginButtonText={loginButtonText}
								sponsorMessage={sponsorMessage}
								phoneValidationMessage={phoneValidationMessage}
								successMessage={successMessage}
								blockedMessage={blockedMessage}
								easyWifiCtaMessage={easyWifiCtaMessage}
								easyWifiSkipMessage={easyWifiSkipMessage}
								showLoginOption={showLoginOption}
								appleIdEnabled={appleIdEnabled}
								accessCodesEnabled={accessCodesEnabled}
								enterpriseIdpEnabled={enterpriseIdpEnabled}
								selectedIdps={selectedIdps}
								terms={terms}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
