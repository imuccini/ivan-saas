"use client";

import { LanguageSelector } from "@shared/components/language-selector";
import { Button } from "@ui/components/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@ui/components/collapsible";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Slider } from "@ui/components/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { Textarea } from "@ui/components/textarea";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

interface FormField {
	id: string;
	label: string;
	placeholder?: string;
	required: boolean;
	type: string;
	isCustom?: boolean;
	options?: string[];
}

interface ContentPerLanguage {
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

interface StepContentProps {
	registrationFields: FormField[];
	easyWifiEnabled?: boolean;
	sponsorshipEnabled?: boolean;
	phoneValidationEnabled?: boolean;
	successRedirectMode?: string;
	guestRegistrationEnabled?: boolean;
	registrationMode?: "form" | "button";
	showLoginOption?: boolean;
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
	// Content props
	logo: string | null;
	setLogo: (logo: string | null) => void;
	logoSize: number;
	setLogoSize: (size: number) => void;
	backgroundType: string;
	setBackgroundType: (type: string) => void;
	backgroundImage: string | null;
	setBackgroundImage: (image: string | null) => void;
	backgroundColor: string;
	setBackgroundColor: (color: string) => void;
	gradientColor1: string;
	setGradientColor1: (color: string) => void;
	gradientColor2: string;
	setGradientColor2: (color: string) => void;
	// Multi-language content
	content: Record<string, ContentPerLanguage>;
	setContent: React.Dispatch<
		React.SetStateAction<Record<string, ContentPerLanguage>>
	>;
	selectedLanguages: string[];
	setSelectedLanguages: (languages: string[]) => void;
	activeLanguage: string;
	setActiveLanguage: (language: string) => void;
	previewPage: string;
	setPreviewPage: (page: string) => void;
}

export function StepContent({
	registrationFields,
	easyWifiEnabled,
	sponsorshipEnabled,
	phoneValidationEnabled,
	successRedirectMode,
	guestRegistrationEnabled = true,
	registrationMode = "form",
	showLoginOption = true,
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
}: StepContentProps) {
	const [selectedTab, setSelectedTab] = useState("content");

	// Default content structure
	const defaultContent: ContentPerLanguage = {
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

	// Get content for active language with fallback
	const activeContent =
		content[activeLanguage] || content.en || defaultContent;

	// Update content for active language
	const updateContent = (field: keyof ContentPerLanguage, value: string) => {
		setContent((prev) => ({
			...prev,
			[activeLanguage]: {
				...(prev[activeLanguage] || defaultContent),
				[field]: value,
			},
		}));
	};

	const logoInputRef = useRef<HTMLInputElement>(null);
	const bgInputRef = useRef<HTMLInputElement>(null);

	const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogo(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setBackgroundImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="h-full p-6">
			<Tabs
				value={selectedTab}
				onValueChange={setSelectedTab}
				className="w-full"
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="content">Content</TabsTrigger>
					<TabsTrigger value="style">Style</TabsTrigger>
				</TabsList>

				{/* Language Selector */}
				<div className="flex items-center gap-2 mt-4 mb-2">
					<span className="text-sm font-medium">Language:</span>
					<LanguageSelector
						selectedLanguages={selectedLanguages}
						activeLanguage={activeLanguage}
						onActiveLanguageChange={setActiveLanguage}
						onAddLanguage={(code) => {
							setSelectedLanguages([...selectedLanguages, code]);
							setActiveLanguage(code);
						}}
						onRemoveLanguage={(code) => {
							setSelectedLanguages(
								selectedLanguages.filter((c) => c !== code),
							);
						}}
						showRemoveButton={true}
						minLanguages={1}
					/>
				</div>

				{/* Content Tab */}
				<TabsContent
					value="content"
					className="mt-4 h-[calc(100vh-280px)]"
				>
					<div className="flex h-full gap-4">
						{/* Left Sidebar - Page Navigation (30%) */}
						<div className="w-[30%] border rounded-lg bg-card p-2">
							<div className="space-y-1">
								{/* Home Page */}
								<button
									type="button"
									onClick={() => setPreviewPage("home")}
									className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										previewPage === "home"
											? "bg-primary text-primary-foreground"
											: "hover:bg-accent"
									}`}
								>
									Home Page
								</button>

								{/* Registration Page - Only show when button mode */}
								{guestRegistrationEnabled &&
									registrationMode === "button" && (
										<button
											type="button"
											onClick={() =>
												setPreviewPage("registration")
											}
											className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
												previewPage === "registration"
													? "bg-primary text-primary-foreground"
													: "hover:bg-accent"
											}`}
										>
											Registration Page
										</button>
									)}

								{/* Sponsor Request */}
								{sponsorshipEnabled && (
									<button
										type="button"
										onClick={() =>
											setPreviewPage("sponsor")
										}
										className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
											previewPage === "sponsor"
												? "bg-primary text-primary-foreground"
												: "hover:bg-accent"
										}`}
									>
										Sponsor Request
									</button>
								)}

								{/* Easy WiFi */}
								{easyWifiEnabled && (
									<button
										type="button"
										onClick={() =>
											setPreviewPage("easy-wifi")
										}
										className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
											previewPage === "easy-wifi"
												? "bg-primary text-primary-foreground"
												: "hover:bg-accent"
										}`}
									>
										Easy WiFi
									</button>
								)}

								{/* Validation */}
								{phoneValidationEnabled && (
									<button
										type="button"
										onClick={() =>
											setPreviewPage("validation")
										}
										className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
											previewPage === "validation"
												? "bg-primary text-primary-foreground"
												: "hover:bg-accent"
										}`}
									>
										Validation
									</button>
								)}

								{/* Success */}
								{successRedirectMode === "text" && (
									<button
										type="button"
										onClick={() =>
											setPreviewPage("success")
										}
										className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
											previewPage === "success"
												? "bg-primary text-primary-foreground"
												: "hover:bg-accent"
										}`}
									>
										Success
									</button>
								)}

								{/* Blocked */}
								<button
									type="button"
									onClick={() => setPreviewPage("blocked")}
									className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										previewPage === "blocked"
											? "bg-primary text-primary-foreground"
											: "hover:bg-accent"
									}`}
								>
									Blocked
								</button>
							</div>
						</div>

						{/* Right Content Editor (70%) */}
						<div className="w-[70%] border rounded-lg bg-card p-6 overflow-y-auto">
							{/* Home Page Content */}
							{previewPage === "home" && (
								<div className="space-y-6">
									<div>
										<h3 className="text-lg font-semibold mb-4">
											Home Page
										</h3>
										<p className="text-sm text-muted-foreground mb-6">
											Configure the main landing page
											content
										</p>
									</div>

									{/* Title */}
									<div className="space-y-2">
										<Label>Title</Label>
										<Input
											value={activeContent.title}
											onChange={(e) =>
												updateContent(
													"title",
													e.target.value,
												)
											}
										/>
									</div>

									{/* Description */}
									<div className="space-y-2">
										<Label>Description</Label>
										<Textarea
											value={activeContent.description}
											onChange={(e) =>
												updateContent(
													"description",
													e.target.value,
												)
											}
											rows={3}
										/>
									</div>

									{/* Sign Up Button - Only show when button mode */}
									{registrationMode === "button" &&
										guestRegistrationEnabled && (
											<div className="space-y-2">
												<Label>
													Register button label
												</Label>
												<Input
													value={
														activeContent.signupButtonText
													}
													onChange={(e) =>
														updateContent(
															"signupButtonText",
															e.target.value,
														)
													}
												/>
												<p className="text-xs text-muted-foreground">
													Label for the registration
													button shown on home page
												</p>
											</div>
										)}

									{/* Login Button - Only show when login option is enabled */}
									{showLoginOption && (
										<div className="space-y-2">
											<Label>Login button label</Label>
											<Input
												value={
													activeContent.loginButtonText
												}
												onChange={(e) =>
													updateContent(
														"loginButtonText",
														e.target.value,
													)
												}
											/>
											<p className="text-xs text-muted-foreground">
												Label for the login button shown
												on home page
											</p>
										</div>
									)}

									{/* Background type */}
									<div className="space-y-2">
										<Label>Background type</Label>
										<Select
											value={backgroundType}
											onValueChange={setBackgroundType}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="image">
													Image
												</SelectItem>
												<SelectItem value="color">
													Color
												</SelectItem>
												<SelectItem value="gradient">
													Gradient
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Background Image - Only show when type is image */}
									{backgroundType === "image" && (
										<div className="space-y-3">
											<Label>Background image</Label>
											<p className="text-xs text-muted-foreground">
												JPG/PNG/SVG, 150px, 5MB
											</p>
											<div className="flex items-center gap-3">
												<div className="h-16 w-16 rounded bg-muted flex items-center justify-center overflow-hidden">
													{backgroundImage ? (
														<img
															src={
																backgroundImage
															}
															alt="Background"
															className="w-full h-full object-cover"
														/>
													) : (
														<span className="text-xs">
															BG
														</span>
													)}
												</div>
												<input
													ref={bgInputRef}
													type="file"
													accept="image/*"
													onChange={
														handleBackgroundUpload
													}
													className="hidden"
												/>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														bgInputRef.current?.click()
													}
													type="button"
												>
													{backgroundImage
														? "Change"
														: "Upload"}
												</Button>
												{backgroundImage && (
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															setBackgroundImage(
																null,
															)
														}
														type="button"
													>
														Remove
													</Button>
												)}
											</div>
										</div>
									)}

									{/* Background Color - Only show when type is color */}
									{backgroundType === "color" && (
										<div className="space-y-3">
											<Label>Background color</Label>
											<div className="flex items-center gap-3">
												<div
													className="h-10 w-10 rounded border"
													style={{
														backgroundColor:
															backgroundColor,
													}}
												/>
												<Input
													type="color"
													value={backgroundColor}
													onChange={(e) =>
														setBackgroundColor(
															e.target.value,
														)
													}
													className="w-20 h-10"
												/>
												<Input
													type="text"
													value={backgroundColor}
													onChange={(e) =>
														setBackgroundColor(
															e.target.value,
														)
													}
													className="flex-1"
													placeholder="#6366f1"
												/>
											</div>
										</div>
									)}

									{/* Gradient Colors - Only show when type is gradient */}
									{backgroundType === "gradient" && (
										<div className="space-y-4">
											<div className="space-y-3">
												<Label>Gradient color 1</Label>
												<div className="flex items-center gap-3">
													<div
														className="h-10 w-10 rounded border"
														style={{
															backgroundColor:
																gradientColor1,
														}}
													/>
													<Input
														type="color"
														value={gradientColor1}
														onChange={(e) =>
															setGradientColor1(
																e.target.value,
															)
														}
														className="w-20 h-10"
													/>
													<Input
														type="text"
														value={gradientColor1}
														onChange={(e) =>
															setGradientColor1(
																e.target.value,
															)
														}
														className="flex-1"
														placeholder="#6366f1"
													/>
												</div>
											</div>

											<div className="space-y-3">
												<Label>Gradient color 2</Label>
												<div className="flex items-center gap-3">
													<div
														className="h-10 w-10 rounded border"
														style={{
															backgroundColor:
																gradientColor2,
														}}
													/>
													<Input
														type="color"
														value={gradientColor2}
														onChange={(e) =>
															setGradientColor2(
																e.target.value,
															)
														}
														className="w-20 h-10"
													/>
													<Input
														type="text"
														value={gradientColor2}
														onChange={(e) =>
															setGradientColor2(
																e.target.value,
															)
														}
														className="flex-1"
														placeholder="#ec4899"
													/>
												</div>
											</div>
										</div>
									)}
								</div>
							)}

							{/* Registration Page Content */}
							{previewPage === "registration" &&
								guestRegistrationEnabled &&
								registrationMode === "button" && (
									<div className="space-y-6">
										<div>
											<h3 className="text-lg font-semibold mb-4">
												Registration Page
											</h3>
											<p className="text-sm text-muted-foreground mb-6">
												Configure the registration form
												page
											</p>
										</div>

										{/* Title */}
										<div className="space-y-2">
											<Label>Title</Label>
											<Input
												value={
													activeContent.registrationTitle
												}
												onChange={(e) =>
													updateContent(
														"registrationTitle",
														e.target.value,
													)
												}
											/>
										</div>

										{/* Description */}
										<div className="space-y-2">
											<Label>Description</Label>
											<Textarea
												value={
													activeContent.registrationDescription
												}
												onChange={(e) =>
													updateContent(
														"registrationDescription",
														e.target.value,
													)
												}
												rows={3}
											/>
										</div>

										{/* Submit Button */}
										<div className="space-y-2">
											<Label>Submit button label</Label>
											<Input
												value={
													activeContent.registrationSubmitButtonText
												}
												onChange={(e) =>
													updateContent(
														"registrationSubmitButtonText",
														e.target.value,
													)
												}
											/>
											<p className="text-xs text-muted-foreground">
												Label for the submit button on
												the registration form
											</p>
										</div>
									</div>
								)}

							{/* Sponsor Request Content */}
							{previewPage === "sponsor" &&
								sponsorshipEnabled && (
									<div className="space-y-6">
										<div>
											<h3 className="text-lg font-semibold mb-4">
												Sponsor Request
											</h3>
											<p className="text-sm text-muted-foreground mb-6">
												Configure the sponsorship
												request page
											</p>
										</div>

										<div className="space-y-2">
											<Label>
												Sponsorship required message
											</Label>
											<Textarea
												value={
													activeContent.sponsorMessage
												}
												onChange={(e) =>
													updateContent(
														"sponsorMessage",
														e.target.value,
													)
												}
												rows={3}
											/>
										</div>
									</div>
								)}

							{/* Easy WiFi Content */}
							{previewPage === "easy-wifi" && easyWifiEnabled && (
								<div className="space-y-6">
									<div>
										<h3 className="text-lg font-semibold mb-4">
											Easy WiFi
										</h3>
										<p className="text-sm text-muted-foreground mb-6">
											Configure the Easy WiFi page
										</p>
									</div>

									<div className="space-y-2">
										<Label>Call to action message</Label>
										<Textarea
											value={
												activeContent.easyWifiCtaMessage
											}
											onChange={(e) =>
												updateContent(
													"easyWifiCtaMessage",
													e.target.value,
												)
											}
											rows={3}
										/>
									</div>
									<div className="space-y-2">
										<Label>Skip message</Label>
										<Input
											value={
												activeContent.easyWifiSkipMessage
											}
											onChange={(e) =>
												updateContent(
													"easyWifiSkipMessage",
													e.target.value,
												)
											}
										/>
									</div>
								</div>
							)}

							{/* Validation Content */}
							{previewPage === "validation" &&
								phoneValidationEnabled && (
									<div className="space-y-6">
										<div>
											<h3 className="text-lg font-semibold mb-4">
												Validation
											</h3>
											<p className="text-sm text-muted-foreground mb-6">
												Configure the phone validation
												page
											</p>
										</div>

										<div className="space-y-2">
											<Label>
												Phone validation notice
											</Label>
											<Textarea
												value={
													activeContent.phoneValidationMessage
												}
												onChange={(e) =>
													updateContent(
														"phoneValidationMessage",
														e.target.value,
													)
												}
												rows={3}
											/>
										</div>
									</div>
								)}

							{/* Success Content */}
							{previewPage === "success" &&
								successRedirectMode === "text" && (
									<div className="space-y-6">
										<div>
											<h3 className="text-lg font-semibold mb-4">
												Success
											</h3>
											<p className="text-sm text-muted-foreground mb-6">
												Configure the success page
											</p>
										</div>

										<div className="space-y-2">
											<Label>Success message</Label>
											<Textarea
												value={
													activeContent.successMessage
												}
												onChange={(e) =>
													updateContent(
														"successMessage",
														e.target.value,
													)
												}
												rows={3}
											/>
										</div>
									</div>
								)}

							{/* Blocked Content */}
							{previewPage === "blocked" && (
								<div className="space-y-6">
									<div>
										<h3 className="text-lg font-semibold mb-4">
											Blocked
										</h3>
										<p className="text-sm text-muted-foreground mb-6">
											Configure the blocked/time limit
											exceeded page
										</p>
									</div>

									<div className="space-y-2">
										<Label>Blocked message</Label>
										<Textarea
											value={activeContent.blockedMessage}
											onChange={(e) =>
												updateContent(
													"blockedMessage",
													e.target.value,
												)
											}
											rows={3}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</TabsContent>

				{/* Style Tab */}
				<TabsContent value="style" className="space-y-4 mt-6">
					{/* Logo Settings */}
					<Collapsible
						defaultOpen
						className="rounded-lg border bg-card"
					>
						<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
							<span className="font-semibold">Logo</span>
							<ChevronDown className="h-4 w-4" />
						</CollapsibleTrigger>
						<CollapsibleContent className="border-t p-4 space-y-4">
							<div className="space-y-3">
								<Label>Logo Upload</Label>
								<p className="text-xs text-muted-foreground">
									JPG/PNG/SVG, 150px by 30px, 5MB
								</p>
								<div className="flex items-center gap-3">
									<div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
										{logo ? (
											<img
												src={logo}
												alt="Logo"
												className="w-full h-full object-contain"
											/>
										) : (
											<span className="text-xs">
												Logo
											</span>
										)}
									</div>
									<input
										ref={logoInputRef}
										type="file"
										accept="image/*"
										onChange={handleLogoUpload}
										className="hidden"
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											logoInputRef.current?.click()
										}
										type="button"
									>
										{logo ? "Change" : "Upload"}
									</Button>
									{logo && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setLogo(null)}
											type="button"
										>
											Remove
										</Button>
									)}
								</div>
							</div>
							<div className="space-y-3">
								<Label>Logo size: {logoSize}px</Label>
								<Slider
									value={[logoSize]}
									onValueChange={(value) =>
										setLogoSize(value[0])
									}
									max={150}
									step={1}
								/>
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* Global Font Settings */}
					<Collapsible className="rounded-lg border bg-card">
						<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
							<span className="font-semibold">
								Global Font Settings
							</span>
							<ChevronDown className="h-4 w-4" />
						</CollapsibleTrigger>
						<CollapsibleContent className="border-t p-4 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Font Family</Label>
									<Select
										value={fontFamily}
										onValueChange={setFontFamily}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Inter">
												Inter
											</SelectItem>
											<SelectItem value="Roboto">
												Roboto
											</SelectItem>
											<SelectItem value="Open Sans">
												Open Sans
											</SelectItem>
											<SelectItem value="Lato">
												Lato
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label>Font Size</Label>
									<Select
										value={baseFontSize}
										onValueChange={setBaseFontSize}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="14">
												14px
											</SelectItem>
											<SelectItem value="16">
												16px
											</SelectItem>
											<SelectItem value="18">
												18px
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="space-y-2">
								<Label>Base Color</Label>
								<div className="flex items-center gap-2">
									<div
										className="h-10 w-10 rounded border"
										style={{
											backgroundColor: baseColor,
										}}
									/>
									<Input
										value={baseColor}
										onChange={(e) =>
											setBaseColor(e.target.value)
										}
										className="font-mono"
									/>
									<Input
										type="color"
										value={baseColor}
										onChange={(e) =>
											setBaseColor(e.target.value)
										}
										className="w-12 p-1 h-10"
									/>
								</div>
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* Primary Accent Color */}
					<Collapsible
						defaultOpen
						className="rounded-lg border bg-card"
					>
						<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
							<span className="font-semibold">
								Primary Accent Color
							</span>
							<ChevronDown className="h-4 w-4" />
						</CollapsibleTrigger>
						<CollapsibleContent className="border-t p-4 space-y-4">
							<div className="space-y-2">
								<Label>Button Color</Label>
								<div className="flex items-center gap-2">
									<div
										className="h-10 w-10 rounded border"
										style={{
											backgroundColor: primaryColor,
										}}
									/>
									<Input
										value={primaryColor}
										onChange={(e) =>
											setPrimaryColor(e.target.value)
										}
										className="font-mono"
									/>
									<Input
										type="color"
										value={primaryColor}
										onChange={(e) =>
											setPrimaryColor(e.target.value)
										}
										className="w-12 p-1 h-10"
									/>
								</div>
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* Overall Spacing & Padding */}
					<Collapsible
						defaultOpen
						className="rounded-lg border bg-card"
					>
						<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
							<span className="font-semibold">
								Overall Spacing & Padding
							</span>
							<ChevronDown className="h-4 w-4" />
						</CollapsibleTrigger>
						<CollapsibleContent className="border-t p-4 space-y-4">
							<div className="flex rounded-lg border p-1 bg-muted/20">
								<button
									type="button"
									onClick={() => setSpacing("compact")}
									className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
										spacing === "compact"
											? "bg-background shadow-sm text-foreground"
											: "text-muted-foreground hover:bg-background/50"
									}`}
								>
									Compact
								</button>
								<button
									type="button"
									onClick={() => setSpacing("balanced")}
									className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
										spacing === "balanced"
											? "bg-background shadow-sm text-foreground"
											: "text-muted-foreground hover:bg-background/50"
									}`}
								>
									Balanced
								</button>
								<button
									type="button"
									onClick={() => setSpacing("spacious")}
									className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
										spacing === "spacious"
											? "bg-background shadow-sm text-foreground"
											: "text-muted-foreground hover:bg-background/50"
									}`}
								>
									Spacious
								</button>
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* Advanced Customization */}
					<Collapsible className="rounded-lg border bg-card">
						<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
							<span className="font-semibold">
								Advanced Customization
							</span>
							<ChevronDown className="h-4 w-4" />
						</CollapsibleTrigger>
						<CollapsibleContent className="border-t p-4 space-y-4">
							<div className="space-y-2">
								<Label>Custom CSS</Label>
								<div className="rounded-md border border-dashed p-8 text-center">
									<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="h-6 w-6 text-muted-foreground"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
											/>
										</svg>
									</div>
									<h3 className="mt-2 text-sm font-semibold">
										Upload Custom CSS
									</h3>
									<p className="mt-1 text-xs text-muted-foreground">
										Upload a .css file to override styles
									</p>
									<Button
										variant="outline"
										size="sm"
										className="mt-4"
									>
										Select File
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label>AI Style Generator</Label>
								<div className="flex gap-2">
									<Input placeholder="Describe the style you want..." />
									<Button variant="secondary">
										Generate
									</Button>
								</div>
								<p className="text-xs text-muted-foreground">
									Example: "Modern dark theme with neon blue
									accents"
								</p>
							</div>
						</CollapsibleContent>
					</Collapsible>
				</TabsContent>
			</Tabs>
		</div>
	);
}
