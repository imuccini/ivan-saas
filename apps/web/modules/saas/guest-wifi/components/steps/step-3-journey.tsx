"use client";

import { Checkbox } from "@ui/components/checkbox";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { RadioGroup, RadioGroupItem } from "@ui/components/radio-group";
import { Switch } from "@ui/components/switch";

interface StepJourneyProps {
	easyWifiEnabled?: boolean;
	setEasyWifiEnabled?: (enabled: boolean) => void;
	successRedirectMode?: string;
	setSuccessRedirectMode?: (mode: string) => void;
}

export function StepJourney({
	easyWifiEnabled = false,
	setEasyWifiEnabled,
	successRedirectMode = "external",
	setSuccessRedirectMode,
}: StepJourneyProps) {
	return (
		<div className="h-full p-6 space-y-6">
			{/* Easy WiFi onboarding */}
			<div className="rounded-lg border bg-card p-4 space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="font-semibold">
							Easy WiFi onboarding
						</div>
						<p className="text-sm text-muted-foreground">
							Allow users to download a Profile for a simplified
							returning experience
						</p>
					</div>
					<Switch
						checked={easyWifiEnabled}
						onCheckedChange={setEasyWifiEnabled}
					/>
				</div>
			</div>

			{/* Success page */}
			<div className="rounded-lg border bg-card p-4 space-y-4">
				<div className="space-y-1">
					<div className="font-semibold">Success page</div>
					<p className="text-sm text-muted-foreground">
						Set up the user experience after they log in (most
						Androids skip this part)
					</p>
				</div>

				<div className="space-y-4">
					<div className="space-y-3">
						<Label>Select your redirect mode</Label>
						<RadioGroup
							value={successRedirectMode}
							onValueChange={setSuccessRedirectMode}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="external"
									id="external"
								/>
								<Label
									htmlFor="external"
									className="font-normal"
								>
									External URL
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="text" id="text" />
								<Label htmlFor="text" className="font-normal">
									Success page
								</Label>
							</div>
						</RadioGroup>
					</div>

					{successRedirectMode === "external" && (
						<div className="space-y-2">
							<Label>Redirect URL</Label>
							<Input
								type="url"
								defaultValue="https://mybusinessite.com"
								placeholder="https://"
							/>
						</div>
					)}
				</div>
			</div>

			{/* Returning users */}
			<div className="rounded-lg border bg-card p-4 space-y-4">
				<div className="space-y-1">
					<div className="font-semibold">Returning users</div>
					<p className="text-sm text-muted-foreground">
						Set the experience for users coming back to the network
						with recognized devices
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Checkbox id="auto-connect" defaultChecked />
					<Label htmlFor="auto-connect" className="font-normal">
						Automatically connect returning user (no captive portal)
					</Label>
				</div>
			</div>

			{/* Users with expired access */}
			<div className="rounded-lg border bg-card p-4 space-y-4">
				<div className="space-y-1">
					<div className="font-semibold">
						Users with expired access
					</div>
					<p className="text-sm text-muted-foreground">
						Set up how users can act when their access expires.
					</p>
				</div>

				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<Checkbox id="bypass-limits" defaultChecked />
						<Label htmlFor="bypass-limits" className="font-normal">
							Allow to bypass limits with a code
						</Label>
					</div>

					<div className="flex items-center gap-2">
						<Checkbox id="ask-extension" defaultChecked />
						<Label htmlFor="ask-extension" className="font-normal">
							Allow to ask for an extension to a Host
						</Label>
					</div>
				</div>
			</div>
		</div>
	);
}
