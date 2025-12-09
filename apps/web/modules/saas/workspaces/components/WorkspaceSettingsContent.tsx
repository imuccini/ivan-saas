"use client";

import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { useWorkspaceServices } from "@saas/workspaces/components/WorkspaceServicesProvider";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ui/components/card";
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
import { BotIcon, Check, Copy, ShieldCheckIcon, WifiIcon } from "lucide-react";
import { useMemo, useState } from "react";

export function WorkspaceSettingsContent() {
	const { activeWorkspace } = useActiveWorkspace();
	const { activeOrganization } = useActiveOrganization();
	const { services, toggleService } = useWorkspaceServices();

	// Fetch the GuestWifiConfig to get its ID
	const { data: guestWifiConfig } = useQuery(
		orpc.guestWifi.get.queryOptions({
			input: {
				workspaceId: activeWorkspace?.id ?? "",
			},
		}),
	);

	// Data Retention
	const [dataRetentionDays, setDataRetentionDays] = useState("90");

	// RADIUS Configuration (mock data)
	const radiusConfig = {
		primaryIp: "radius1.example.com",
		secondaryIp: "radius2.example.com",
		authPort: "1812",
		acctPort: "1813",
		secret: "SuperSecretRADIUSKey123!",
	};

	// Hotspot 2.0
	const [operatorName, setOperatorName] = useState("Acme Corporation");
	const [friendlyName, setFriendlyName] = useState("Acme Guest WiFi");
	const [rcois, setRcois] = useState("5A03BA0000,5A03BA0001");

	// Portal URLs
	const [multipleExperiences, setMultipleExperiences] = useState(false);

	// Generate proper captive portal URL
	const captivePortalUrl = useMemo(() => {
		if (!activeOrganization?.id || !activeWorkspace?.id) {
			return "";
		}
		// Portal app runs on a separate domain/port
		// Format: {portal-url}/{org-id}/{workspace-id}/{instance-id}
		// Using IDs ensures URLs remain stable even if names/slugs change
		const portalBaseUrl =
			process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001";

		// Use the actual GuestWifiConfig ID if available
		const instanceId = guestWifiConfig?.id || "[instance-id]";

		return `${portalBaseUrl}/${activeOrganization.id}/${activeWorkspace.id}/${instanceId}`;
	}, [activeOrganization?.id, activeWorkspace?.id, guestWifiConfig?.id]);

	const [portalUrls, setPortalUrls] = useState([
		{
			id: "1",
			name: "Default Experience",
			url: captivePortalUrl,
		},
	]);

	// Update portal URL when it changes
	useMemo(() => {
		if (
			captivePortalUrl &&
			portalUrls.length > 0 &&
			portalUrls[0].url !== captivePortalUrl
		) {
			setPortalUrls([
				{ ...portalUrls[0], url: captivePortalUrl },
				...portalUrls.slice(1),
			]);
		}
	}, [captivePortalUrl, portalUrls]);

	const [copiedField, setCopiedField] = useState<string | null>(null);

	const copyToClipboard = (text: string, field: string) => {
		navigator.clipboard.writeText(text);
		setCopiedField(field);
		setTimeout(() => setCopiedField(null), 2000);
	};

	const addPortalUrl = () => {
		const newId = (portalUrls.length + 1).toString();
		setPortalUrls([
			...portalUrls,
			{ id: newId, name: `Experience ${newId}`, url: "" },
		]);
	};

	const removePortalUrl = (id: string) => {
		setPortalUrls(portalUrls.filter((url) => url.id !== id));
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">
					Workspace Settings
					{activeWorkspace?.name && (
						<span className="ml-2 text-muted-foreground font-normal text-xl">
							- {activeWorkspace.name}
						</span>
					)}
				</h1>
				<p className="text-muted-foreground mt-2">
					Configure workspace-level settings and services
				</p>
			</div>

			{/* Data Retention */}
			<Card>
				<CardHeader>
					<CardTitle>Data Retention</CardTitle>
					<CardDescription>
						Set the default retention period for personal data
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Label htmlFor="retention">Retention Period</Label>
						<Select
							value={dataRetentionDays}
							onValueChange={setDataRetentionDays}
						>
							<SelectTrigger id="retention" className="w-64">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="30">30 days</SelectItem>
								<SelectItem value="60">60 days</SelectItem>
								<SelectItem value="90">90 days</SelectItem>
								<SelectItem value="180">180 days</SelectItem>
								<SelectItem value="365">1 year</SelectItem>
								<SelectItem value="730">2 years</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-sm text-muted-foreground">
							Personal data will be automatically deleted after
							this period
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Services */}
			<Card>
				<CardHeader>
					<CardTitle>Services</CardTitle>
					<CardDescription>
						Enable or disable features for this workspace
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						{/* Guest WiFi */}
						<div className="rounded-lg border p-4 space-y-3">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
									<WifiIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
								<div className="flex-1">
									<h3 className="font-semibold">
										Guest WiFi
									</h3>
									<p className="text-xs text-muted-foreground">
										Public WiFi for visitors
									</p>
								</div>
							</div>
							<Switch
								checked={services.guestWifi}
								onCheckedChange={(checked) =>
									toggleService("guestWifi", checked)
								}
							/>
						</div>

						{/* BYOD */}
						<div className="rounded-lg border p-4 space-y-3">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
									<ShieldCheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
								</div>
								<div className="flex-1">
									<h3 className="font-semibold">BYOD</h3>
									<p className="text-xs text-muted-foreground">
										Employee device management
									</p>
								</div>
							</div>
							<Switch
								checked={services.byod}
								onCheckedChange={(checked) =>
									toggleService("byod", checked)
								}
							/>
						</div>

						{/* IoT */}
						<div className="rounded-lg border p-4 space-y-3">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
									<BotIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
								</div>
								<div className="flex-1">
									<h3 className="font-semibold">
										IoT Devices
									</h3>
									<p className="text-xs text-muted-foreground">
										Smart device network
									</p>
								</div>
							</div>
							<Switch
								checked={services.iot}
								onCheckedChange={(checked) =>
									toggleService("iot", checked)
								}
							/>
						</div>
					</div>
					<p className="text-sm text-muted-foreground mt-4">
						Disabled services will be hidden from the sidebar
						navigation
					</p>
				</CardContent>
			</Card>

			{/* RADIUS Configuration */}
			<Card>
				<CardHeader>
					<CardTitle>RADIUS Configuration</CardTitle>
					<CardDescription>
						Use these settings for manual network configuration
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						{/* Primary Server */}
						<div className="space-y-2">
							<Label>Primary RADIUS Server</Label>
							<div className="flex gap-2">
								<Input
									value={radiusConfig.primaryIp}
									readOnly
								/>
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										copyToClipboard(
											radiusConfig.primaryIp,
											"primaryIp",
										)
									}
								>
									{copiedField === "primaryIp" ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>

						{/* Secondary Server */}
						<div className="space-y-2">
							<Label>Secondary RADIUS Server</Label>
							<div className="flex gap-2">
								<Input
									value={radiusConfig.secondaryIp}
									readOnly
								/>
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										copyToClipboard(
											radiusConfig.secondaryIp,
											"secondaryIp",
										)
									}
								>
									{copiedField === "secondaryIp" ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>

						{/* Auth Port */}
						<div className="space-y-2">
							<Label>Authorization Port</Label>
							<div className="flex gap-2">
								<Input value={radiusConfig.authPort} readOnly />
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										copyToClipboard(
											radiusConfig.authPort,
											"authPort",
										)
									}
								>
									{copiedField === "authPort" ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>

						{/* Accounting Port */}
						<div className="space-y-2">
							<Label>Accounting Port</Label>
							<div className="flex gap-2">
								<Input value={radiusConfig.acctPort} readOnly />
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										copyToClipboard(
											radiusConfig.acctPort,
											"acctPort",
										)
									}
								>
									{copiedField === "acctPort" ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
					</div>

					{/* RADIUS Secret */}
					<div className="space-y-2">
						<Label>RADIUS Secret</Label>
						<div className="flex gap-2">
							<Input
								type="password"
								value={radiusConfig.secret}
								readOnly
							/>
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									copyToClipboard(
										radiusConfig.secret,
										"secret",
									)
								}
							>
								{copiedField === "secret" ? (
									<Check className="h-4 w-4" />
								) : (
									<Copy className="h-4 w-4" />
								)}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Hotspot 2.0 Settings */}
			<Card>
				<CardHeader>
					<CardTitle>Hotspot 2.0 Settings</CardTitle>
					<CardDescription>
						Configure Passpoint/Hotspot 2.0 parameters
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="operator-name">Operator Name</Label>
						<Input
							id="operator-name"
							value={operatorName}
							onChange={(e) => setOperatorName(e.target.value)}
							placeholder="Enter operator name"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="friendly-name">Friendly Name</Label>
						<Input
							id="friendly-name"
							value={friendlyName}
							onChange={(e) => setFriendlyName(e.target.value)}
							placeholder="Enter friendly network name"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="rcois">
							RCOIs (Roaming Consortium OIs)
						</Label>
						<Input
							id="rcois"
							value={rcois}
							onChange={(e) => setRcois(e.target.value)}
							placeholder="Comma-separated OIs (e.g., 5A03BA0000,5A03BA0001)"
						/>
						<p className="text-xs text-muted-foreground">
							Enter roaming consortium organization identifiers
							separated by commas
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Guest WiFi Portal URL */}
			<Card>
				<CardHeader>
					<CardTitle>Guest WiFi Portal URL</CardTitle>
					<CardDescription>
						Manage captive portal onboarding experiences
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Toggle Multiple Experiences */}
					<div className="flex items-center justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<Label
								htmlFor="multiple-experiences"
								className="text-base"
							>
								Multiple Onboarding Experiences
							</Label>
							<p className="text-sm text-muted-foreground">
								Create different portal experiences for
								different use cases
							</p>
						</div>
						<Switch
							id="multiple-experiences"
							checked={multipleExperiences}
							onCheckedChange={setMultipleExperiences}
							disabled={true}
						/>
					</div>

					{/* Portal URLs List */}
					<div className="space-y-3">
						{portalUrls.map((portal, index) => (
							<div
								key={portal.id}
								className="rounded-lg border p-4 space-y-3"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Badge
											variant={
												index === 0
													? "default"
													: "secondary"
											}
										>
											{index === 0
												? "Default"
												: `Experience ${index + 1}`}
										</Badge>
										{multipleExperiences && index > 0 && (
											<Input
												value={portal.name}
												onChange={(e) => {
													const updated = [
														...portalUrls,
													];
													updated[index].name =
														e.target.value;
													setPortalUrls(updated);
												}}
												className="w-48"
												placeholder="Experience name"
											/>
										)}
									</div>
									{multipleExperiences && index > 0 && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												removePortalUrl(portal.id)
											}
										>
											Remove
										</Button>
									)}
								</div>

								<div className="space-y-2">
									<Label>Splash Page URL</Label>
									<div className="flex gap-2">
										<Input
											value={portal.url}
											onChange={(e) => {
												const updated = [...portalUrls];
												updated[index].url =
													e.target.value;
												setPortalUrls(updated);
											}}
											placeholder="https://portal.example.com/guest"
											readOnly={
												!multipleExperiences &&
												index === 0
											}
										/>
										<Button
											variant="outline"
											size="icon"
											onClick={() =>
												copyToClipboard(
													portal.url,
													`portal-${portal.id}`,
												)
											}
										>
											{copiedField ===
											`portal-${portal.id}` ? (
												<Check className="h-4 w-4" />
											) : (
												<Copy className="h-4 w-4" />
											)}
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>

					{multipleExperiences && (
						<Button
							variant="outline"
							onClick={addPortalUrl}
							className="w-full"
						>
							+ Add New Experience
						</Button>
					)}
				</CardContent>
			</Card>

			{/* Save Button */}
			<div className="flex justify-end">
				<Button size="lg">Save Changes</Button>
			</div>
		</div>
	);
}
