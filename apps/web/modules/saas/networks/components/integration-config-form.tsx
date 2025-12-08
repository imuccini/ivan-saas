"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type VendorId, getVendor } from "../lib/vendors";

interface IntegrationConfigFormProps {
	vendor: VendorId;
	onComplete: (integrationId: string) => void;
	onCancel?: () => void;
	editingIntegration?: {
		id: string;
		name: string;
	} | null;
}

export function IntegrationConfigForm({
	vendor,
	onComplete,
	onCancel,
	editingIntegration,
}: IntegrationConfigFormProps) {
	const { activeWorkspace } = useActiveWorkspace();
	const [name, setName] = useState(editingIntegration?.name || "");
	const [apiKey, setApiKey] = useState("");

	const isEditMode = !!editingIntegration;
	const vendorInfo = getVendor(vendor);

	const createMutation = useMutation(
		orpc.integrations.create.mutationOptions({
			onSuccess: (data) => {
				toast.success("Integration created successfully");
				setName("");
				setApiKey("");
				onComplete(data.id);
			},
			onError: () => {
				toast.error("Failed to create integration");
			},
		}),
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!activeWorkspace?.id || !name || !apiKey) return;

		createMutation.mutate({
			workspaceId: activeWorkspace.id,
			provider: vendor,
			name,
			credentials: { apiKey },
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold">Configure Integration</h2>
				<p className="text-muted-foreground">
					Connect your {vendorInfo.name} account
				</p>
			</div>

			<div className="space-y-4">
				{/* Integration Name */}
				<div className="space-y-2">
					<Label htmlFor="name">Integration Name</Label>
					<Input
						id="name"
						placeholder="e.g., HQ Meraki, Branch Office"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<p className="text-xs text-muted-foreground">
						A friendly name to identify this integration
					</p>
				</div>

				{/* API Key */}
				<div className="space-y-2">
					<Label htmlFor="apiKey">API Key</Label>
					<Input
						id="apiKey"
						type="password"
						placeholder={
							isEditMode
								? "Enter new API key (leave blank to keep current)"
								: "Enter your API key"
						}
						value={apiKey}
						onChange={(e) => setApiKey(e.target.value)}
						required={!isEditMode}
					/>
					<p className="text-xs text-muted-foreground">
						Your {vendorInfo.name} API key
					</p>
				</div>
			</div>

			<div className="flex gap-3 justify-end">
				{onCancel && (
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				)}
				<Button type="submit" disabled={createMutation.isPending}>
					{createMutation.isPending && (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					)}
					{isEditMode ? "Update" : "Create"} Integration
				</Button>
			</div>
		</form>
	);
}
