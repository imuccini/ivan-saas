"use client";

import { useOnboardingStatus } from "@saas/onboarding/hooks/use-onboarding-status";
import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpcClient } from "@shared/lib/orpc-client";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
	Eye,
	InfoIcon,
	RotateCw,
	Key,
	Loader2,
	Mail,
	Pencil,
	Play,
	Settings,
	Shield,
	Sparkles,
	ThumbsUp,
	Users,
	Wifi,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeployNetworkDialog } from "./deploy-network-dialog";
import { OnboardingJourneyWizard } from "./onboarding-journey-wizard";
import { WelcomeEmailEditor } from "./WelcomeEmailEditor";

export function GuestWifiPageContent() {
	const [wizardOpen, setWizardOpen] = useState(false);
	const [ssidDialogOpen, setSsidDialogOpen] = useState(false);
	const [welcomeEmailDialogOpen, setWelcomeEmailDialogOpen] = useState(false);
	const [deployDialogOpen, setDeployDialogOpen] = useState(false);
	const [ssidName, setSsidName] = useState("Guest_WiFi_Network");
	const [refreshKey, setRefreshKey] = useState(0);
	const networksConnected: number = 4;
	const legacyNetworks: number = 2;

	const queryClient = useQueryClient();

	const { activeOrganization } = useActiveOrganization();
	const { activeWorkspace } = useActiveWorkspace();
	const { data: onboarding } = useOnboardingStatus(activeWorkspace?.id);

	const basePath =
		activeOrganization && activeWorkspace
			? `/app/${activeOrganization.slug}/${activeWorkspace.slug}`
			: "/app";

	// Fetch GuestWifiConfig to get the ID for portal preview
	const { data: guestWifiConfig } = useQuery({
		...orpc.guestWifi.get.queryOptions({
			input: {
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled: !!activeWorkspace?.id,
	});

	// Fetch Guest WiFi stats
	const { data: stats } = useQuery({
		...orpc.guestWifi.getStats.queryOptions({
			input: {
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled: !!activeWorkspace?.id,
	});

	// Initialize SSID name from config
	useEffect(() => {
		if (guestWifiConfig?.config?.ssidName) {
			setSsidName(guestWifiConfig.config.ssidName);
		}
	}, [guestWifiConfig]);

	const updateNameMutation = useMutation({
		mutationFn: (input: { workspaceId: string; ssidName: string }) =>
			orpcClient.guestWifi.updateName(input),
		onSuccess: (data) => {
			toast.success(
				`Successfully updated SSID name on ${data.updatedCount} networks`,
			);
			if (data.errors && data.errors.length > 0) {
				toast.error(
					`Failed to update SSID name on ${data.errors.length} networks`,
				);
			}
			queryClient.invalidateQueries({
				queryKey: orpc.guestWifi.get.queryOptions({
					input: {
						workspaceId: activeWorkspace?.id || "",
					},
				}).queryKey,
			});
			setSsidDialogOpen(false);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update SSID name");
		},
	});

	const handleUpdateSsidName = () => {
		if (!activeWorkspace?.id) return;
		updateNameMutation.mutate({
			workspaceId: activeWorkspace.id,
			ssidName: ssidName,
		});
	};

	// Determine portal URL
	const portalBaseUrl =
		process.env.NEXT_PUBLIC_PORTAL_URL ||
		(process.env.NODE_ENV === "production"
			? "https://ivan-saas-portal.vercel.app"
			: "http://localhost:3001");

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
							<span>
								Live in {stats?.activeNetworksCount ?? 0}{" "}
								Networks
							</span>
						</Badge>
					</div>
					<Button
						size="sm"
						className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
						onClick={() => setDeployDialogOpen(true)}
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
							{/* Onboarding Alerts */}
							{onboarding && !onboarding.networkSetup && (
								<Alert className="border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400">
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription className="flex items-center justify-between">
										<span>
											Onboarding checklist to be
											completed:{" "}
											<span className="font-bold">
												Create your first network
											</span>
										</span>
										<Button
											size="sm"
											variant="outline"
											asChild
											className="ml-2"
										>
											<Link
												href={`${basePath}/manage/networks?add=true`}
											>
												Setup Network
											</Link>
										</Button>
									</AlertDescription>
								</Alert>
							)}

							{onboarding &&
								onboarding.networkSetup &&
								!onboarding.wifiPersonalized && (
									<Alert className="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">
										<InfoIcon className="h-4 w-4" />
										<AlertDescription className="flex items-center justify-between">
											<span>
												Complete setup by{" "}
												<span className="font-bold">
													personalizing your Guest
													WiFi onboarding
												</span>
											</span>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													setWizardOpen(true)
												}
												className="ml-2"
											>
												Personalize Now
											</Button>
										</AlertDescription>
									</Alert>
								)}

							{/* No Issues Alert - only show if onboarding complete */}
							{(!onboarding || onboarding.isComplete) && (
								<Alert className="bg-background border">
									<ThumbsUp className="h-4 w-4 text-green-500" />
									<AlertDescription>
										<span>
											You have{" "}
											<span className="font-bold">
												no
											</span>{" "}
											blocking issues
										</span>
									</AlertDescription>
								</Alert>
							)}

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
									Your branded WiFi Portal is deployed on{" "}
									{stats?.activeNetworksCount ?? 0} locations,
									with the SSID “
									{guestWifiConfig?.config?.ssidName ||
										"Guest WiFi"}
									”. Users register with First Name and Email
									and need to accept T&C and also a Marketing
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
							className="w-full flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3 transition-colors hover:bg-primary/10 text-left"
						>
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-primary/10 text-primary">
									<Pencil className="h-4 w-4" />
								</div>
								<div>
									<div className="text-sm font-medium leading-none">
										Onboarding Journey
									</div>
									<div className="text-xs text-muted-foreground mt-1">
										Customize authentication, design and
										access control options
									</div>
								</div>
							</div>
							<ChevronRight className="h-4 w-4 text-muted-foreground" />
						</button>
						<ActionRow
							icon={Wifi}
							title={
								<>
									Guest WiFi SSID:{" "}
									<span className="font-bold">
										{ssidName}
									</span>
								</>
							}
							description="Change the guest WiFi SSID name"
							onClick={() => setSsidDialogOpen(true)}
						/>
						<ActionRow
							icon={Mail}
							title="Welcome Email"
							description="Personalize email sent to new users"
							onClick={() => setWelcomeEmailDialogOpen(true)}
						/>
					</div>

					{/* Portal Preview */}
					<div className="relative h-[300px] rounded-lg border bg-muted/30 overflow-hidden">
						{activeOrganization?.id &&
						activeWorkspace?.id &&
						guestWifiConfig?.id ? (
							<>
								<div className="absolute top-2 right-2 z-10 flex gap-2">
									<Button
										size="icon"
										variant="secondary"
										className="h-8 w-8 bg-background/80 hover:bg-background shadow-sm"
										onClick={() => setRefreshKey((prev) => prev + 1)}
										title="Refresh Preview"
									>
										<RotateCw className="h-4 w-4" />
									</Button>
									<Button
										size="icon"
										variant="secondary"
										className="h-8 w-8 bg-background/80 hover:bg-background shadow-sm"
										onClick={() =>
											window.open(
												`${portalBaseUrl}/${activeOrganization.id}/${activeWorkspace.id}/${guestWifiConfig.id}`,
												"_blank",
											)
										}
										title="Open Portal"
									>
										<Eye className="h-4 w-4" />
									</Button>
								</div>
								<div className="absolute inset-0 flex items-center justify-center">
									<iframe
										key={refreshKey}
										src={`${portalBaseUrl}/${activeOrganization.id}/${activeWorkspace.id}/${guestWifiConfig.id}`}
										className="absolute inset-0 w-full h-full origin-top-left pointer-events-none"
										style={{
											transform: "scale(0.335)",
											width: "300%",
											height: "300%",
										}}
										title="Portal Preview"
									/>
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
							</>
						) : (
							<div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
								<p className="text-sm">
									Configure your onboarding journey to see
									preview
								</p>
							</div>
						)}
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
						description="Directory of all guest users registered via Guest WiFi"
						href="guest-wifi/users-devices"
					/>
					<ActionRow
						icon={Key}
						title="Access Codes"
						description="Managed Access Codes for access control and extensions"
						href="guest-wifi/access-codes"
					/>
					<ActionRow
						icon={Shield}
						title="Sponsors"
						description="Manage directory of Sponsors"
						href="guest-wifi/sponsors"
					/>
				</div>
			</div>

			{/* Wizard */}
			<OnboardingJourneyWizard
				open={wizardOpen}
				onClose={() => setWizardOpen(false)}
			/>

			{/* Deploy Dialog */}
			<DeployNetworkDialog
				open={deployDialogOpen}
				onOpenChange={setDeployDialogOpen}
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
										{stats?.activeNetworksCount ?? 0}
									</span>{" "}
									network
									{(stats?.activeNetworksCount ?? 0) !== 1
										? "s"
										: ""}{" "}
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
							onClick={handleUpdateSsidName}
							disabled={updateNameMutation.isPending}
						>
							{updateNameMutation.isPending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
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
	title: React.ReactNode;
	description: React.ReactNode;
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
