"use client";

import { NETWORK_VENDORS } from "@saas/networks/lib/vendors";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpcClient } from "@shared/lib/orpc-client";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import {
	CheckCircle2Icon,
	Loader2,
	MoreVerticalIcon,
	Pencil,
	PlusIcon,
	RadioTowerIcon,
	Trash2,
	WifiIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddNetworkWizard } from "./add-network-wizard";
import { EditNetworkDialog } from "./edit-network-dialog";

interface NetworkCardProps {
	// biome-ignore lint/suspicious/noExplicitAny: Network type varies
	network: any;
	onEdit: (network: any) => void;
	onDelete: (id: string) => void;
}

function NetworkCard({ network, onEdit, onDelete }: NetworkCardProps) {
	const { activeWorkspace } = useActiveWorkspace();
	const queryClient = useQueryClient();
	const isActive = network.provisioningStatus === "active";
	const isPending =
		network.provisioningStatus === "pending" ||
		network.provisioningStatus === "provisioning";
	const isFailed = network.provisioningStatus === "failed";

	// Extract network info from config
	const networkConfig = network.config || {};
	const productTypes = networkConfig.productTypes || [];
	const hasWireless = productTypes.includes("wireless");
	const ssidMapping = networkConfig.ssidMapping;
	const lastSyncedAt = networkConfig.lastSyncedAt;

	// Get vendor info
	const vendorId = network.integration.provider.toLowerCase();
	const vendor = NETWORK_VENDORS[vendorId as keyof typeof NETWORK_VENDORS];

	// Sync mutation
	const syncMutation = useMutation({
		mutationFn: (input: { id: string; workspaceId: string }) =>
			orpcClient.networks.sync(input),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: orpc.networks.list.queryOptions({
					input: {
						workspaceId: activeWorkspace?.id || "",
					},
				}).queryKey,
			});
		},
	});

	// Check sync status on load
	useEffect(() => {
		if (!activeWorkspace?.id) return;

		const checkSync = () => {
			if (!lastSyncedAt) {
				// Never synced, trigger sync
				syncMutation.mutate({
					id: network.id,
					workspaceId: activeWorkspace.id,
				});
				return;
			}

			const lastSyncTime = new Date(lastSyncedAt).getTime();
			const now = new Date().getTime();
			const minutesSinceSync = (now - lastSyncTime) / (1000 * 60);

			if (minutesSinceSync > 15) {
				// Stale, trigger sync
				syncMutation.mutate({
					id: network.id,
					workspaceId: activeWorkspace.id,
				});
			}
		};

		checkSync();
	}, [network.id, activeWorkspace?.id, lastSyncedAt]);

	// Service configuration
	const services = [
		{
			id: "guestWifi",
			label: "Guest WiFi",
			mapping: ssidMapping?.guestWifi,
		},
		{
			id: "iot",
			label: "IoT",
			mapping: ssidMapping?.iot,
		},
		{
			id: "employees",
			label: "Employees",
			mapping: ssidMapping?.employees,
		},
	];

	const isSyncing = syncMutation.isPending;

	return (
		<div className="group relative flex flex-col justify-between rounded-lg border bg-card p-6 transition-shadow hover:shadow-md">
			<div>
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-4">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 p-2">
							{vendor?.logo ? (
								<img
									src={vendor.logo}
									alt={vendor.name}
									className="h-full w-full object-contain"
								/>
							) : (
								<RadioTowerIcon className="size-6 text-primary" />
							)}
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h3 className="font-semibold">
									{network.name}
								</h3>
								<Badge
									variant="secondary"
									className="bg-muted text-muted-foreground border-0"
								>
									{isSyncing ? (
										<>
											<Loader2 className="mr-1 size-3 animate-spin" />
											Syncing...
										</>
									) : (
										<>
											<CheckCircle2Icon className="mr-1 size-3" />
											Synced
										</>
									)}
								</Badge>
							</div>
							<p className="mt-1 text-sm text-muted-foreground">
								{network.integration.name}
							</p>
							{network.createdAt && (
								<p className="mt-1 text-xs text-muted-foreground">
									Added{" "}
									{new Date(
										network.createdAt,
									).toLocaleDateString()}
								</p>
							)}
						</div>
					</div>

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
							<DropdownMenuItem onClick={() => onEdit(network)}>
								<Pencil className="mr-2 size-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onDelete(network.id)}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="mr-2 size-4" />
								Remove
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* SSID Mappings Section */}
				<div className="mt-6 space-y-3">
					<div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Service Mappings
					</div>
					<div className="rounded-lg border bg-muted/50 p-3 space-y-3">
						{services.map((service) => {
							const isMapped =
								service.mapping &&
								typeof service.mapping === "object" &&
								"ssidName" in service.mapping;

							const isEnabled =
								isMapped && service.mapping.enabled;

							return (
								<div
									key={service.id}
									className="flex items-center justify-between text-sm"
								>
									<span className="font-medium text-foreground">
										{service.label}
									</span>
									<div className="flex items-center gap-2">
										{isMapped && (
											<Badge
												variant="outline"
												className={
													isEnabled
														? "bg-green-500/10 text-green-600 border-green-200 dark:border-green-900"
														: "bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-800"
												}
											>
												{isEnabled
													? "ACTIVE"
													: "INACTIVE"}
											</Badge>
										)}
										<span
											className={
												isMapped
													? "font-medium"
													: "text-muted-foreground italic"
											}
										>
											{isMapped
												? service.mapping.ssidName
												: "unset"}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Device Tags */}
				{networkConfig.tags && networkConfig.tags.length > 0 && (
					<div className="mt-4 flex flex-wrap gap-2">
						{networkConfig.tags.map((tag: string) => (
							<Badge
								key={tag}
								variant="outline"
								className="text-xs"
							>
								{tag}
							</Badge>
						))}
					</div>
				)}
			</div>

			{/* Footer Stats */}
			<div className="mt-6 flex items-center gap-4 border-t pt-4 text-sm text-muted-foreground">
				{hasWireless && (
					<div className="flex items-center gap-1.5">
						<WifiIcon className="size-4" />
						{networkConfig.deviceCount !== undefined ? (
							<span>
								{networkConfig.deviceCount} Access Point
								{networkConfig.deviceCount !== 1 ? "s" : ""}
							</span>
						) : (
							<span>Unknown Access Points</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export function NetworksPageContent() {
	const [isWizardOpen, setIsWizardOpen] = useState(false);
	// biome-ignore lint/suspicious/noExplicitAny: Network type varies
	const [editingNetwork, setEditingNetwork] = useState<any | null>(null);
	const { activeWorkspace } = useActiveWorkspace();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	// Auto-open wizard if 'add=true' parameter is present
	useEffect(() => {
		if (searchParams.get("add") === "true") {
			setIsWizardOpen(true);
		}
	}, [searchParams]);

	// Fetch networks from database
	const { data: networks, isLoading } = useQuery({
		...orpc.networks.list.queryOptions({
			input: {
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled: !!activeWorkspace?.id,
	});

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: (input: { id: string; workspaceId: string }) =>
			orpcClient.networks.delete(input),
		onSuccess: () => {
			toast.success("Network deleted successfully");
			queryClient.invalidateQueries({
				queryKey: orpc.networks.list.queryOptions({
					input: {
						workspaceId: activeWorkspace?.id || "",
					},
				}).queryKey,
			});
		},
		onError: () => {
			toast.error("Failed to delete network");
		},
	});

	const handleDelete = (networkId: string) => {
		if (!activeWorkspace?.id) return;

		if (confirm("Are you sure you want to delete this network?")) {
			deleteMutation.mutate({
				id: networkId,
				workspaceId: activeWorkspace.id,
			});
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Networks</h1>
					<p className="text-muted-foreground">
						Manage your network infrastructure and deployments
					</p>
				</div>
				<Button onClick={() => setIsWizardOpen(true)}>
					<PlusIcon className="mr-2 size-4" />
					Add Network
				</Button>
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			)}

			{/* Empty State */}
			{!isLoading && (!networks || networks.length === 0) && (
				<Card className="p-12">
					<div className="flex flex-col items-center justify-center text-center">
						<RadioTowerIcon className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							No networks yet
						</h3>
						<p className="text-muted-foreground mb-6 max-w-sm">
							Connect your network infrastructure to start
							managing Guest WiFi, IoT, and Employee access.
						</p>
						<Button onClick={() => setIsWizardOpen(true)}>
							<PlusIcon className="mr-2 size-4" />
							Add Your First Network
						</Button>
					</div>
				</Card>
			)}

			{/* Networks Grid */}
			{!isLoading && networks && networks.length > 0 && (
				<div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(450px,1fr))]">
					{networks.map((network) => (
						<NetworkCard
							key={network.id}
							network={network}
							onEdit={setEditingNetwork}
							onDelete={handleDelete}
						/>
					))}
				</div>
			)}

			{/* Add Network Wizard */}
			{isWizardOpen && (
				<div className="fixed inset-0 z-50 bg-background overflow-y-auto">
					<AddNetworkWizard onClose={() => setIsWizardOpen(false)} />
				</div>
			)}

			{/* Edit Network Dialog */}
			<EditNetworkDialog
				network={editingNetwork}
				open={!!editingNetwork}
				onOpenChange={(open) => !open && setEditingNetwork(null)}
			/>
		</div>
	);
}
