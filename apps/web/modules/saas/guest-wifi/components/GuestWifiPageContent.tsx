"use client";

import { Alert, AlertDescription } from "@ui/components/alert";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
	AlertTriangle,
	CheckCircle2,
	ChevronRight,
	InfoIcon,
	Key,
	Mail,
	Play,
	Settings,
	Shield,
	Sparkles,
	ThumbsUp,
	Users,
	Wifi,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { OnboardingJourneyWizard } from "./onboarding-journey-wizard";
import { WelcomeEmailEditor } from "./WelcomeEmailEditor";

export function GuestWifiPageContent() {
	const [wizardOpen, setWizardOpen] = useState(false);
	const [ssidDialogOpen, setSsidDialogOpen] = useState(false);
	const [welcomeEmailDialogOpen, setWelcomeEmailDialogOpen] = useState(false);
	const [ssidName, setSsidName] = useState("Guest_WiFi_Network");
	const networksConnected: number = 4;
	const legacyNetworks: number = 2;

	return (
		<div className="space-y-6">
			{/* Status Card */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div className="flex items-center gap-3">
						<CardTitle className="text-xl font-bold">
							Service Status
						</CardTitle>
						<Badge
							status="info"
							className="flex items-center gap-1"
						>
							<CheckCircle2 className="h-3 w-3" />
							<span>Live in 4 Networks</span>
						</Badge>
					</div>
					<Button
						size="sm"
						className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
					>
						Deploy to Network <Play className="h-3 w-3" />
					</Button>
				</CardHeader>
				<CardContent className="pt-6 space-y-6">
					{/* Health Score + Alerts Row */}
					<div className="flex flex-col gap-8 md:flex-row md:items-center">
						{/* Health Score */}
						<div className="relative flex h-24 w-24 flex-none items-center justify-center rounded-full border-4 border-muted border-t-green-500">
							<div className="flex flex-col items-center">
								<span className="text-2xl font-bold">98</span>
								<span className="text-xs text-muted-foreground">
									Health
								</span>
							</div>
						</div>

						{/* Alerts */}
						<div className="flex-1 space-y-3">
							{/* No Issues Alert */}
							<Alert className="bg-background border">
								<ThumbsUp className="h-4 w-4 text-green-500" />
								<AlertDescription>
									<span>
										You have{" "}
										<span className="font-bold">no</span>{" "}
										blocking issues
									</span>
								</AlertDescription>
							</Alert>

							{/* Warning Alert */}
							<Link href="#" className="block">
								<Alert className="border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400 hover:bg-yellow-500/20 transition-colors cursor-pointer">
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription className="flex items-center justify-between">
										<span>
											High latency detected on AP-North-01
										</span>
										<ChevronRight className="h-4 w-4 opacity-50 ml-2" />
									</AlertDescription>
								</Alert>
							</Link>
						</div>
					</div>

					{/* Insights Row - 2 Columns */}
					<div className="grid gap-4 md:grid-cols-2">
						{/* Performance Insight */}
						<div className="flex gap-3 rounded-lg border p-3">
							<div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
								<Zap className="h-4 w-4" />
							</div>
							<div>
								<div className="text-sm font-medium">
									Performance
								</div>
								<p className="text-sm text-muted-foreground">
									You have a total of 4341 total Users in the
									account, 621 connected during the last 28
									days. 62% of user consent to your marketing
									terms.
								</p>
							</div>
						</div>

						{/* Configuration Insight */}
						<div className="flex gap-3 rounded-lg border p-3">
							<div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
								<Settings className="h-4 w-4" />
							</div>
							<div>
								<div className="text-sm font-medium">
									Configuration
								</div>
								<p className="text-sm text-muted-foreground">
									Your branded WiFi Portal is deployed on 4
									locations, with the SSID “Free Guest WiFi”.
									Users register with First Name and Email and
									need to accept T&C and also a Marketing
									Opt-in. Passpoint onboarding is enabled.
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Onboarding Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-bold">Onboarding</h2>
					<Button
						size="sm"
						className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 border-0"
					>
						<Sparkles className="h-3.5 w-3.5" />
						AI Assisted Setup
					</Button>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					{/* Quick Actions */}
					<div className="space-y-2">
						<button
							type="button"
							onClick={() => setWizardOpen(true)}
							className="w-full flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 text-left"
						>
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-muted text-muted-foreground">
									<Settings className="h-4 w-4" />
								</div>
								<div>
									<div className="text-sm font-medium leading-none">
										Onboarding Journey
									</div>
									<div className="text-xs text-muted-foreground mt-1">
										Branding, Terms, Languages
									</div>
								</div>
							</div>
							<ChevronRight className="h-4 w-4 text-muted-foreground" />
						</button>
						<ActionRow
							icon={Wifi}
							title="Guest WiFi SSID"
							description="Security, Bandwidth limits"
							onClick={() => setSsidDialogOpen(true)}
						/>
						<ActionRow
							icon={Mail}
							title="Welcome Email"
							description="Template, Delivery settings"
							onClick={() => setWelcomeEmailDialogOpen(true)}
						/>
					</div>

					{/* Portal Preview */}
					<div className="relative h-[300px] rounded-lg border bg-muted/30 overflow-hidden">
						<Image
							src="/images/guest-wifi-onboarding.png"
							alt="Onboarding Preview"
							fill
							className="object-cover"
						/>
					</div>
				</div>
			</div>

			{/* Resources Section */}
			<div className="space-y-3">
				<h3 className="text-lg font-semibold">Related Resources</h3>
				<div className="space-y-2">
					<ActionRow
						icon={Users}
						title="Users"
						description="Manage guest user accounts and sessions."
						href="#"
					/>
					<ActionRow
						icon={Key}
						title="Access Codes"
						description="Generate and manage access codes."
						href="#"
					/>
					<ActionRow
						icon={Shield}
						title="Sponsors"
						description="Manage sponsor approvals and settings."
						href="#"
					/>
				</div>
			</div>

			{/* Wizard */}
			<OnboardingJourneyWizard
				open={wizardOpen}
				onClose={() => setWizardOpen(false)}
			/>

			{/* SSID Edit Dialog */}
			<Dialog open={ssidDialogOpen} onOpenChange={setSsidDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Guest WiFi SSID</DialogTitle>
						<DialogDescription>
							Configure the network name for your guest WiFi
							service
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="ssid-name">
								Network Name (SSID)
							</Label>
							<Input
								id="ssid-name"
								value={ssidName}
								onChange={(e) => setSsidName(e.target.value)}
								placeholder="Enter WiFi network name"
							/>
						</div>

						<Alert>
							<InfoIcon className="h-4 w-4" />
							<AlertDescription>
								<p className="text-sm">
									The name will be applied to{" "}
									<span className="font-semibold">
										{networksConnected}
									</span>{" "}
									network{networksConnected !== 1 ? "s" : ""}{" "}
									connected to the Workspace.{" "}
									{legacyNetworks > 0 && (
										<>
											<span className="font-semibold">
												{legacyNetworks}
											</span>{" "}
											network
											{legacyNetworks !== 1 ? "s" : ""}{" "}
											use legacy deployment and must be
											updated manually.
										</>
									)}
								</p>
							</AlertDescription>
						</Alert>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setSsidDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								// Handle update logic here
								setSsidDialogOpen(false);
							}}
						>
							Update
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Welcome Email Editor */}
			<WelcomeEmailEditor
				open={welcomeEmailDialogOpen}
				onClose={() => setWelcomeEmailDialogOpen(false)}
			/>
		</div>
	);
}

function ActionRow({
	icon: Icon,
	title,
	description,
	href,
	onClick,
}: {
	icon: any;
	title: string;
	description: string;
	href?: string;
	onClick?: () => void;
}) {
	const content = (
		<>
			<div className="flex items-center gap-3">
				<div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-muted text-muted-foreground">
					<Icon className="h-4 w-4" />
				</div>
				<div>
					<div className="text-sm font-medium leading-none">
						{title}
					</div>
					<div className="text-xs text-muted-foreground mt-1">
						{description}
					</div>
				</div>
			</div>
			<ChevronRight className="h-4 w-4 text-muted-foreground" />
		</>
	);

	if (onClick) {
		return (
			<button
				type="button"
				onClick={onClick}
				className="w-full flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 text-left"
			>
				{content}
			</button>
		);
	}

	return (
		<Link
			href={href || "#"}
			className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
		>
			{content}
		</Link>
	);
}
