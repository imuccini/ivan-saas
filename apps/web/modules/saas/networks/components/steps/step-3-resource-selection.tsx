"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
import { Label } from "@ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface Step3Props {
	integrationId: string;
	// biome-ignore lint/suspicious/noExplicitAny: Network object structure varies
	onComplete: (orgId: string, networks: any[], tags: string[]) => void;
}

export function Step3ResourceSelection({
	integrationId,
	onComplete,
}: Step3Props) {
	const { activeWorkspace } = useActiveWorkspace();
	const [selectedOrg, setSelectedOrg] = useState<string>("");
	const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	// Fetch Organizations
	const { data: organizations, isLoading: isLoadingOrgs } = useQuery(
		orpc.meraki.getOrganizations.queryOptions({
			input: {
				integrationId,
				workspaceId: activeWorkspace?.id || "",
			},
			enabled: !!activeWorkspace?.id,
		}),
	);

	// Fetch Networks (when org selected)
	const { data: networks, isLoading: isLoadingNetworks } = useQuery({
		...orpc.meraki.getNetworks.queryOptions({
			input: {
				integrationId,
				organizationId: selectedOrg,
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled: !!selectedOrg && !!activeWorkspace?.id,
	});

	// Fetch Tags (when org selected)
	const { data: tags, isLoading: isLoadingTags } = useQuery({
		...orpc.meraki.getDeviceTags.queryOptions({
			input: {
				integrationId,
				organizationId: selectedOrg,
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled: !!selectedOrg && !!activeWorkspace?.id,
	});

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

	const handleNext = () => {
		const selectedNetworkObjects =
			networks?.filter((n) => selectedNetworks.includes(n.id)) || [];
		onComplete(selectedOrg, selectedNetworkObjects, selectedTags);
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
					Choose the organization, networks, and tags to manage.
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
					{/* Network Selection */}
					<div className="space-y-4">
						<Label>Networks</Label>
						{isLoadingNetworks ? (
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Loader2 className="h-4 w-4 animate-spin" />
								Loading networks...
							</div>
						) : (
							<div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
								{networks?.length === 0 ? (
									<p className="text-sm text-muted-foreground">
										No wireless networks found.
									</p>
								) : (
									networks?.map((network) => (
										<div
											key={network.id}
											className="flex items-center space-x-2"
										>
											<Checkbox
												id={`net-${network.id}`}
												checked={selectedNetworks.includes(
													network.id,
												)}
												onCheckedChange={() =>
													handleNetworkToggle(
														network.id,
													)
												}
											/>
											<label
												htmlFor={`net-${network.id}`}
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
											>
												{network.name}
											</label>
										</div>
									))
								)}
							</div>
						)}
						<p className="text-xs text-muted-foreground">
							Select the networks where you want to enable Guest
							WiFi.
						</p>
					</div>

					{/* Tag Selection */}
					<div className="space-y-4">
						<Label>Device Tags (Optional)</Label>
						{isLoadingTags ? (
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Loader2 className="h-4 w-4 animate-spin" />
								Loading tags...
							</div>
						) : (
							<div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
								{tags?.length === 0 ? (
									<p className="text-sm text-muted-foreground">
										No device tags found.
									</p>
								) : (
									tags?.map((tag) => (
										<div
											key={tag}
											className="flex items-center space-x-2"
										>
											<Checkbox
												id={`tag-${tag}`}
												checked={selectedTags.includes(
													tag,
												)}
												onCheckedChange={() =>
													handleTagToggle(tag)
												}
											/>
											<label
												htmlFor={`tag-${tag}`}
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
											>
												{tag}
											</label>
										</div>
									))
								)}
							</div>
						)}
						<p className="text-xs text-muted-foreground">
							Limit deployment to devices with specific tags (e.g.
							"guest-wifi-aps").
						</p>
					</div>
				</>
			)}

			<div className="flex justify-end pt-4">
				<Button
					onClick={handleNext}
					disabled={!selectedOrg || selectedNetworks.length === 0}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
