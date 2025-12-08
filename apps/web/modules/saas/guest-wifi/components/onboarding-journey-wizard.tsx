"use client";

import { Loader2 } from "lucide-react";
import { StepAuthentication } from "./steps/step-1-authentication";
import { StepContent } from "./steps/step-2-content";
import { StepJourney } from "./steps/step-3-journey";
import { useWizard, WizardProvider } from "./wizard-context";
import { WizardHeader } from "./wizard-header";
import { WizardPreview } from "./wizard-preview";

interface OnboardingJourneyWizardProps {
	open: boolean;
	onClose: () => void;
}

function WizardContent({ onClose }: { onClose: () => void }) {
	const {
		currentStep,
		isLoadingConfig,
		// State for StepJourney and StepContent (passed as props for now)
		easyWifiEnabled,
		setEasyWifiEnabled,
		successRedirectMode,
		setSuccessRedirectMode,
		registrationFields,
		sponsorshipEnabled,
		phoneValidationEnabled,
		guestRegistrationEnabled,
		registrationMode,
		showLoginOption,
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
		logo,
		setLogo,
		logoSize,
		setLogoSize,
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
		content,
		setContent,
		selectedLanguages,
		setSelectedLanguages,
		activeLanguage,
		setActiveLanguage,
		previewPage,
		setPreviewPage,
		// State for Preview
		getContentForLanguage,
		appleIdEnabled,
		accessCodesEnabled,
		enterpriseIdpEnabled,
		selectedIdps,
		terms,
		availableTerms,
	} = useWizard();

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
					<WizardHeader onClose={onClose} />

					{/* Content Area - Split View */}
					<div className="flex-1 flex overflow-hidden rounded-b-2xl border border-t-0 bg-card text-card-foreground shadow-sm">
						{/* Left Panel - Configuration */}
						<div className="w-1/2 overflow-y-auto border-r">
							{currentStep === 1 && <StepAuthentication />}
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
									guestRegistrationEnabled={
										guestRegistrationEnabled
									}
									registrationMode={registrationMode}
									showLoginOption={showLoginOption}
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
									previewPage={previewPage}
									setPreviewPage={setPreviewPage}
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
								registrationTitle={
									getContentForLanguage(activeLanguage)
										.registrationTitle
								}
								registrationDescription={
									getContentForLanguage(activeLanguage)
										.registrationDescription
								}
								registrationSubmitButtonText={
									getContentForLanguage(activeLanguage)
										.registrationSubmitButtonText
								}
								guestRegistrationEnabled={
									guestRegistrationEnabled
								}
								registrationMode={registrationMode}
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
								previewPage={previewPage}
								setPreviewPage={setPreviewPage}
								availableTerms={availableTerms}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function OnboardingJourneyWizard({
	open,
	onClose,
}: OnboardingJourneyWizardProps) {
	if (!open) return null;

	return (
		<WizardProvider open={open} onClose={onClose}>
			<WizardContent onClose={onClose} />
		</WizardProvider>
	);
}
