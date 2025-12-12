"use client";

import { IntegrationAuthDialog } from "@saas/networks/components/integration-auth-dialog";
import { NETWORK_VENDORS } from "@saas/networks/lib/vendors";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { NetworkAnimation } from "@saas/networks/lib/network-animation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Input } from "@ui/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import {
	Link2Icon,
	Settings2Icon,
	ActivityIcon,
	MegaphoneIcon,
	BarChart3Icon,
	CheckCircle2Icon,
	MoreVerticalIcon,
	Pencil,
	PlusIcon,
	SearchIcon,
	ShieldIcon,
	Trash2,
	WifiIcon,
	ZapIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock data for identity providers
const MOCK_IDENTITY_PROVIDERS = [
	{
		id: "1",
		name: "Microsoft Entra ID",
		category: "identity-providers",
		logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
		status: "synced",
		domain: "@corpornation.com",
		users: 541,
		groups: 5,
	},
];

const CATEGORIES = [
	{ id: "networks", label: "Network Integrations", icon: WifiIcon },
	{ id: "identity-providers", label: "Identity Providers", icon: ShieldIcon },
	{ id: "marketing", label: "Marketing", icon: ZapIcon },
];

interface IntegrationCardProps {
	integration: {
		id: string;
		name: string;
		category?: string;
		logo?: string;
		status?: string;
		domain?: string;
		users?: number;
		groups?: number;
		provider?: string;
		createdAt?: Date;
		networkCount?: number;
		accessPointCount?: number;
	};
	onEdit?: (integration: IntegrationCardProps["integration"]) => void;
	onDelete?: (integrationId: string) => void;
}

function IntegrationCard({
	integration,
	onEdit,
	onDelete,
}: IntegrationCardProps) {
	const isNetworkIntegration = integration.provider !== undefined;
	const vendor = integration.provider
		? NETWORK_VENDORS[integration.provider as keyof typeof NETWORK_VENDORS]
		: null;

	return (
		<div className="group relative rounded-lg border bg-card p-6 transition-shadow hover:shadow-md">
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-4">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 p-2">
						{isNetworkIntegration && vendor?.logo ? (
							<img
								src={vendor.logo}
								alt={vendor.name}
								className="h-full w-full object-contain"
							/>
						) : integration.logo ? (
							<img
								src={integration.logo}
								alt={integration.name}
								className="size-8 object-contain"
							/>
						) : (
							<WifiIcon className="size-6" />
						)}
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold">
								{integration.name}
							</h3>
							{(integration.status === "synced" ||
								isNetworkIntegration) && (
								<span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
									<CheckCircle2Icon className="size-3" />
									Synced
								</span>
							)}
						</div>
						{integration.domain && (
							<p className="mt-1 text-sm text-muted-foreground">
								{integration.domain}
							</p>
						)}
						{isNetworkIntegration && vendor && (
							<p className="mt-1 text-sm text-muted-foreground">
								{vendor.name}
							</p>
						)}
						{integration.createdAt && (
							<p className="mt-1 text-xs text-muted-foreground">
								Added{" "}
								{new Date(
									integration.createdAt,
								).toLocaleDateString()}
							</p>
						)}
					</div>
				</div>
				{isNetworkIntegration && onEdit && onDelete ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="opacity-0 transition-opacity group-hover:opacity-100"
							>
								<MoreVerticalIcon className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => onEdit(integration)}
							>
								<Pencil className="mr-2 size-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onDelete(integration.id)}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="mr-2 size-4" />
								Remove
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Button
						variant="ghost"
						size="icon"
						className="opacity-0 transition-opacity group-hover:opacity-100"
					>
						<MoreVerticalIcon className="size-4" />
					</Button>
				)}
			</div>

			{/* KPIs Section */}
			{isNetworkIntegration ? (
				<div className="mt-4 flex items-center gap-4 border-t pt-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Networks</title>
							<rect width="16" height="16" x="4" y="4" rx="2" />
							<rect width="6" height="6" x="9" y="9" rx="1" />
							<path d="M15 2v2" />
							<path d="M15 20v2" />
							<path d="M2 15h2" />
							<path d="M2 9h2" />
							<path d="M20 15h2" />
							<path d="M20 9h2" />
							<path d="M9 2v2" />
							<path d="M9 20v2" />
						</svg>
						<span>
							{(integration as any).networkCount || 0} Networks
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Access Points</title>
							<path d="M5 13a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" />
							<path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
							<path d="M9 13v6" />
							<path d="M15 13v6" />
						</svg>
						<span>
							{(integration as any).accessPointCount || 0} Access
							Points
						</span>
					</div>
				</div>
			) : integration.users || integration.groups ? (
				<div className="mt-4 flex items-center gap-4 border-t pt-4 text-sm text-muted-foreground">
					{integration.users && (
						<div className="flex items-center gap-1.5">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Users</title>
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
							<span>{integration.users} Users</span>
						</div>
					)}
					{integration.groups && (
						<div className="flex items-center gap-1.5">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Groups</title>
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
							<span>{integration.groups} groups</span>
						</div>
					)}
				</div>
			) : null}
		</div>
	);
}

