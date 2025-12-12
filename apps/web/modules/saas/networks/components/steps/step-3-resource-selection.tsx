"use client";

import {
	extractNetworkTags,
	filterNetworksByTags,
} from "@saas/networks/lib/extract-network-tags";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { RadioGroup, RadioGroupItem } from "@ui/components/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Step3Props {
	integrationId: string;
	vendor: string;
	// biome-ignore lint/suspicious/noExplicitAny: Network object structure varies
	onComplete: (orgId: string, networks: any[], tags: string[]) => void;
}

type SelectionMode = "tag-sync" | "manual-select";

export function Step3ResourceSelection({
	integrationId,
	vendor,
	onComplete,
}: Step3Props) {
	const { activeWorkspace } = useActiveWorkspace();
	const [selectedOrg, setSelectedOrg] = useState<string>("");
	const [selectionMode, setSelectionMode] =
		useState<SelectionMode>("manual-select");
	const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [networkSearchQuery, setNetworkSearchQuery] = useState("");
	const [tagSearchQuery, setTagSearchQuery] = useState("");

	const isMeraki = vendor === "meraki";
	const isUbiquiti = vendor === "ubiquiti";

	// Fetch Organizations (Meraki)
	const { data: merakiOrgs, isLoading: isLoadingMerakiOrgs } = useQuery(
		orpc.meraki.getOrganizations.queryOptions({
			input: {
				integrationId,
				workspaceId: activeWorkspace?.id || "",
			},
			enabled: !!activeWorkspace?.id && isMeraki,
		}),
	);

	// Fetch Networks (Meraki)
	const { data: merakiNetworks, isLoading: isLoadingMerakiNetworks } = useQuery({
		...orpc.meraki.getNetworks.queryOptions({
			input: {
				integrationId,
				organizationId: selectedOrg,
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled: !!selectedOrg && !!activeWorkspace?.id && isMeraki,
	});

	// Fetch Sites (Ubiquiti) - mapped to networks
	const { data: titleSites, isLoading: isLoadingUbiquitiSites } = useQuery({
		...orpc.ubiquiti.getSites.queryOptions({
			input: {
				integrationId,
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled: !!activeWorkspace?.id && isUbiquiti,
	});

	// Normalize data
	const organizations = isUbiquiti
		? [{ id: "default", name: "UniFi Controller" }]
		: merakiOrgs;
	
	const networks = isUbiquiti
		? titleSites
		: merakiNetworks;

	const isLoadingOrgs = isUbiquiti ? false : isLoadingMerakiOrgs;
	const isLoadingNetworks = isUbiquiti ? isLoadingUbiquitiSites : isLoadingMerakiNetworks;

	// Auto-select "default" org for Ubiquiti
	useEffect(() => {
		if (isUbiquiti && !selectedOrg) {
			setSelectedOrg("default");
		}
	}, [isUbiquiti, selectedOrg]);

	// Extract network tags from fetched networks
	const networkTags = useMemo(() => {
		if (!networks) return [];
		return extractNetworkTags(networks);
	}, [networks]);

	// Filter networks by search query
	const filteredNetworks = useMemo(() => {
		if (!networks) return [];
		if (!networkSearchQuery) return networks;

		const query = networkSearchQuery.toLowerCase();
		return networks.filter((network) =>
			network.name.toLowerCase().includes(query),
		);
	}, [networks, networkSearchQuery]);

	// Filter tags by search query
	const filteredTags = useMemo(() => {
		if (!tagSearchQuery) return networkTags;

		const query = tagSearchQuery.toLowerCase();
		return networkTags.filter((tag) => tag.toLowerCase().includes(query));
	}, [networkTags, tagSearchQuery]);

	// Calculate matching networks for tag-sync mode
	const matchingNetworks = useMemo(() => {
		if (selectionMode !== "tag-sync" || !networks) return [];
		return filterNetworksByTags(networks, selectedTags);
	}, [selectionMode, networks, selectedTags]);

	// Clear selections when switching modes
	useEffect(() => {
		setSelectedNetworks([]);
		setSelectedTags([]);
		setNetworkSearchQuery("");
		setTagSearchQuery("");
	}, [selectionMode]);

	// Clear selections when changing organization
	useEffect(() => {
		setSelectedNetworks([]);
		setSelectedTags([]);
		setNetworkSearchQuery("");
		setTagSearchQuery("");
	}, [selectedOrg]);

	const handleNetworkToggle = (networkId: string) => {
		setSelectedNetworks((prev) =>
			prev.includes(networkId)
				? prev.filter((id) => id !== networkId)
				: [...prev, networkId],
		);
	};

	const handleTagToggle = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
		);
	};

	const handleSelectAll = () => {
		if (selectedNetworks.length === filteredNetworks.length) {
			setSelectedNetworks([]);
		} else {
			setSelectedNetworks(filteredNetworks.map((n) => n.id));
		}
	};

	const handleNext = () => {
		if (selectionMode === "tag-sync") {
			// Tag-sync mode: use networks matching selected tags
			onComplete(selectedOrg, matchingNetworks, selectedTags);
		} else {
			// Manual mode: use manually selected networks
			const selectedNetworkObjects =
				networks?.filter((n) => selectedNetworks.includes(n.id)) || [];
			onComplete(selectedOrg, selectedNetworkObjects, []);
		}
	};

	const isNextDisabled = () => {
		if (!selectedOrg) return true;
		if (selectionMode === "tag-sync") {
			return selectedTags.length === 0 || matchingNetworks.length === 0;
		}
		return selectedNetworks.length === 0;
	};

	if (isLoadingOrgs) {
		return (
			<div className="flex justify-center p-8">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-xl font-semibold">Select Resources</h2>
				<p className="text-muted-foreground">
					Choose the organization and how you want to select networks.
				</p>
			</div>

			{/* Organization Selection */}
			<div className="space-y-2">
				<Label>Organization</Label>
				<Select value={selectedOrg} onValueChange={setSelectedOrg}>
					<SelectTrigger>
						<SelectValue placeholder="Select an organization" />
					</SelectTrigger>
					<SelectContent>
						{organizations?.map((org) => (
							<SelectItem key={org.id} value={org.id}>
								{org.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{selectedOrg && (
				<>
					{/* Selection Mode Toggle */}
					<div className="space-y-4">
						<Label>How would you like to select networks?</Label>
						<RadioGroup
							value={selectionMode}
							onValueChange={(value) =>
								setSelectionMode(value as SelectionMode)
							}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="manual-select" id="manual" />
								<label
									htmlFor="manual"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
								>
									Manually select networks
								</label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="tag-sync" id="tag-sync" />
								<label
									htmlFor="tag-sync"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
								>
									Sync all networks with specific tags
								</label>
							</div>
						</RadioGroup>
					</div>

					{isLoadingNetworks ? (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Loader2 className="h-4 w-4 animate-spin" />
							Loading networks...
						</div>
					) : (
						<>
							{/* Tag-Sync Mode */}
							{selectionMode === "tag-sync" && (
								<div className="space-y-4">
									<div>
										<Label>Network Tags</Label>
										<p className="text-xs text-muted-foreground mt-1">
											All networks with these tags will be automatically
											synced.
										</p>
									</div>

									{/* Tag Search */}
									<div className="relative">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search tags..."
											value={tagSearchQuery}
											onChange={(e) => setTagSearchQuery(e.target.value)}
											className="pl-9"
										/>
									</div>

									{/* Tag List */}
									<div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
										{networkTags.length === 0 ? (
											<p className="text-sm text-muted-foreground">
												No tags found in networks.
											</p>
										) : filteredTags.length === 0 ? (
											<p className="text-sm text-muted-foreground">
												No tags match your search.
											</p>
										) : (
											filteredTags.map((tag) => (
												<div
													key={tag}
													className="flex items-center space-x-2"
												>
													<Checkbox
														id={`tag-${tag}`}
														checked={selectedTags.includes(tag)}
														onCheckedChange={() => handleTagToggle(tag)}
													/>
													<label
														htmlFor={`tag-${tag}`}
														className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
													>
														{tag}
													</label>
												</div>
											))
										)}
									</div>

									{/* Network Count Preview */}
									{selectedTags.length > 0 && (
										<div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 text-sm">
											<span className="font-medium text-blue-900 dark:text-blue-100">
												{matchingNetworks.length} network
												{matchingNetworks.length !== 1 ? "s" : ""} match
												{matchingNetworks.length === 1 ? "es" : ""} these tags
											</span>
											{matchingNetworks.length === 0 && (
												<p className="text-blue-700 dark:text-blue-300 mt-1">
													No networks have the selected tags. Please choose
													different tags.
												</p>
											)}
										</div>
									)}
								</div>
							)}

							{/* Manual Selection Mode */}
							{selectionMode === "manual-select" && (
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<Label>Networks</Label>
											<p className="text-xs text-muted-foreground mt-1">
												Select specific networks to manage.
											</p>
										</div>
										{filteredNetworks.length > 0 && (
											<Button
												variant="ghost"
												size="sm"
												onClick={handleSelectAll}
											>
												{selectedNetworks.length === filteredNetworks.length
													? "Deselect All"
													: "Select All"}
											</Button>
										)}
									</div>

									{/* Network Search */}
									<div className="relative">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search networks..."
											value={networkSearchQuery}
											onChange={(e) => setNetworkSearchQuery(e.target.value)}
											className="pl-9"
										/>
									</div>

									{/* Network List */}
									<div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
										{networks?.length === 0 ? (
											<p className="text-sm text-muted-foreground">
												No wireless networks found.
											</p>
										) : filteredNetworks.length === 0 ? (
											<p className="text-sm text-muted-foreground">
												No networks match your search.
											</p>
										) : (
											filteredNetworks.map((network) => (
												<div
													key={network.id}
													className="flex items-center space-x-2"
												>
													<Checkbox
														id={`net-${network.id}`}
														checked={selectedNetworks.includes(network.id)}
														onCheckedChange={() =>
															handleNetworkToggle(network.id)
														}
													/>
													<label
														htmlFor={`net-${network.id}`}
														className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
													>
														{network.name}
													</label>
												</div>
											))
										)}
									</div>

									{/* Selection Count */}
									{selectedNetworks.length > 0 && (
										<p className="text-sm text-muted-foreground">
											{selectedNetworks.length} network
											{selectedNetworks.length !== 1 ? "s" : ""} selected
										</p>
									)}
								</div>
							)}
						</>
					)}
				</>
			)}

			<div className="flex justify-end pt-4">
				<Button onClick={handleNext} disabled={isNextDisabled()}>
					Next
				</Button>
			</div>
		</div>
	);
}
