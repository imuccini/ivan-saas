"use client";

import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Switch } from "@ui/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { ChevronDown, FileText } from "lucide-react";
import { useState } from "react";
import { ConfigureSignupFormDialog } from "../configure-signup-form-dialog";
import { ConfigureTermsDialog } from "../configure-terms-dialog";

interface FormField {
	id: string;
	label: string;
	placeholder?: string;
	required: boolean;
	type: string;
	isCustom?: boolean;
	options?: string[];
}

interface StepAuthenticationProps {
	registrationFields: FormField[];
	setRegistrationFields: (fields: FormField[]) => void;
	sponsorshipEnabled: boolean;
	setSponsorshipEnabled: (enabled: boolean) => void;
	phoneValidationEnabled: boolean;
	setPhoneValidationEnabled: (enabled: boolean) => void;
}

export function StepAuthentication({
	registrationFields,
	setRegistrationFields,
	sponsorshipEnabled,
	setSponsorshipEnabled,
	phoneValidationEnabled,
	setPhoneValidationEnabled,
}: StepAuthenticationProps) {
	const [signupFormDialogOpen, setSignupFormDialogOpen] = useState(false);
	const [termsDialogOpen, setTermsDialogOpen] = useState(false);
	const [accessCodesEnabled, setAccessCodesEnabled] = useState(false);
	const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);
	const [accessHoursEnabled, setAccessHoursEnabled] = useState(false);
	const [showLoginOption, setShowLoginOption] = useState(true);
	const [appleIdEnabled, setAppleIdEnabled] = useState(false);
	const [enterpriseIdpEnabled, setEnterpriseIdpEnabled] = useState(false);
	const [selectedIdps, setSelectedIdps] = useState<string[]>([]);
	const [timeSlots, setTimeSlots] = useState<
		{ id: string; start: string; end: string }[]
	>([{ id: "1", start: "09:00", end: "17:00" }]);

	const idpOptions = [
		{ id: "azure", label: "Azure AD" },
		{ id: "google", label: "Google Workspace" },
		{ id: "okta", label: "Okta" },
	];

	const addTimeSlot = () => {
		const newId = (timeSlots.length + 1).toString();
		setTimeSlots([
			...timeSlots,
			{ id: newId, start: "09:00", end: "17:00" },
		]);
	};

	const removeTimeSlot = (id: string) => {
		setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
	};

	return (
		<div className="flex h-full">
			{/* Left Panel - Configuration */}
			<div className="w-1/2 overflow-y-auto border-r p-6">
				<Tabs defaultValue="signup" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="signup">
							Sign Up / Sign In
						</TabsTrigger>
						<TabsTrigger value="access">Access Control</TabsTrigger>
					</TabsList>

					{/* Sign Up / Sign In Tab */}
					<TabsContent value="signup" className="space-y-4 mt-6">
						{/* Guests Registration Card */}
						<div className="rounded-lg border bg-card p-4 space-y-4">
							<div className="font-semibold">
								Guests Registration
							</div>

							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Checkbox
										id="show-login"
										checked={showLoginOption}
										onCheckedChange={(checked) =>
											setShowLoginOption(checked === true)
										}
									/>
									<Label
										htmlFor="show-login"
										className="font-normal"
									>
										Show option to login
									</Label>
								</div>

								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<Checkbox
											id="apple-id"
											checked={appleIdEnabled}
											onCheckedChange={(checked) =>
												setAppleIdEnabled(
													checked === true,
												)
											}
										/>
										<Label
											htmlFor="apple-id"
											className="font-normal"
										>
											Apple ID
										</Label>
									</div>
									<p className="text-xs text-muted-foreground pl-6">
										Description apple ID for erming
										directily to Apple ID.
									</p>
								</div>

								<Button
									variant="outline"
									size="sm"
									className="gap-2 w-full"
									onClick={() =>
										setSignupFormDialogOpen(true)
									}
									type="button"
								>
									Configure Sign-Up Form
								</Button>

								<ConfigureSignupFormDialog
									open={signupFormDialogOpen}
									onOpenChange={setSignupFormDialogOpen}
									initialFields={registrationFields}
									onSave={setRegistrationFields}
								/>
							</div>
						</div>

						{/* Verification Card */}
						<div className="rounded-lg border bg-card p-4 space-y-4">
							<div className="font-semibold">Verification</div>

							<div className="space-y-3">
								<div className="space-y-2">
									<Label>Email verification</Label>
									<Select defaultValue="soft">
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="soft">
												Soft
											</SelectItem>
											<SelectItem value="enabled">
												Enabled
											</SelectItem>
											<SelectItem value="disabled">
												Disabled
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label>Phone verification</Label>
									<Select
										value={
											phoneValidationEnabled
												? "enabled"
												: "disabled"
										}
										onValueChange={(value) =>
											setPhoneValidationEnabled(
												value === "enabled",
											)
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="enabled">
												Enabled
											</SelectItem>
											<SelectItem value="disabled">
												Disabled
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Terms and agreements Card */}
						<div className="rounded-lg border bg-card p-4 space-y-3">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<div className="font-semibold">
										Terms and agreements
									</div>
									<p className="text-sm text-muted-foreground">
										Define what terms and consent you want
										to collect from the user
									</p>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setTermsDialogOpen(true)}
									type="button"
								>
									Configure Terms
								</Button>
							</div>

							<ConfigureTermsDialog
								open={termsDialogOpen}
								onOpenChange={setTermsDialogOpen}
							/>
						</div>

						{/* Enterprise IdP Card */}
						<div className="rounded-lg border bg-card p-4 space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<div className="font-semibold">
										Enterprise IdP
									</div>
									<p className="text-sm text-muted-foreground">
										Allow users to authenticate with their
										corporate accounts
									</p>
								</div>
								<Switch
									checked={enterpriseIdpEnabled}
									onCheckedChange={setEnterpriseIdpEnabled}
								/>
							</div>

							{enterpriseIdpEnabled && (
								<div className="space-y-2 pt-2">
									<Label className="text-sm">
										Select Identity Providers
									</Label>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="outline"
												className="w-full justify-between h-auto min-h-10 py-2 px-3"
											>
												<div className="flex flex-wrap gap-1 text-left">
													{selectedIdps.length > 0 ? (
														selectedIdps.map(
															(id) => {
																const option =
																	idpOptions.find(
																		(o) =>
																			o.id ===
																			id,
																	);
																return (
																	<Badge
																		key={id}
																		variant="secondary"
																		className="mr-1 mb-1"
																	>
																		{option?.label ||
																			id}
																	</Badge>
																);
															},
														)
													) : (
														<span className="text-muted-foreground font-normal">
															Select Identity
															Providers...
														</span>
													)}
												</div>
												<ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]">
											<DropdownMenuLabel>
												Identity Providers
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											{idpOptions.map((option) => (
												<DropdownMenuCheckboxItem
													key={option.id}
													checked={selectedIdps.includes(
														option.id,
													)}
													onCheckedChange={(
														checked,
													) => {
														if (checked) {
															setSelectedIdps([
																...selectedIdps,
																option.id,
															]);
														} else {
															setSelectedIdps(
																selectedIdps.filter(
																	(id) =>
																		id !==
																		option.id,
																),
															);
														}
													}}
												>
													{option.label}
												</DropdownMenuCheckboxItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)}
						</div>

						{/* Access Codes Card */}
						<div className="rounded-lg border bg-card p-4">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<div className="font-semibold">
										Access Codes
									</div>
									<p className="text-sm text-muted-foreground">
										Allow users to enter access codes
									</p>
								</div>
								<Switch
									checked={accessCodesEnabled}
									onCheckedChange={setAccessCodesEnabled}
								/>
							</div>
						</div>
					</TabsContent>

					{/* Access Control Tab */}
					<TabsContent value="access" className="space-y-4 mt-6">
						{/* Time Limit Card */}
						<div className="rounded-lg border bg-card p-4 space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<div className="font-semibold">
										Time Limit
									</div>
									<p className="text-sm text-muted-foreground">
										Set a maximum internet access per day
										for guest users
									</p>
								</div>
								<Switch
									checked={timeLimitEnabled}
									onCheckedChange={setTimeLimitEnabled}
								/>
							</div>

							{timeLimitEnabled && (
								<div className="space-y-2">
									<Select defaultValue="24">
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Array.from(
												{ length: 24 },
												(_, i) => i + 1,
											).map((hour) => (
												<SelectItem
													key={hour}
													value={hour.toString()}
												>
													{hour}{" "}
													{hour === 1
														? "hour"
														: "hours"}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<p className="text-xs text-muted-foreground">
										Limit per day
									</p>
								</div>
							)}
						</div>

						{/* Sponsorship approval Card */}
						<div className="rounded-lg border bg-card p-4 space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<div className="font-semibold">
										Sponsorship approval
									</div>
									<p className="text-sm text-muted-foreground">
										Require guest to be approved by a host
									</p>
								</div>
								<Switch
									checked={sponsorshipEnabled}
									onCheckedChange={setSponsorshipEnabled}
								/>
							</div>

							{sponsorshipEnabled && (
								<div className="space-y-4 pl-6">
									<div className="space-y-3">
										<Label>
											Chose how sponsors are selected
										</Label>
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<input
													type="radio"
													id="email-dropdown"
													name="sponsor-selection"
													defaultChecked
												/>
												<Label
													htmlFor="email-dropdown"
													className="font-normal"
												>
													Select email form dropdown
												</Label>
											</div>
											<div className="flex items-center gap-2">
												<input
													type="radio"
													id="type-email"
													name="sponsor-selection"
												/>
												<Label
													htmlFor="type-email"
													className="font-normal"
												>
													Type email
												</Label>
											</div>
										</div>
									</div>

									<Button
										variant="outline"
										size="sm"
										className="gap-2"
									>
										<FileText className="h-4 w-4" />
										Manage sponsors (0)
									</Button>

									<div className="space-y-2">
										<Label>Visitor Access Duration</Label>
										<div className="flex items-center gap-2">
											<Input
												type="number"
												defaultValue="24"
												className="w-20"
											/>
											<Select defaultValue="hours">
												<SelectTrigger className="w-32">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="hours">
														Hours
													</SelectItem>
													<SelectItem value="days">
														Days
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Switch />
										<Label className="font-normal">
											Enable sponsor duration override
										</Label>
									</div>
								</div>
							)}
						</div>

						{/* Access Hours Card */}
						<div className="rounded-lg border bg-card p-4 space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<div className="font-semibold">
										Access Hours
									</div>
									<p className="text-sm text-muted-foreground">
										Limit access to WiFi to business hours
									</p>
								</div>
								<Switch
									checked={accessHoursEnabled}
									onCheckedChange={setAccessHoursEnabled}
								/>
							</div>

							{accessHoursEnabled && (
								<div className="space-y-3">
									<Label className="text-sm">
										Time Slots
									</Label>
									<div className="space-y-2">
										{timeSlots.map((slot, index) => (
											<div
												key={slot.id}
												className="flex items-center gap-2"
											>
												<div className="flex items-center gap-2 flex-1">
													<Input
														type="time"
														value={slot.start}
														onChange={(e) => {
															const newSlots = [
																...timeSlots,
															];
															newSlots[
																index
															].start =
																e.target.value;
															setTimeSlots(
																newSlots,
															);
														}}
														className="w-32"
													/>
													<span className="text-muted-foreground">
														to
													</span>
													<Input
														type="time"
														value={slot.end}
														onChange={(e) => {
															const newSlots = [
																...timeSlots,
															];
															newSlots[
																index
															].end =
																e.target.value;
															setTimeSlots(
																newSlots,
															);
														}}
														className="w-32"
													/>
												</div>
												{timeSlots.length > 1 && (
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															removeTimeSlot(
																slot.id,
															)
														}
														type="button"
													>
														×
													</Button>
												)}
											</div>
										))}
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={addTimeSlot}
										type="button"
										className="w-full"
									>
										+ Add Time Slot
									</Button>
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>

			{/* Right Panel - Preview */}
			<div className="w-1/2 bg-muted/30 p-6 flex items-center justify-center">
				<div className="w-full max-w-md">
					<div className="rounded-lg border bg-background p-6 shadow-lg">
						<div className="space-y-4">
							<div className="flex justify-center mb-6">
								<div className="h-12 w-32 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
									CLOUD4WI
								</div>
							</div>

							<div className="text-center space-y-2">
								<h2 className="text-xl font-bold">
									Get online with free WiFi
								</h2>
								<p className="text-sm text-muted-foreground">
									How do you want to connect?
								</p>
							</div>

							<div className="space-y-3">
								{registrationFields.map((field) => (
									<Input
										key={field.id}
										type={field.type}
										placeholder={
											field.placeholder || field.label
										}
									/>
								))}
								<Button className="w-full">Register</Button>

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
										>
											Enter an Access Code
										</Button>
									</>
								)}

								{appleIdEnabled && (
									<Button
										variant="outline"
										className="w-full gap-2"
									>
										<svg
											viewBox="0 0 24 24"
											fill="currentColor"
											className="h-4 w-4"
										>
											<title>Apple Logo</title>
											<path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
										</svg>
										Sign in with Apple
									</Button>
								)}

								{showLoginOption && (
									<Button
										variant="outline"
										className="w-full"
									>
										Login with your account
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
