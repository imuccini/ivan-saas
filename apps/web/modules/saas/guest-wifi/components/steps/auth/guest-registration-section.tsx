"use client";

import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
import { Label } from "@ui/components/label";
import { Switch } from "@ui/components/switch";
import { LayoutTemplate, MousePointerClick } from "lucide-react";
import { useState } from "react";
import { ConfigureSignupFormDialog } from "../../configure-signup-form-dialog";
import { useWizard } from "../../wizard-context";

export function GuestRegistrationSection() {
	const {
		guestRegistrationEnabled,
		setGuestRegistrationEnabled,
		registrationMode,
		setRegistrationMode,
		appleIdEnabled,
		setAppleIdEnabled,
		registrationFields,
		setRegistrationFields,
		showLoginOption,
		setShowLoginOption,
	} = useWizard();

	const [signupFormDialogOpen, setSignupFormDialogOpen] = useState(false);

	return (
		<div className="rounded-lg border bg-card p-4 space-y-4">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<div className="font-semibold">Guest Accounts</div>
					<p className="text-sm text-muted-foreground">
						Define how guests register or log in using built-in
						credentials.
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
					<div className="space-y-4">
						<div className="space-y-3">
							<Label className="text-sm font-medium">
								Display
							</Label>
							<div className="flex bg-muted p-1 rounded-lg">
								<button
									type="button"
									onClick={() =>
										setRegistrationMode("button")
									}
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
									Home page will show only a registration
									button. A separate registration page will be
									added to the journey.
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
									Enable Apple ID for quick sign-up (Apple
									devices only)
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
	);
}
