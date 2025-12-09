"use client";

import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { cn } from "@ui/lib";
import { useState } from "react";

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

// Mock available terms - matching ConfigureTermsDialog
// Mock available terms removed - using props instead

interface WizardPreviewProps {
	registrationFields: FormField[];
	easyWifiEnabled: boolean;
	sponsorshipEnabled: boolean;
	sponsorSelectionMode: "dropdown" | "type";
	phoneValidationEnabled: boolean;
	successRedirectMode: string;
	// Style props
	fontFamily: string;
	baseFontSize: string;
	baseColor: string;
	primaryColor: string;
	spacing: string;
	// Content props
	logo: string | null;
	logoSize: number;
	title: string;
	description: string;
	backgroundType: string;
	backgroundImage: string | null;
	backgroundColor: string;
	gradientColor1: string;
	gradientColor2: string;
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
	// Auth props
	guestRegistrationEnabled?: boolean;
	registrationMode?: "form" | "button";
	showLoginOption?: boolean;
	appleIdEnabled?: boolean;
	accessCodesEnabled?: boolean;
	enterpriseIdpEnabled?: boolean;
	selectedIdps?: string[];
	terms?: SelectedTerm[];
	previewPage: string;
	setPreviewPage: (page: string) => void;
	availableTerms: { id: string; title: string; label: string }[];
}

