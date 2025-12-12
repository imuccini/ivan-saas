"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpcClient } from "@shared/lib/orpc-client";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { toast } from "sonner";
import { SsidMappingEditor } from "./ssid-mapping-editor";
import type { SSIDMapping } from "./steps/step-4-ssid-mapping";

interface EditNetworkDialogProps {
	// biome-ignore lint/suspicious/noExplicitAny: Network type varies
	network: any;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditNetworkDialog({
	network,
	open,
	onOpenChange,
}: EditNetworkDialogProps) {
	const { activeWorkspace } = useActiveWorkspace();
	const queryClient = useQueryClient();

	const syncMutation = useMutation({
		mutationFn: (input: { id: string; workspaceId: string }) =>
			orpcClient.networks.sync(input),
	});

	const updateSsidMappingMutation = useMutation({
		mutationFn: (input: {
			id: string;
			workspaceId: string;
			ssidMapping: SSIDMapping;
		}) => orpcClient.networks.updateSsidMapping(input),
		onSuccess: (_, variables) => {
			// Trigger sync after successful update
			syncMutation.mutate({
				id: variables.id,
				workspaceId: variables.workspaceId,
			});

			toast.success("Network configuration updated");
			queryClient.invalidateQueries({
				queryKey: orpc.networks.list.queryOptions({
					input: {
						workspaceId: activeWorkspace?.id || "",
					},
				}).queryKey,
			});
			onOpenChange(false);
		},
		onError: (error) => {
			toast.error(
				error.message || "Failed to update network configuration",
			);
		},
	});

	if (!network) return null;

	const handleSave = (mapping: SSIDMapping) => {
		if (!activeWorkspace?.id) return;

		updateSsidMappingMutation.mutate({
			id: network.id,
			workspaceId: activeWorkspace.id,
			ssidMapping: mapping,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Network: {network.name}</DialogTitle>
					<DialogDescription>
						Configure SSID mappings for your network services.
					</DialogDescription>
				</DialogHeader>

				<SsidMappingEditor
					integrationId={network.integration.id}
					vendor={network.integration.provider}
					networkId={network.externalId || network.config?.id}
					initialMapping={network.config?.ssidMapping}
					onSave={handleSave}
					onCancel={() => onOpenChange(false)}
					isSaving={updateSsidMappingMutation.isPending}
				/>
			</DialogContent>
		</Dialog>
	);
}
