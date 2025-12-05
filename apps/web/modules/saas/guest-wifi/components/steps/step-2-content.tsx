"use client";

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

interface StepContentProps {
	registrationFields: FormField[];
	easyWifiEnabled?: boolean;
	sponsorshipEnabled?: boolean;
	phoneValidationEnabled?: boolean;
	successRedirectMode?: string;
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
}

export function StepContent({
	registrationFields,
	easyWifiEnabled,
	sponsorshipEnabled,
	phoneValidationEnabled,
	successRedirectMode,
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
}: StepContentProps) {
	const [selectedTab, setSelectedTab] = useState("content");
	const [selectedPage, setSelectedPage] = useState("home");
	const [previewMode, setPreviewMode] = useState("desktop");

	// Content state
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

	// Text & Labels state
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

	const getBackgroundStyle = () => {
		switch (backgroundType) {
			case "image":
				return {
					backgroundImage: backgroundImage
						? `url(${backgroundImage})`
						: "none",
					backgroundColor: backgroundImage
						? "transparent"
						: "hsl(var(--muted)/0.3)",
				};
			case "color":
				return {
					backgroundColor: backgroundColor,
					backgroundImage: "none",
				};
			case "gradient":
				return {
					backgroundImage: `linear-gradient(135deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`,
					backgroundColor: "transparent",
				};
			default:
				return {
					backgroundColor: "hsl(var(--muted)/0.3)",
					backgroundImage: "none",
				};
		}
	};

	const handlePageChange = (page: string) => {
		setSelectedPage(page);
	};

	return (
		<div className="flex h-full">
			{/* Left Panel - Configuration */}
			<div className="w-1/2 overflow-y-auto border-r p-6">
				<Tabs
					value={selectedTab}
					onValueChange={setSelectedTab}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="content">Content</TabsTrigger>
						<TabsTrigger value="style">Style</TabsTrigger>
					</TabsList>

					{/* Content Tab */}
					<TabsContent value="content" className="space-y-4 mt-6">
						{/* Home Page Section */}
						<Collapsible
							open={selectedPage === "home"}
							onOpenChange={(open) =>
								open && handlePageChange("home")
							}
							className="rounded-lg border bg-card"
						>
							<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
								<span className="font-semibold">Home Page</span>
								<ChevronDown
									className={`h-4 w-4 transition-transform ${
										selectedPage === "home"
											? "rotate-180"
											: ""
									}`}
								/>
							</CollapsibleTrigger>
							<CollapsibleContent className="border-t p-4 space-y-6">
								{/* Logo */}
								<div className="space-y-3">
									<Label>Logo</Label>
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
											Change
										</Button>
									</div>
								</div>

								{/* Logo size */}
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

								{/* Title */}
								<div className="space-y-2">
									<Label>Title</Label>
									<Input
										value={title}
										onChange={(e) =>
											setTitle(e.target.value)
										}
									/>
								</div>

								{/* Description */}
								<div className="space-y-2">
									<Label>Description</Label>
									<Textarea
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
										rows={3}
									/>
								</div>

								{/* Sign Up Button */}
								<div className="space-y-2">
									<Label>Sign Up button</Label>
									<Input
										value={signupButtonText}
										onChange={(e) =>
											setSignupButtonText(e.target.value)
										}
									/>
								</div>

								{/* Login Button */}
								<div className="space-y-2">
									<Label>Login button</Label>
									<Input
										value={loginButtonText}
										onChange={(e) =>
											setLoginButtonText(e.target.value)
										}
									/>
								</div>

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
														src={backgroundImage}
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
												Change
											</Button>
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
							</CollapsibleContent>
						</Collapsible>

						{/* Sponsor Request Section */}
						{sponsorshipEnabled && (
							<Collapsible
								open={selectedPage === "sponsor"}
								onOpenChange={(open) =>
									open && handlePageChange("sponsor")
								}
								className="rounded-lg border bg-card"
							>
								<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
									<span className="font-semibold">
										Sponsor Request
									</span>
									<ChevronDown
										className={`h-4 w-4 transition-transform ${
											selectedPage === "sponsor"
												? "rotate-180"
												: ""
										}`}
									/>
								</CollapsibleTrigger>
								<CollapsibleContent className="border-t p-4 space-y-6">
									<div className="space-y-2">
										<Label>
											Sponsorship required message
										</Label>
										<Textarea
											value={sponsorMessage}
											onChange={(e) =>
												setSponsorMessage(
													e.target.value,
												)
											}
											rows={3}
										/>
									</div>
								</CollapsibleContent>
							</Collapsible>
						)}

						{/* Easy WiFi Section */}
						{easyWifiEnabled && (
							<Collapsible
								open={selectedPage === "easy-wifi"}
								onOpenChange={(open) =>
									open && handlePageChange("easy-wifi")
								}
								className="rounded-lg border bg-card"
							>
								<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
									<span className="font-semibold">
										Easy WiFi
									</span>
									<ChevronDown
										className={`h-4 w-4 transition-transform ${
											selectedPage === "easy-wifi"
												? "rotate-180"
												: ""
										}`}
									/>
								</CollapsibleTrigger>
								<CollapsibleContent className="border-t p-4 space-y-6">
									<div className="space-y-2">
										<Label>Call to action message</Label>
										<Textarea
											value={easyWifiCtaMessage}
											onChange={(e) =>
												setEasyWifiCtaMessage(
													e.target.value,
												)
											}
											rows={3}
										/>
									</div>
									<div className="space-y-2">
										<Label>Skip message</Label>
										<Input
											value={easyWifiSkipMessage}
											onChange={(e) =>
												setEasyWifiSkipMessage(
													e.target.value,
												)
											}
										/>
									</div>
								</CollapsibleContent>
							</Collapsible>
						)}

						{/* Validation Section */}
						{phoneValidationEnabled && (
							<Collapsible
								open={selectedPage === "validation"}
								onOpenChange={(open) =>
									open && handlePageChange("validation")
								}
								className="rounded-lg border bg-card"
							>
								<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
									<span className="font-semibold">
										Validation
									</span>
									<ChevronDown
										className={`h-4 w-4 transition-transform ${
											selectedPage === "validation"
												? "rotate-180"
												: ""
										}`}
									/>
								</CollapsibleTrigger>
								<CollapsibleContent className="border-t p-4 space-y-6">
									<div className="space-y-2">
										<Label>Phone validation notice</Label>
										<Textarea
											value={phoneValidationMessage}
											onChange={(e) =>
												setPhoneValidationMessage(
													e.target.value,
												)
											}
											rows={3}
										/>
									</div>
								</CollapsibleContent>
							</Collapsible>
						)}

						{/* Success Section */}
						{successRedirectMode === "text" && (
							<Collapsible
								open={selectedPage === "success"}
								onOpenChange={(open) =>
									open && handlePageChange("success")
								}
								className="rounded-lg border bg-card"
							>
								<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
									<span className="font-semibold">
										Success
									</span>
									<ChevronDown
										className={`h-4 w-4 transition-transform ${
											selectedPage === "success"
												? "rotate-180"
												: ""
										}`}
									/>
								</CollapsibleTrigger>
								<CollapsibleContent className="border-t p-4 space-y-6">
									<div className="space-y-2">
										<Label>Success message</Label>
										<Textarea
											value={successMessage}
											onChange={(e) =>
												setSuccessMessage(
													e.target.value,
												)
											}
											rows={3}
										/>
									</div>
								</CollapsibleContent>
							</Collapsible>
						)}

						{/* Blocked Access Section */}
						<Collapsible
							open={selectedPage === "blocked"}
							onOpenChange={(open) =>
								open && handlePageChange("blocked")
							}
							className="rounded-lg border bg-card"
						>
							<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
								<span className="font-semibold">
									Blocked Access
								</span>
								<ChevronDown
									className={`h-4 w-4 transition-transform ${
										selectedPage === "blocked"
											? "rotate-180"
											: ""
									}`}
								/>
							</CollapsibleTrigger>
							<CollapsibleContent className="border-t p-4 space-y-6">
								<div className="space-y-2">
									<Label>Blocked access notice</Label>
									<Textarea
										value={blockedMessage}
										onChange={(e) =>
											setBlockedMessage(e.target.value)
										}
										rows={3}
									/>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</TabsContent>

					{/* Style Tab */}
					<TabsContent value="style" className="space-y-4 mt-6">
						{/* Global Font Settings */}
						<Collapsible
							defaultOpen
							className="rounded-lg border bg-card"
						>
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
							<CollapsibleContent className="border-t p-4">
								<Tabs
									value={spacing}
									onValueChange={setSpacing}
									className="w-full"
								>
									<TabsList className="w-full grid grid-cols-3">
										<TabsTrigger value="compact">
											Compact
										</TabsTrigger>
										<TabsTrigger value="balanced">
											Balanced
										</TabsTrigger>
										<TabsTrigger value="spacious">
											Spacious
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</CollapsibleContent>
						</Collapsible>

						{/* Advanced Customization */}
						<Collapsible
							defaultOpen
							className="rounded-lg border bg-card"
						>
							<CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent/50 rounded-lg">
								<span className="font-semibold">
									Advanced Customization
								</span>
								<ChevronDown className="h-4 w-4" />
							</CollapsibleTrigger>
							<CollapsibleContent className="border-t p-4 space-y-3">
								<Button
									variant="outline"
									className="w-full"
									onClick={() => {}}
								>
									Upload Custom CSS
								</Button>
								<Button
									className="w-full bg-black hover:bg-gray-800 text-white"
									onClick={() => {}}
								>
									Generate CSS with AI
								</Button>
							</CollapsibleContent>
						</Collapsible>
					</TabsContent>
				</Tabs>
			</div>

			{/* Right Panel - Preview */}
			<div
				className="w-1/2 p-6 flex items-center justify-center bg-cover bg-center"
				style={getBackgroundStyle()}
			>
				<div className="space-y-4 w-full h-full flex flex-col">
					{/* Preview Controls */}
					<div className="flex items-center justify-between">
						<Select
							value={selectedPage}
							onValueChange={handlePageChange}
						>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="home">Home Page</SelectItem>
								{sponsorshipEnabled && (
									<SelectItem value="sponsor">
										Sponsor Request
									</SelectItem>
								)}
								{easyWifiEnabled && (
									<SelectItem value="easy-wifi">
										Easy WiFi
									</SelectItem>
								)}
								{phoneValidationEnabled && (
									<SelectItem value="validation">
										Validation
									</SelectItem>
								)}
								{successRedirectMode === "text" && (
									<SelectItem value="success">
										Success Page
									</SelectItem>
								)}
								<SelectItem value="blocked">
									Blocked Access
								</SelectItem>
							</SelectContent>
						</Select>

						<Tabs
							value={previewMode}
							onValueChange={(value) =>
								setPreviewMode(
									value as "mobile" | "tablet" | "desktop",
								)
							}
						>
							<TabsList>
								<TabsTrigger value="mobile">Mobile</TabsTrigger>
								<TabsTrigger value="tablet">Tablet</TabsTrigger>
								<TabsTrigger value="desktop">
									Desktop
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					{/* Preview Frame */}
					<div className="flex items-center justify-center flex-1">
						<div
							className={`bg-background rounded-lg border shadow-lg transition-all overflow-hidden ${
								previewMode === "mobile"
									? "w-[375px]"
									: previewMode === "tablet"
										? "w-[768px]"
										: "w-full max-w-4xl"
							}`}
							style={{
								fontFamily: fontFamily,
								color: baseColor,
							}}
						>
							<div
								className={`p-6 flex flex-col ${
									spacing === "compact"
										? "gap-2"
										: spacing === "spacious"
											? "gap-8"
											: "gap-4"
								}`}
							>
								{/* Logo */}
								<div
									className={`flex justify-center ${
										spacing === "compact"
											? "mb-2"
											: spacing === "spacious"
												? "mb-8"
												: "mb-6"
									}`}
								>
									{logo ? (
										<img
											src={logo}
											alt="Logo"
											style={{ height: `${logoSize}px` }}
											className="object-contain"
										/>
									) : (
										<div
											className="bg-muted rounded flex items-center justify-center text-xs text-muted-foreground"
											style={{
												height: `${logoSize}px`,
												width: `${logoSize * 2.5}px`,
											}}
										>
											CLOUD4WI
										</div>
									)}
								</div>

								{/* Home Page Preview */}
								{selectedPage === "home" && (
									<>
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
													fontSize: `${
														Number.parseInt(
															baseFontSize,
														) * 1.25
													}px`,
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

										<div
											className={`flex flex-col ${
												spacing === "compact"
													? "gap-2"
													: spacing === "spacious"
														? "gap-5"
														: "gap-3"
											}`}
										>
											<Button
												variant="outline"
												className="w-full gap-2"
												style={{
													fontSize: `${baseFontSize}px`,
												}}
											>
												Continue with OneClick
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

											<div
												className={`flex flex-col ${
													spacing === "compact"
														? "gap-2"
														: spacing === "spacious"
															? "gap-5"
															: "gap-3"
												}`}
											>
												{registrationFields.map(
													(field) => (
														<Input
															key={field.id}
															type={field.type}
															placeholder={
																field.placeholder ||
																field.label
															}
															style={{
																fontSize: `${baseFontSize}px`,
															}}
														/>
													),
												)}
												<Button
													className="w-full"
													style={{
														backgroundColor:
															primaryColor,
														fontSize: `${baseFontSize}px`,
													}}
												>
													{signupButtonText}
												</Button>
												<Button
													variant="outline"
													className="w-full"
													style={{
														fontSize: `${baseFontSize}px`,
													}}
												>
													{loginButtonText}
												</Button>
											</div>
										</div>
									</>
								)}

								{/* Sponsor Request Preview */}
								{selectedPage === "sponsor" &&
									sponsorshipEnabled && (
										<div
											className={`text-center ${
												spacing === "compact"
													? "space-y-2"
													: spacing === "spacious"
														? "space-y-6"
														: "space-y-4"
											}`}
										>
											<h2
												className="font-bold"
												style={{
													fontSize: `${
														Number.parseInt(
															baseFontSize,
														) * 1.25
													}px`,
												}}
											>
												Sponsor Approval Required
											</h2>
											<p
												className="text-muted-foreground"
												style={{
													fontSize: `${baseFontSize}px`,
												}}
											>
												{sponsorMessage}
											</p>
											<div className="flex items-center justify-center py-8">
												<div
													className="animate-spin rounded-full h-12 w-12 border-b-2"
													style={{
														borderColor:
															primaryColor,
													}}
												/>
											</div>
										</div>
									)}

								{/* Easy WiFi Preview */}
								{selectedPage === "easy-wifi" &&
									easyWifiEnabled && (
										<div
											className={`text-center ${
												spacing === "compact"
													? "space-y-2"
													: spacing === "spacious"
														? "space-y-6"
														: "space-y-4"
											}`}
										>
											<h2
												className="font-bold"
												style={{
													fontSize: `${
														Number.parseInt(
															baseFontSize,
														) * 1.25
													}px`,
												}}
											>
												Easy WiFi Setup
											</h2>
											<p
												className="text-muted-foreground"
												style={{
													fontSize: `${baseFontSize}px`,
												}}
											>
												{easyWifiCtaMessage}
											</p>
											<div
												className={`flex flex-col ${
													spacing === "compact"
														? "gap-2"
														: spacing === "spacious"
															? "gap-5"
															: "gap-3"
												}`}
											>
												<Button
													className="w-full"
													style={{
														backgroundColor:
															primaryColor,
														fontSize: `${baseFontSize}px`,
													}}
												>
													Download Profile
												</Button>
												<Button
													variant="ghost"
													className="w-full text-muted-foreground"
													style={{
														fontSize: `${baseFontSize}px`,
													}}
												>
													{easyWifiSkipMessage}
												</Button>
											</div>
										</div>
									)}

								{/* Validation Preview */}
								{selectedPage === "validation" &&
									phoneValidationEnabled && (
										<div
											className={`text-center ${
												spacing === "compact"
													? "space-y-2"
													: spacing === "spacious"
														? "space-y-6"
														: "space-y-4"
											}`}
										>
											<h2
												className="font-bold"
												style={{
													fontSize: `${
														Number.parseInt(
															baseFontSize,
														) * 1.25
													}px`,
												}}
											>
												Phone Validation Required
											</h2>
											<p
												className="text-muted-foreground"
												style={{
													fontSize: `${baseFontSize}px`,
												}}
											>
												{phoneValidationMessage}
											</p>
											<div
												className={`flex flex-col ${
													spacing === "compact"
														? "gap-2"
														: spacing === "spacious"
															? "gap-5"
															: "gap-3"
												}`}
											>
												<Input
													placeholder="Enter verification code"
													style={{
														fontSize: `${baseFontSize}px`,
													}}
												/>
												<Button
													className="w-full"
													style={{
														backgroundColor:
															primaryColor,
														fontSize: `${baseFontSize}px`,
													}}
												>
													Verify
												</Button>
											</div>
										</div>
									)}

								{/* Success Preview */}
								{selectedPage === "success" &&
									successRedirectMode === "text" && (
										<div
											className={`text-center ${
												spacing === "compact"
													? "space-y-2"
													: spacing === "spacious"
														? "space-y-6"
														: "space-y-4"
											}`}
										>
											<div className="flex justify-center">
												<div className="rounded-full bg-green-100 p-3">
													<svg
														className="h-8 w-8 text-green-600"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<title>
															Success Icon
														</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M5 13l4 4L19 7"
														/>
													</svg>
												</div>
											</div>
											<h2
												className="font-bold"
												style={{
													fontSize: `${
														Number.parseInt(
															baseFontSize,
														) * 1.25
													}px`,
												}}
											>
												Success!
											</h2>
											<p
												className="text-muted-foreground"
												style={{
													fontSize: `${baseFontSize}px`,
												}}
											>
												{successMessage}
											</p>
										</div>
									)}

								{/* Blocked Access Preview */}
								{selectedPage === "blocked" && (
									<div
										className={`text-center ${
											spacing === "compact"
												? "space-y-2"
												: spacing === "spacious"
													? "space-y-6"
													: "space-y-4"
										}`}
									>
										<div className="flex justify-center">
											<div className="rounded-full bg-red-100 p-3">
												<svg
													className="h-8 w-8 text-red-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<title>Blocked Icon</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</div>
										</div>
										<h2
											className="font-bold"
											style={{
												fontSize: `${
													Number.parseInt(
														baseFontSize,
													) * 1.25
												}px`,
											}}
										>
											Access Blocked
										</h2>
										<p
											className="text-muted-foreground"
											style={{
												fontSize: `${baseFontSize}px`,
											}}
										>
											{blockedMessage}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