export function WizardPreview({
	registrationFields,
	easyWifiEnabled,
	sponsorshipEnabled,
	sponsorSelectionMode,
	phoneValidationEnabled,
	successRedirectMode,
	fontFamily,
	baseFontSize,
	baseColor,
	primaryColor,
	spacing,
	logo,
	logoSize,
	title,
	description,
	backgroundType,
	backgroundImage,
	backgroundColor,
	gradientColor1,
	gradientColor2,
	signupButtonText,
	loginButtonText,
	registrationTitle,
	registrationDescription,
	registrationSubmitButtonText,
	sponsorMessage,
	phoneValidationMessage,
	successMessage,
	blockedMessage,
	easyWifiCtaMessage,
	easyWifiSkipMessage,
	guestRegistrationEnabled = true,
	registrationMode = "form",
	showLoginOption = true,
	appleIdEnabled = false,
	accessCodesEnabled = false,
	enterpriseIdpEnabled = false,
	selectedIdps = [],
	terms = [],
	previewPage,
	setPreviewPage,
	availableTerms = [],
}: WizardPreviewProps) {
	const [previewMode, setPreviewMode] = useState<
		"mobile" | "tablet" | "desktop"
	>("mobile");

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

	return (
		<div className="flex flex-col h-full bg-muted/30">
			{/* Preview Toolbar */}
			<div className="flex items-center justify-between border-b bg-background px-4 py-2">
				{/* Left side: Preview text + Page selector */}
				<div className="flex items-center gap-3">
					<span className="text-sm font-medium">Preview</span>
					<select
						className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
						value={previewPage}
						onChange={(e) => setPreviewPage(e.target.value)}
					>
						<option value="home">Home Page</option>
						{guestRegistrationEnabled &&
							registrationMode === "button" && (
								<option value="registration">
									Registration
								</option>
							)}
						{sponsorshipEnabled && (
							<option value="sponsor">Sponsor Request</option>
						)}
						{easyWifiEnabled && (
							<option value="easy-wifi">Easy WiFi</option>
						)}
						{phoneValidationEnabled && (
							<option value="validation">Validation</option>
						)}
						{successRedirectMode === "text" && (
							<option value="success">Success Page</option>
						)}
						<option value="blocked">Blocked Access</option>
					</select>
				</div>

				{/* Right side: Device mode switches */}
				<div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
					<Button
						variant={
							previewMode === "mobile" ? "secondary" : "ghost"
						}
						size="icon-sm"
						onClick={() => setPreviewMode("mobile")}
						title="Mobile view"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Mobile Icon</title>
							<rect
								width="14"
								height="20"
								x="5"
								y="2"
								rx="2"
								ry="2"
							/>
							<path d="M12 18h.01" />
						</svg>
					</Button>
					<Button
						variant={
							previewMode === "tablet" ? "secondary" : "ghost"
						}
						size="icon-sm"
						onClick={() => setPreviewMode("tablet")}
						title="Tablet view"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Tablet Icon</title>
							<rect
								width="16"
								height="20"
								x="4"
								y="2"
								rx="2"
								ry="2"
							/>
							<path d="M12 18h.01" />
						</svg>
					</Button>
					<Button
						variant={
							previewMode === "desktop" ? "secondary" : "ghost"
						}
						size="icon-sm"
						onClick={() => setPreviewMode("desktop")}
						title="Desktop view"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Desktop Icon</title>
							<rect
								width="20"
								height="14"
								x="2"
								y="3"
								rx="2"
								ry="2"
							/>
							<line x1="8" x2="16" y1="21" y2="21" />
							<line x1="12" x2="12" y1="17" y2="21" />
						</svg>
					</Button>
				</div>
			</div>

			{/* Preview Frame */}
			<div className="flex items-center justify-center flex-1 p-8 overflow-y-auto">
				{/* Force light mode for the preview */}
				<div className="light">
					<div
						className={cn(
							"relative flex flex-col items-center overflow-hidden transition-all bg-background rounded-lg border shadow-lg",
							previewMode === "mobile"
								? "w-[393px] h-[852px]"
								: previewMode === "tablet"
									? "w-[768px] min-h-[1024px]"
									: "w-full max-w-4xl min-h-[600px]",
						)}
						style={{
							fontFamily:
								fontFamily === "Inter"
									? "var(--font-inter)"
									: fontFamily === "Roboto"
										? "var(--font-roboto)"
										: fontFamily === "Open Sans"
											? "var(--font-open-sans)"
											: fontFamily === "Lato"
												? "var(--font-lato)"
												: "inherit",
							color: baseColor,
							...getBackgroundStyle(),
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
					>
						<div
							className={cn(
								"relative flex w-full flex-col bg-white p-6 shadow-none transition-all",
								previewMode === "mobile"
									? "mt-24 min-h-[calc(100%-6rem)] rounded-t-[2.5rem]"
									: "m-auto w-full max-w-[440px] rounded-2xl shadow-2xl p-10",
							)}
						>
							{/* Logo */}
							{logo && (
								<div
									className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-sm overflow-hidden"
									style={{
										width: `${logoSize + 32}px`,
										height: `${logoSize + 32}px`,
										top: `-${(logoSize + 32) / 2}px`,
									}}
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={logo}
										alt="Logo"
										className="object-contain"
										style={{
											width: `${logoSize}px`,
											height: `${logoSize}px`,
										}}
									/>
								</div>
							)}

							<div
								className={cn(
									"flex flex-col flex-1",
									spacing === "compact"
										? "gap-2"
										: spacing === "spacious"
											? "gap-8"
											: "gap-4",
								)}
								style={{
									marginTop: logo
										? `${(logoSize + 32) / 2 + 24}px`
										: "2rem",
								}}
							>
								{/* Home Page Preview */}
								{previewPage === "home" && (
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
													fontSize: `${Number.parseInt(baseFontSize) * 1.25}px`,
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
											{appleIdEnabled && (
												<>
													<Button
														variant="outline"
														className="w-full gap-2"
														style={{
															fontSize: `${baseFontSize}px`,
														}}
													>
														<svg
															viewBox="0 0 24 24"
															fill="currentColor"
															className="h-4 w-4"
														>
															<title>
																Apple Logo
															</title>
															<path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
														</svg>
														Sign in with Apple
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
												</>
											)}

											{enterpriseIdpEnabled &&
												selectedIdps.length > 0 && (
													<>
														{selectedIdps.map(
															(idp) => (
																<Button
																	key={idp}
																	variant="outline"
																	className="w-full gap-2"
																	style={{
																		fontSize: `${baseFontSize}px`,
																	}}
																>
																	{/* Placeholder icons based on IDP */}
																	{idp ===
																		"google" && (
																		<svg
																			viewBox="0 0 24 24"
																			className="h-4 w-4"
																		>
																			<title>
																				Google
																				Logo
																			</title>
																			<path
																				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
																				fill="#4285F4"
																			/>
																			<path
																				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
																				fill="#34A853"
																			/>
																			<path
																				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z"
																				fill="#FBBC05"
																			/>
																			<path
																				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
																				fill="#EA4335"
																			/>
																		</svg>
																	)}
																	{idp ===
																		"azure" && (
																		<svg
																			viewBox="0 0 24 24"
																			className="h-4 w-4"
																			fill="currentColor"
																		>
																			<title>
																				Microsoft
																				Logo
																			</title>
																			<path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
																		</svg>
																	)}
																	{idp ===
																		"okta" && (
																		<svg
																			viewBox="0 0 24 24"
																			className="h-4 w-4"
																			fill="currentColor"
																		>
																			<title>
																				Okta
																				Logo
																			</title>
																			<path d="M12 0C5.389 0 0 5.389 0 12s5.389 12 12 12 12-5.389 12-12S18.611 0 12 0zm0 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z" />
																		</svg>
																	)}
																	Login with{" "}
																	{idp ===
																	"azure"
																		? "Entra ID"
																		: idp ===
																				"google"
																			? "Google"
																			: "Okta"}
																</Button>
															),
														)}

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
													</>
												)}

											{registrationMode === "form" && (
												<div
													className={`flex flex-col ${
														spacing === "compact"
															? "gap-2"
															: spacing ===
																	"spacious"
																? "gap-5"
																: "gap-3"
													}`}
												>
													{registrationFields.map(
														(field) => (
															<Input
																key={field.id}
																type={
																	field.type
																}
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

													{terms.length > 0 && (
														<div className="space-y-2">
															{terms.map(
																(term) => {
																	const definition =
																		availableTerms.find(
																			(
																				t,
																			) =>
																				t.id ===
																				term.termDefinitionId,
																		);
																	if (
																		!definition
																	)
																		return null;

																	return (
																		<div
																			key={
																				term.id
																			}
																			className="flex items-start gap-2"
																		>
																			<input
																				type="checkbox"
																				id={`term-${term.id}`}
																				className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
																				required={
																					term.required
																				}
																			/>
																			<label
																				htmlFor={`term-${term.id}`}
																				className="text-sm text-muted-foreground leading-tight"
																				style={{
																					fontSize: `${Number.parseInt(baseFontSize) * 0.875}px`,
																				}}
																			>
																				{
																					definition.label
																				}
																				{term.required && (
																					<span className="text-red-500 ml-0.5">
																						*
																					</span>
																				)}
																			</label>
																		</div>
																	);
																},
															)}
														</div>
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
												</div>
											)}

											{registrationMode === "button" && (
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
											)}

											{accessCodesEnabled && (
												<>
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

													<Button
														variant="outline"
														className="w-full"
														style={{
															fontSize: `${baseFontSize}px`,
														}}
													>
														Enter an Access Code
													</Button>
												</>
											)}

											{showLoginOption && (
												<Button
													variant="outline"
													className="w-full"
													style={{
														fontSize: `${baseFontSize}px`,
													}}
												>
													{loginButtonText}
												</Button>
											)}
										</div>
									</>
								)}

								{/* Registration Page Preview */}
								{previewPage === "registration" &&
									registrationMode === "button" && (
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
														fontSize: `${Number.parseInt(baseFontSize) * 1.25}px`,
													}}
												>
													{registrationTitle}
												</h2>
												<p
													className="text-muted-foreground"
													style={{
														fontSize: `${baseFontSize}px`,
													}}
												>
													{registrationDescription}
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

												{terms.length > 0 && (
													<div className="space-y-2">
														{terms.map((term) => {
															const definition =
																availableTerms.find(
																	(t) =>
																		t.id ===
																		term.termDefinitionId,
																);
															if (!definition)
																return null;

															return (
																<div
																	key={
																		term.id
																	}
																	className="flex items-start gap-2"
																>
																	<input
																		type="checkbox"
																		id={`term-${term.id}`}
																		className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
																		required={
																			term.required
																		}
																	/>
																	<label
																		htmlFor={`term-${term.id}`}
																		className="text-sm text-muted-foreground leading-tight"
																		style={{
																			fontSize: `${Number.parseInt(baseFontSize) * 0.875}px`,
																		}}
																	>
																		{
																			definition.label
																		}
																		{term.required && (
																			<span className="text-red-500 ml-0.5">
																				*
																			</span>
																		)}
																	</label>
																</div>
															);
														})}
													</div>
												)}
												<Button
													className="w-full"
													style={{
														backgroundColor:
															primaryColor,
														fontSize: `${baseFontSize}px`,
													}}
												>
													{
														registrationSubmitButtonText
													}
												</Button>
											</div>
										</>
									)}

								{/* Sponsor Request Preview */}
								{previewPage === "sponsor" &&
									sponsorshipEnabled && (
										<div
											className={`${
												spacing === "compact"
													? "space-y-2"
													: spacing === "spacious"
														? "space-y-6"
														: "space-y-4"
											}`}
										>
											<div className="text-center">
												<h2
													className="font-bold"
													style={{
														fontSize: `${Number.parseInt(baseFontSize) * 1.25}px`,
													}}
												>
													Sponsor Approval Required
												</h2>
												<p
													className="text-muted-foreground mt-2"
													style={{
														fontSize: `${baseFontSize}px`,
													}}
												>
													{sponsorMessage}
												</p>
											</div>

											{/* Sponsor Selection UI */}
											<div className="space-y-3">
												{sponsorSelectionMode ===
												"dropdown" ? (
													<>
														<Label
															style={{
																fontSize: `${baseFontSize}px`,
															}}
														>
															Select your sponsor
														</Label>
														<Select>
															<SelectTrigger
																style={{
																	fontSize: `${baseFontSize}px`,
																}}
															>
																<SelectValue placeholder="Choose a sponsor..." />
															</SelectTrigger>
															<SelectContent>
																{/* Search input for filtering */}
																<div className="px-2 pb-2">
																	<Input
																		placeholder="Search..."
																		className="h-8"
																		style={{
																			fontSize: `${Number.parseInt(baseFontSize) * 0.875}px`,
																		}}
																	/>
																</div>
																<SelectItem value="john">
																	<div>
																		<div className="font-medium">
																			John
																			Doe
																		</div>
																		<div className="text-xs text-muted-foreground">
																			john.doe@company.com
																		</div>
																	</div>
																</SelectItem>
																<SelectItem value="jane">
																	<div>
																		<div className="font-medium">
																			Jane
																			Smith
																		</div>
																		<div className="text-xs text-muted-foreground">
																			jane.smith@company.com
																		</div>
																	</div>
																</SelectItem>
																<SelectItem value="bob">
																	<div>
																		<div className="font-medium">
																			Bob
																			Johnson
																		</div>
																		<div className="text-xs text-muted-foreground">
																			bob.johnson@company.com
																		</div>
																	</div>
																</SelectItem>
															</SelectContent>
														</Select>
													</>
												) : (
													<>
														<Label
															style={{
																fontSize: `${baseFontSize}px`,
															}}
														>
															Search your sponsor
															by email or name
														</Label>
														<Input
															placeholder="Type at least 3 characters..."
															style={{
																fontSize: `${baseFontSize}px`,
															}}
														/>
														<p className="text-xs text-muted-foreground">
															Start typing to see
															suggestions
														</p>
													</>
												)}
											</div>

											<Button
												className="w-full"
												style={{
													backgroundColor:
														primaryColor,
													fontSize: `${baseFontSize}px`,
												}}
											>
												Request Approval
											</Button>
										</div>
									)}

								{/* Easy WiFi Preview */}
								{previewPage === "easy-wifi" &&
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
													fontSize: `${Number.parseInt(baseFontSize) * 1.25}px`,
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
								{previewPage === "validation" &&
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
													fontSize: `${Number.parseInt(baseFontSize) * 1.25}px`,
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
								{previewPage === "success" &&
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
													fontSize: `${Number.parseInt(baseFontSize) * 1.25}px`,
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
								{previewPage === "blocked" && (
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
												fontSize: `${Number.parseInt(baseFontSize) * 1.25}px`,
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