export function IntegrationsPageContent() {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("networks");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingIntegration, setEditingIntegration] = useState<{
		id: string;
		name: string;
		provider: string;
	} | null>(null);
	const { activeWorkspace } = useActiveWorkspace();
	const queryClient = useQueryClient();

	// Fetch network integrations
	const { data: networkIntegrations, isLoading: isLoadingNetworks } =
		useQuery({
			...orpc.integrations.list.queryOptions({
				input: {
					workspaceId: activeWorkspace?.id || "",
				},
			}),
			enabled: !!activeWorkspace?.id && activeCategory === "networks",
		});

	// Delete mutation
	const deleteMutation = useMutation(
		orpc.integrations.delete.mutationOptions({
			onSuccess: () => {
				toast.success(
					"Integration and all linked networks deleted successfully",
				);
				queryClient.invalidateQueries({
					queryKey: orpc.integrations.list.queryKey({
						input: {
							workspaceId: activeWorkspace?.id || "",
						},
					}),
				});
			},
			onError: () => {
				toast.error("Failed to delete integration");
			},
		}),
	);

	// Combine all integrations based on category
	const allIntegrations =
		activeCategory === "networks"
			? (networkIntegrations || []).map((ni) => ({
					...ni,
					category: "networks",
				}))
			: activeCategory === "identity-providers"
				? MOCK_IDENTITY_PROVIDERS
				: [];

	const filteredIntegrations = allIntegrations.filter((integration) => {
		const matchesSearch = integration.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesCategory = integration.category === activeCategory;
		return matchesSearch && matchesCategory;
	});

	const getCategoryLabel = (categoryId: string) => {
		return CATEGORIES.find((c) => c.id === categoryId)?.label || categoryId;
	};

	const handleIntegrationCreated = () => {
		setIsDialogOpen(false);
		setEditingIntegration(null);
		queryClient.invalidateQueries({
			queryKey: orpc.integrations.list.queryKey({
				input: {
					workspaceId: activeWorkspace?.id || "",
				},
			}),
		});
	};

	const handleEdit = (integration: IntegrationCardProps["integration"]) => {
		if (integration.provider) {
			setEditingIntegration({
				id: integration.id,
				name: integration.name,
				provider: integration.provider,
			});
			setIsDialogOpen(true);
		}
	};

	const handleDelete = (integrationId: string) => {
		if (!activeWorkspace?.id) return;

		const confirmed = window.confirm(
			"Are you sure you want to remove this integration?\n\n" +
				"⚠️ All networks linked to this integration will also be removed.\n\n" +
				"Existing configurations will remain in the network vendor's system (e.g., Meraki).",
		);

		if (confirmed) {
			deleteMutation.mutate({
				id: integrationId,
				workspaceId: activeWorkspace.id,
			});
		}
	};

	const handleAddNew = () => {
		setEditingIntegration(null);
		setIsDialogOpen(true);
	};

	return (
		<div className="space-y-6">
			<Tabs value={activeCategory} onValueChange={setActiveCategory}>
				<div className="flex items-center justify-between">
					<TabsList>
						{CATEGORIES.map((category) => (
							<TabsTrigger key={category.id} value={category.id}>
								{category.label}
							</TabsTrigger>
						))}
					</TabsList>

					<div className="relative w-64">
						<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
				</div>

				{CATEGORIES.map((category) => (
					<TabsContent
						key={category.id}
						value={category.id}
						className="mt-6"
					>
						<div className="space-y-6">
							{/* Category Section */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<h2 className="text-2xl font-semibold">
											{getCategoryLabel(category.id)}
										</h2>
										<p className="mt-1 text-sm text-muted-foreground">
											{category.id ===
												"identity-providers" &&
												"Manage identity providers for employee authentication"}
											{category.id === "networks" &&
												"Configure network integrations and connectivity"}
											{category.id === "marketing" &&
												"Connect marketing tools and analytics platforms"}
											{category.id === "all" &&
												"View all active integrations across categories"}
										</p>
									</div>
									{category.id === "networks" && (
										<Button onClick={handleAddNew}>
											<PlusIcon className="mr-2 size-4" />
											Add Integration
										</Button>
									)}
									{category.id !== "networks" && (
										<Button>
											<PlusIcon className="mr-2 size-4" />
											Add{" "}
											{getCategoryLabel(
												category.id,
											).slice(0, -1)}
										</Button>
									)}
								</div>

								{/* Integrations Grid */}
								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
									{isLoadingNetworks &&
									category.id === "networks" ? (
										<div className="col-span-full py-12 text-center text-muted-foreground">
											Loading...
										</div>
									) : filteredIntegrations.length > 0 ? (
										filteredIntegrations.map(
											(integration) => (
												<IntegrationCard
													key={integration.id}
													integration={integration}
													onEdit={
														category.id ===
														"networks"
															? handleEdit
															: undefined
													}
													onDelete={
														category.id ===
														"networks"
															? handleDelete
															: undefined
													}
												/>
											),
										)
									) : (
										<div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
											{category.id === "networks" &&
											!searchQuery ? (
												<div className="mb-6 w-full">
													<NetworkAnimation />
												</div>
											) : (
												<div className="flex size-12 items-center justify-center rounded-full bg-muted">
													{category.icon ? (
														<category.icon className="size-6 text-muted-foreground" />
													) : (
														<WifiIcon className="size-6 text-muted-foreground" />
													)}
												</div>
											)}
											<h3 className="mt-4 text-lg font-semibold">
												{searchQuery
													? "No matching integrations"
													: `No ${category.label.toLowerCase()} yet`}
											</h3>
											<p className="mb-6 mt-2 text-sm text-muted-foreground max-w-sm">
												{searchQuery
													? `No results found for "${searchQuery}". Try a different search term.`
													: category.id === "networks"
														? "Connect your network infrastructure to start managing Guest WiFi, IoT, and Employee access."
														: category.id ===
															  "identity-providers"
															? "Connect an identity provider to sync users and groups for authentication."
															: "Connect marketing tools to sync contacts and analytics."}
											</p>
											{!searchQuery && (
												<Button
													onClick={
														category.id ===
														"networks"
															? handleAddNew
															: undefined
													}
													disabled={
														category.id !==
														"networks"
													}
												>
													<PlusIcon className="mr-2 size-4" />
													Add {getCategoryLabel(
														category.id,
													).slice(0, -1)}
												</Button>
											)}
										</div>
									)}
								</div>
							</div>

							{/* Information Section */}
							{/* Identity Providers Info */}
							{category.id === "identity-providers" && (
								<div className="space-y-4 rounded-lg border bg-muted/50 p-6">
									<h3 className="text-lg font-semibold">
										Identity Provider Configuration
									</h3>
									<p className="text-sm text-muted-foreground">
										Identity providers authenticate
										employees and sync user directories for
										access control
									</p>

									<div className="grid gap-6 md:grid-cols-3">
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<ShieldIcon className="size-5" />
												<h4 className="font-medium">
													Authentication
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												Employees sign in using their
												corporate credentials from
												connected identity providers
											</p>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<title>
														Directory Sync
													</title>
													<path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
													<path d="M22 12A10 10 0 0 0 12 2v10z" />
												</svg>
												<h4 className="font-medium">
													Directory Sync
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												User and group information is
												automatically synchronized from
												your identity provider
											</p>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<title>
														Access Control
													</title>
													<rect
														width="18"
														height="11"
														x="3"
														y="11"
														rx="2"
														ry="2"
													/>
													<path d="M7 11V7a5 5 0 0 1 10 0v4" />
												</svg>
												<h4 className="font-medium">
													Access Control
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												Use synced groups to create
												access rules and manage network
												permissions
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Network Integrations Info */}
							{category.id === "networks" && (
								<div className="space-y-4 rounded-lg border bg-muted/50 p-6">
									<h3 className="text-lg font-semibold">
										Network Integration
									</h3>
									<p className="text-sm text-muted-foreground">
										Network integrations are required to connect via API to the configuration of the Networks where to deploy the service.
									</p>

									<div className="grid gap-6 md:grid-cols-3">
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<Link2Icon className="size-5" />
												<h4 className="font-medium">
													API Connectivity
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												Direct API connection to your network controllers for seamless communication.
											</p>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<Settings2Icon className="size-5" />
												<h4 className="font-medium">
													Proactive Configuration
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												Automatically deploy SSIDs and security settings to your network infrastructure.
											</p>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<ActivityIcon className="size-5" />
												<h4 className="font-medium">
													Monitoring
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												Monitor the health, status, and client connections of your deployed networks.
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Marketing Info */}
							{category.id === "marketing" && (
								<div className="space-y-4 rounded-lg border bg-muted/50 p-6">
									<h3 className="text-lg font-semibold">
										Marketing Integrations
									</h3>
									<p className="text-sm text-muted-foreground">
										Connect your guest WiFi data with marketing tools to engage with your visitors.
									</p>

									<div className="grid gap-6 md:grid-cols-3">
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<MegaphoneIcon className="size-5" />
												<h4 className="font-medium">
													Campaigns
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												Sync visitor contacts to your email marketing platforms for targeted campaigns.
											</p>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<BarChart3Icon className="size-5" />
												<h4 className="font-medium">
													Analytics
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												Export visitor data to analytics platforms for deeper insights and reporting.
											</p>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<ZapIcon className="size-5" />
												<h4 className="font-medium">
													Automation
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												Trigger automated workflows based on visitor behavior and connections.
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</TabsContent>
				))}
			</Tabs>

			{/* Network Integration Dialog */}
			<IntegrationAuthDialog
				open={isDialogOpen}
				onOpenChange={(open) => {
					setIsDialogOpen(open);
					if (!open) {
						setEditingIntegration(null);
					}
				}}
				onSuccess={handleIntegrationCreated}
				editingIntegration={editingIntegration}
			/>
		</div>
	);
}
