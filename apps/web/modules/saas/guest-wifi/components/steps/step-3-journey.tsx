"use client";

import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { RadioGroup, RadioGroupItem } from "@ui/components/radio-group";
import { Switch } from "@ui/components/switch";
import { Tabs, TabsList, TabsTrigger } from "@ui/components/tabs";
import { Textarea } from "@ui/components/textarea";
import { useState } from "react";

export function StepJourney() {
	const [previewMode, setPreviewMode] = useState<
		"mobile" | "tablet" | "desktop"
	>("mobile");

	return (
		<div className="flex h-full">
			{/* Left Panel - Configuration */}
			<div className="w-1/2 overflow-y-auto p-6 space-y-6">
				{/* Easy WiFi onboarding */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">
								Easy WiFi onboarding
							</div>
							<p className="text-sm text-muted-foreground">
								Allow users to download a Profile for a
								simplified returning experience
							</p>
						</div>
						<Switch />
					</div>

					<div className="space-y-3 pl-6">
						<div className="space-y-2">
							<Label>Call to action message</Label>
							<Textarea
								defaultValue="You need to wait that your host approves your access"
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label>Skip message</Label>
							<Input defaultValue="I'll take my chances" />
						</div>
					</div>
				</div>

				{/* Success page */}
				<div className="space-y-4">
					<div>
						<div className="font-medium">Success page</div>
						<p className="text-sm text-muted-foreground">
							Set up the user experience after they log in (most
							Androids skip this part)
						</p>
					</div>

					<div className="space-y-4 pl-6">
						<div className="space-y-3">
							<Label>Select your redirect mode</Label>
							<RadioGroup defaultValue="external">
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
									<Label
										htmlFor="text"
										className="font-normal"
									>
										Text page
									</Label>
								</div>
							</RadioGroup>
						</div>

						<div className="space-y-2">
							<Label>Redirect URL</Label>
							<Input
								type="url"
								defaultValue="https://mybusinessite.com"
								placeholder="https://"
							/>
						</div>
					</div>
				</div>

				{/* Returning users */}
				<div className="space-y-4">
					<div>
						<div className="font-medium">Returning users</div>
						<p className="text-sm text-muted-foreground">
							Set the experience for users coming back to the
							network with recognized devices
						</p>
					</div>

					<div className="flex items-center gap-2 pl-6">
						<Checkbox id="auto-connect" defaultChecked />
						<Label htmlFor="auto-connect" className="font-normal">
							Automatically connect returning user (no captive
							portal)
						</Label>
					</div>
				</div>

				{/* Users with expired access */}
				<div className="space-y-4">
					<div>
						<div className="font-medium">
							Users with expired access
						</div>
						<p className="text-sm text-muted-foreground">
							Set up how users can act when their access expires.
						</p>
					</div>

					<div className="space-y-3 pl-6">
						<div className="flex items-center gap-2">
							<Checkbox id="bypass-limits" defaultChecked />
							<Label
								htmlFor="bypass-limits"
								className="font-normal"
							>
								Allow to bypass limits with a code
							</Label>
						</div>

						<div className="flex items-center gap-2">
							<Checkbox id="ask-extension" defaultChecked />
							<Label
								htmlFor="ask-extension"
								className="font-normal"
							>
								Allow to ask for an extension to a Host
							</Label>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Preview */}
			<div className="w-1/2 bg-muted/30 p-6">
				<div className="space-y-4">
					{/* Preview Controls */}
					<div className="flex items-center justify-end gap-2">
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
					<div className="flex items-center justify-center h-[calc(100%-60px)]">
						<div
							className={`bg-background rounded-lg border shadow-lg transition-all ${
								previewMode === "mobile"
									? "w-[375px]"
									: previewMode === "tablet"
										? "w-[768px]"
										: "w-full max-w-4xl"
							}`}
						>
							<div className="p-6 space-y-4">
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
									<Button
										variant="outline"
										className="w-full gap-2"
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

									<Input placeholder="Gender" />
									<Input placeholder="First name" />
									<Input placeholder="Last name" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
