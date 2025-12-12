"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpcClient } from "@shared/lib/orpc-client";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
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
import { Loader2, Search, WifiIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeployNetworkDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeployNetworkDialog({
	open,
	onOpenChange,
}: DeployNetworkDialogProps) {
	const { activeWorkspace } = useActiveWorkspace();
	const queryClient = useQueryClient();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);

	const { data: networks, isLoading } = useQuery({
		...orpc.networks.list.queryOptions({
			input: {
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled: !!activeWorkspace?.id,
	});

	// Filter networks that have Guest WiFi mapped
	const eligibleNetworks =
		networks?.filter((network) => {
			// biome-ignore lint/suspicious/noExplicitAny: Network config type varies
			const config = (network.config as any) || {};
			const mapping = config.ssidMapping?.guestWifi;
			return (
				mapping &&
				typeof mapping === "object" &&
				"ssidNumber" in mapping
			);
		}) || [];

	const filteredNetworks = eligibleNetworks.filter((network) =>
		network.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const deployMutation = useMutation({
		mutationFn: (input: { workspaceId: string; networkIds: string[] }) =>
			orpcClient.guestWifi.deploy(input),
		onSuccess: (data) => {
			toast.success(
				`Successfully deployed to ${data.deployedCount} networks`,
			);
			if (data.errors && data.errors.length > 0) {
				toast.error(
					`Failed to deploy to ${data.errors.length} networks`,
				);
			}
			queryClient.invalidateQueries({
				queryKey: orpc.guestWifi.getStats.queryOptions({
					input: {
						workspaceId: activeWorkspace?.id || "",
					},
				}).queryKey,
			});
			onOpenChange(false);
			setSelectedNetworks([]);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to deploy networks");
		},
	});

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedNetworks(filteredNetworks.map((n) => n.id));
		} else {
			setSelectedNetworks([]);
		}
	};

	const handleSelectNetwork = (networkId: string, checked: boolean) => {
		if (checked) {
			setSelectedNetworks((prev) => [...prev, networkId]);
		} else {
			setSelectedNetworks((prev) =>
				prev.filter((id) => id !== networkId),
			);
		}
	};

	const handleDeploy = () => {
		if (!activeWorkspace?.id) return;
		deployMutation.mutate({
			workspaceId: activeWorkspace.id,
			networkIds: selectedNetworks,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Deploy to Networks</DialogTitle>
					<DialogDescription>
						Select networks to enable Guest WiFi. This will set the
						SSID to Open security and Click-through splash page.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search networks..."
							className="pl-9"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex items-center space-x-2 pb-2 border-b">
						<Checkbox
							id="select-all"
							checked={
								filteredNetworks.length > 0 &&
								selectedNetworks.length ===
									filteredNetworks.length
							}
							onCheckedChange={(checked) =>
								handleSelectAll(checked as boolean)
							}
						/>
						<Label htmlFor="select-all" className="font-medium">
							Select All ({filteredNetworks.length})
						</Label>
					</div>

					<div className="h-[300px] overflow-y-auto pr-4">
						{isLoading ? (
							<div className="flex items-center justify-center h-full">
								<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
							</div>
						) : filteredNetworks.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-4">
								<WifiIcon className="h-8 w-8 mb-2 opacity-50" />
								<p>No eligible networks found.</p>
								<p className="text-xs mt-1">
									Make sure you have mapped a Guest WiFi SSID
									in your network settings.
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{filteredNetworks.map((network) => {
									// biome-ignore lint/suspicious/noExplicitAny: Network config type varies
									const config =
										(network.config as any) || {};
									const mapping =
										config.ssidMapping?.guestWifi;
									const isEnabled = mapping?.enabled;

									return (
										<div
											key={network.id}
											className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
										>
											<Checkbox
												id={network.id}
												checked={selectedNetworks.includes(
													network.id,
												)}
												onCheckedChange={(checked) =>
													handleSelectNetwork(
														network.id,
														checked as boolean,
													)
												}
												className="mt-1"
											/>
											<div className="grid gap-1.5 leading-none w-full">
												<Label
													htmlFor={network.id}
													className="font-medium cursor-pointer flex items-center justify-between"
												>
													<span>{network.name}</span>
													{isEnabled && (
														<Badge
															variant="outline"
															className="text-[10px] h-5 px-1.5 bg-green-500/10 text-green-600 border-green-200"
														>
															Active
														</Badge>
													)}
												</Label>
												<p className="text-xs text-muted-foreground">
													SSID:{" "}
													{mapping?.ssidName ||
														"Unknown"}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						onClick={handleDeploy}
						disabled={
							selectedNetworks.length === 0 ||
							deployMutation.isPending
						}
					>
						{deployMutation.isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Deploy ({selectedNetworks.length})
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
