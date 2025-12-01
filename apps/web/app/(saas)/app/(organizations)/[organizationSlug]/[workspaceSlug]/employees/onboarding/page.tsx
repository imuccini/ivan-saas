"use client";

import { Button } from "@ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ui/components/card";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@ui/components/item";
import { Switch } from "@ui/components/switch";
import { Copy, Edit, ExternalLink, Wifi } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function OnboardingPage() {
	const [guestWifiOnboarding, setGuestWifiOnboarding] = useState(false);
	const [show802Credentials, setShow802Credentials] = useState(false);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	return (
		<div className="space-y-6">
			{/* BYOD Portal Section */}
			<div className="space-y-4">
				<div>
					<h2 className="text-2xl font-bold">BYOD Portal</h2>
					<p className="text-muted-foreground">
						Employees log into the BYOD portal using their corporate
						accounts to onboard their devices.
					</p>
				</div>

				<Card>
					<CardContent className="pt-6">
						<div className="flex gap-6">
							{/* Left Column - Portal Configuration */}
							<div className="w-1/2 space-y-6">
								{/* BYOD Portal URL using Item component */}
								<Item variant="outline">
									<ItemContent>
										<ItemTitle>BYOD Portal URL</ItemTitle>
										<ItemDescription>
											https://corpx.phoenix.ai
										</ItemDescription>
									</ItemContent>
									<ItemActions>
										<Button
											variant="outline"
											size="sm"
											className="gap-2"
											onClick={() =>
												copyToClipboard(
													"https://corpx.phoenix.ai",
												)
											}
										>
											<Copy className="h-4 w-4" />
											Copy URL
										</Button>
									</ItemActions>
								</Item>

								{/* Guest WiFi Contextual Onboarding */}
								<Item variant="outline">
									<ItemContent>
										<ItemTitle>
											Guest WiFi Contextual Onboarding
										</ItemTitle>
										<ItemDescription>
											Users registering on the Guest WiFi
											portal with a linked email domain
											will receive a BYOD onboarding
											email.
											<br />
											<a
												href="/settings/email-templates"
												className="inline-flex items-center gap-1 text-primary hover:underline mt-1"
											>
												<ExternalLink className="h-3 w-3" />
												Personalize BYOD onboarding
												email
											</a>
										</ItemDescription>
									</ItemContent>
									<ItemActions>
										<Switch
											checked={guestWifiOnboarding}
											onCheckedChange={
												setGuestWifiOnboarding
											}
										/>
									</ItemActions>
								</Item>
							</div>

							{/* Right Column - Preview Image */}
							<div className="w-1/2 flex items-center justify-center">
								<div className="w-full max-w-[250px] rounded-lg border overflow-hidden bg-muted/20">
									<Image
										src="/images/byodportal.png"
										alt="BYOD Portal Preview"
										width={250}
										height={312}
										className="w-full h-auto"
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Network Access Cards */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Secure Network Access */}
				<Card>
					<CardHeader>
						<CardTitle>Secure Network Access</CardTitle>
						<CardDescription>
							Network used for secure access via 802.1X
							authentication
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* 802.1X/Passpoint WiFi SSID */}
						<div className="flex items-start justify-between gap-4 rounded-lg border p-4">
							<div className="flex-1 space-y-1">
								<div className="flex items-center gap-2">
									<Wifi className="h-4 w-4 text-muted-foreground" />
									<span className="font-medium">
										802.1X/Passpoint WiFi SSID
									</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Users connect to{" "}
									<span className="font-medium">
										CorpNet_Secure
									</span>
								</p>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
							>
								<Edit className="h-4 w-4" />
							</Button>
						</div>

						{/* 802.1X Network Credentials */}
						<div className="space-y-3 rounded-lg border p-4">
							<div className="flex items-center justify-between">
								<div className="font-medium">
									802.1X Network Credentials
								</div>
								<Switch
									checked={show802Credentials}
									onCheckedChange={setShow802Credentials}
								/>
							</div>
							<p className="text-sm text-muted-foreground">
								Show 802.1X Network Credentials as backup option
								for devices not supporting Passpoint
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Headless Devices Access */}
				<Card>
					<CardHeader>
						<CardTitle>Headless Devices Access</CardTitle>
						<CardDescription>
							Network to connect headless devices with a Personal
							PSK
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Personal WiFi Password */}
						<Item variant="outline">
							<ItemContent>
								<ItemTitle>Personal WiFi Password</ItemTitle>
								<ItemDescription>
									Enable Personal WiFi Password for headless
									devices
								</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Switch />
							</ItemActions>
						</Item>

						{/* IoT WiFi SSID - Disabled */}
						<Item
							variant="outline"
							className="opacity-50 pointer-events-none"
						>
							<ItemMedia variant="icon">
								<Wifi className="h-4 w-4" />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>IoT WiFi SSID</ItemTitle>
								<ItemDescription>
									Users connect to{" "}
									<span className="font-medium">
										CorpNet_IoT
									</span>
								</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									disabled
								>
									<Edit className="h-4 w-4" />
								</Button>
							</ItemActions>
						</Item>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
