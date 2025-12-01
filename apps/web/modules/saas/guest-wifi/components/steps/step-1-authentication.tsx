"use client";

import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
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
import { FileText } from "lucide-react";
import { useState } from "react";
import { ConfigureSignupFormDialog } from "../configure-signup-form-dialog";

export function StepAuthentication() {
	const [signupFormDialogOpen, setSignupFormDialogOpen] = useState(false);
	const [timeLimitEnabled, setTimeLimitEnabled] = useState(true);
	const [sponsorshipEnabled, setSponsorshipEnabled] = useState(true);

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
					<TabsContent value="signup" className="space-y-6 mt-6">
						{/* Guests Registration */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium">
										Guests Registration
									</div>
									<p className="text-sm text-muted-foreground">
										Allow users to sign-up and sign-in with
										nominal accounts
									</p>
								</div>
								<Switch defaultChecked />
							</div>

							<div className="space-y-3 pl-6">
								<div className="flex items-center gap-2">
									<Checkbox
										id="allow-signup"
										defaultChecked
									/>
									<Label
										htmlFor="allow-signup"
										className="font-normal"
									>
										Allow users to sign-up for an account
									</Label>
								</div>

								<Button
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() =>
										setSignupFormDialogOpen(true)
									}
									type="button"
								>
									<FileText className="h-4 w-4" />
									Configure Sign-Up Form
								</Button>

								<ConfigureSignupFormDialog
									open={signupFormDialogOpen}
									onOpenChange={setSignupFormDialogOpen}
								/>

								<div className="flex items-center gap-2">
									<Checkbox id="show-login" defaultChecked />
									<Label
										htmlFor="show-login"
										className="font-normal"
									>
										Show option to login with existing
										account
									</Label>
								</div>

								<div className="flex items-center gap-2">
									<Checkbox id="apple-id" defaultChecked />
									<Label
										htmlFor="apple-id"
										className="font-normal"
									>
										Apple ID
									</Label>
									<span className="text-xs text-muted-foreground">
										Allow users to Sign Up / Sign In via
										Apple ID on iOS devices
									</span>
								</div>
							</div>
						</div>

						{/* Email verification */}
						<div className="space-y-2">
							<Label>Email verification</Label>
							<Select defaultValue="soft">
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="soft">Soft</SelectItem>
									<SelectItem value="enabled">
										Enabled
									</SelectItem>
									<SelectItem value="disabled">
										Disabled
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Phone verification */}
						<div className="space-y-2">
							<Label>Phone verification</Label>
							<Select defaultValue="enabled">
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

						{/* Terms and agreements */}
						<div className="space-y-3">
							<div>
								<div className="font-medium">
									Terms and agreeements
								</div>
								<p className="text-sm text-muted-foreground">
									Collect users consent and acknowledgement to
									your terms
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="gap-2"
							>
								<FileText className="h-4 w-4" />
								Configure Terms
							</Button>
						</div>

						{/* Enterprise IdP */}
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">
									Enterprise IdP
								</div>
								<p className="text-sm text-muted-foreground">
									Allow users to access with their existing
									accounts
								</p>
							</div>
							<Switch />
						</div>

						{/* Access Codes */}
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">Access Codes</div>
								<p className="text-sm text-muted-foreground">
									Manages access via Access Codes
								</p>
							</div>
							<Switch defaultChecked />
						</div>
					</TabsContent>

					{/* Access Control Tab */}
					<TabsContent value="access" className="space-y-6 mt-6">
						{/* Time Limit */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium">
										Time Limit
									</div>
									<p className="text-sm text-muted-foreground">
										Set a maximum internet access per day
										for guest users
									</p>
								</div>
								<Switch checked={timeLimitEnabled} onCheckedChange={setTimeLimitEnabled} />
							</div>

							{timeLimitEnabled && (
								<div className="space-y-2 pl-6">
									<Select defaultValue="24">
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="1">
												1 hour
											</SelectItem>
											<SelectItem value="6">
												6 hours
											</SelectItem>
											<SelectItem value="12">
												12 hours
											</SelectItem>
											<SelectItem value="24">
												24 hours
											</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-xs text-muted-foreground">
										Limit per day
									</p>
								</div>
							)}
						</div>

						{/* Sponsorship approval */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium">
										Sponsorship approval
									</div>
									<p className="text-sm text-muted-foreground">
										Require guest to be approved by a host
									</p>
								</div>
								<Switch checked={sponsorshipEnabled} onCheckedChange={setSponsorshipEnabled} />
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

						{/* Access Hours */}
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">Access Hours</div>
								<p className="text-sm text-muted-foreground">
									Limit access to WiFi to business hours
								</p>
							</div>
							<Switch />
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
								<Input placeholder="First Name" />
								<Input placeholder="Email address" />
								<Button className="w-full">Register</Button>

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

								<Button variant="outline" className="w-full">
									Enter an Access Code
								</Button>
								<Button variant="outline" className="w-full">
									Login with your account
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
