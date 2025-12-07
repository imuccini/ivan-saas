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
import { ChevronDown, FileText, LayoutTemplate, MousePointerClick } from "lucide-react";
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

interface SelectedTerm {
	id: string;
	termDefinitionId: string;
	required: boolean;
}

interface StepAuthenticationProps {
	registrationFields: FormField[];
	setRegistrationFields: (fields: FormField[]) => void;
	sponsorshipEnabled: boolean;
	setSponsorshipEnabled: (enabled: boolean) => void;
	phoneValidationEnabled: boolean;
	setPhoneValidationEnabled: (enabled: boolean) => void;
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
	guestRegistrationEnabled: boolean;
	setGuestRegistrationEnabled: (enabled: boolean) => void;
	registrationMode: "form" | "button";
	setRegistrationMode: (mode: "form" | "button") => void;
}

export function StepAuthentication({
	registrationFields,
	setRegistrationFields,
	sponsorshipEnabled,
	setSponsorshipEnabled,
	phoneValidationEnabled,
	setPhoneValidationEnabled,
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
	guestRegistrationEnabled,
	setGuestRegistrationEnabled,
	registrationMode,
	setRegistrationMode,
}: StepAuthenticationProps) {
	const [signupFormDialogOpen, setSignupFormDialogOpen] = useState(false);
	const [termsDialogOpen, setTermsDialogOpen] = useState(false);
	const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);
	const [accessHoursEnabled, setAccessHoursEnabled] = useState(false);
	const [timeSlots, setTimeSlots] = useState<
		{ id: string; start: string; end: string }[]
	>([{ id: "1", start: "09:00", end: "17:00" }]);

	const idpOptions = [
		{ id: "azure", label: "Entra ID", category: "enterprise" },
		{ id: "google", label: "Google Workspace", category: "enterprise" },
		{ id: "opera", label: "Opera Cloud", category: "pms" },
		{ id: "mews", label: "Mews", category: "pms" },
		{ id: "apaleo", label: "Apaleo", category: "pms" },
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
		<div className="h-full p-6">
			<Tabs defaultValue="signup" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="signup">Sign Up / Sign In</TabsTrigger>
					<TabsTrigger value="access">Access Control</TabsTrigger>
				</TabsList>

				{/* Sign Up / Sign In Tab */}
				<TabsContent value="signup" className="space-y-4 mt-6">
					{/* 1. Guest Accounts Card */}
					<div className="rounded-lg border bg-card p-4 space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<div className="font-semibold">Guest Accounts</div>
								<p className="text-sm text-muted-foreground">
									Define how guests register or log in using built-in credentials.
								</p>
							</div>
						</div>

						<div className="space-y-4 pt-2">
							<div className="flex items-center justify-between">
								<Label className="text-base font-medium">
									Allow Guest Registration
								</Label>
								<Switch
									checked={guestRegistrationEnabled}
									onCheckedChange={setGuestRegistrationEnabled}
								/>
							</div>

							{guestRegistrationEnabled && (
								<div className="space-y-4 pl-4 border-l-2 border-muted ml-2">
									<div className="space-y-3">
										<Label className="text-sm font-medium">Display</Label>
										<div className="flex bg-muted p-1 rounded-lg">
											<button
												type="button"
												onClick={() => setRegistrationMode("button")}
												className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-all ${
													registrationMode === "button"
														? "bg-background text-foreground shadow-sm"
														: "text-muted-foreground hover:bg-background/50"
												}`}
											>
												<MousePointerClick className="w-4 h-4" />
												Show Button
											</button>
											<button
												type="button"
												onClick={() => setRegistrationMode("form")}
												className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-all ${
													registrationMode === "form"
														? "bg-background text-foreground shadow-sm"
														: "text-muted-foreground hover:bg-background/50"
												}`}
											>
												<LayoutTemplate className="w-4 h-4" />
												Show Form on Homepage
											</button>
										</div>
										{registrationMode === "button" && (
											<p className="text-xs text-muted-foreground">
												Home page will show only a registration button. A separate registration page will be added to the journey.
											</p>
										)}
									</div>

									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<Checkbox
												id="apple-id"
												checked={appleIdEnabled}
												onCheckedChange={(checked) =>
													setAppleIdEnabled(checked === true)
												}
											/>
											<Label
												htmlFor="apple-id"
												className="font-normal"
											>
												Enable Apple ID for quick sign-up (Apple devices only)
											</Label>
										</div>
									</div>

									<Button
										variant="outline"
										size="sm"
										className="gap-2 w-full"
										onClick={() => setSignupFormDialogOpen(true)}
										type="button"
									>
										Configure Registration Form fields
									</Button>

									<ConfigureSignupFormDialog
										open={signupFormDialogOpen}
										onOpenChange={setSignupFormDialogOpen}
										initialFields={registrationFields}
										onSave={setRegistrationFields}
									/>
								</div>
							)}

							<div className="flex items-center justify-between pt-4 border-t">
								<div className="space-y-0.5">
									<Label className="text-base">
										Allows users with existing credentials to sign in.
									</Label>
								</div>
								<Switch
									checked={showLoginOption}
									onCheckedChange={setShowLoginOption}
								/>
							</div>
						</div>
					</div>

					{/* 2. Third-Party Authentication Card */}
					<div className="rounded-lg border bg-card p-4 space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<div className="font-semibold">
									Third-Party Authentication
								</div>
								<p className="text-sm text-muted-foreground">
									Allow users to authenticate via external systems
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
									Select Identity Sources
								</Label>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="w-full justify-between h-auto min-h-10 py-2 px-3"
										>
											<div className="flex flex-wrap gap-1 text-left">
												{selectedIdps.length > 0 ? (
													selectedIdps.map((id) => {
														const option =
															idpOptions.find(
																(o) =>
																	o.id === id,
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
													})
												) : (
													<span className="text-muted-foreground font-normal">
														Select Identity Sources...
													</span>
												)}
											</div>
											<ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]">
										<DropdownMenuLabel>
											Enterprise
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										{idpOptions
											.filter((option) => option.category === "enterprise")
											.map((option) => (
												<DropdownMenuCheckboxItem
													key={option.id}
													checked={selectedIdps.includes(
														option.id,
													)}
													onCheckedChange={(checked) => {
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
										<DropdownMenuLabel className="mt-2">
											PMS
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										{idpOptions
											.filter((option) => option.category === "pms")
											.map((option) => (
												<DropdownMenuCheckboxItem
													key={option.id}
													checked={selectedIdps.includes(
														option.id,
													)}
													onCheckedChange={(checked) => {
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

					{/* 3. Terms and agreements Card */}
					<div className="rounded-lg border bg-card p-4 space-y-3">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<div className="font-semibold">
									Terms and agreements
								</div>
								<p className="text-sm text-muted-foreground">
									Define terms and consents to collect from users joining the service, for all registration and identification methods.
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
							initialTerms={terms}
							onSave={setTerms}
						/>
					</div>

					{/* 4. Access Codes Card */}
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
								<div className="font-semibold">Time Limit</div>
								<p className="text-sm text-muted-foreground">
									Set a maximum internet access per day for
									guest users
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
												{hour === 1 ? "hour" : "hours"}
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

					{/* Verification Card - Only show if email or phone fields exist */}
					{(() => {
						const hasEmailField = registrationFields.some(
							(field) => field.type === "email",
						);
						const hasPhoneField = registrationFields.some(
							(field) => field.type === "tel",
						);

						// Don't show the card if neither email nor phone fields exist
						if (!hasEmailField && !hasPhoneField) {
							return null;
						}

						return (
							<div className="rounded-lg border bg-card p-4 space-y-4">
								<div className="font-semibold">
									Verification
								</div>

								<div className="space-y-3">
									{hasEmailField && (
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
									)}

									{hasPhoneField && (
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
									)}
								</div>
							</div>
						);
					})()}

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
								<Label className="text-sm">Time Slots</Label>
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
														newSlots[index].start =
															e.target.value;
														setTimeSlots(newSlots);
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
														newSlots[index].end =
															e.target.value;
														setTimeSlots(newSlots);
													}}
													className="w-32"
												/>
											</div>
											{timeSlots.length > 1 && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														removeTimeSlot(slot.id)
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
	);
}
