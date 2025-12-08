"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getAllVendors } from "../lib/vendors";

const VENDORS = getAllVendors();

interface IntegrationAuthDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: (integrationId: string) => void;
	preselectedVendor?: string;
	editingIntegration?: {
		id: string;
		name: string;
		provider: string;
	} | null;
}

export function IntegrationAuthDialog({
	open,
	onOpenChange,
	onSuccess,
	preselectedVendor,
	editingIntegration,
}: IntegrationAuthDialogProps) {
	const { activeWorkspace } = useActiveWorkspace();
	const [vendor, setVendor] = useState(
		editingIntegration?.provider || preselectedVendor || "meraki",
	);
	const [name, setName] = useState(editingIntegration?.name || "");
	const [apiKey, setApiKey] = useState("");

	const isEditMode = !!editingIntegration;

	const createMutation = useMutation(
		orpc.integrations.create.mutationOptions({
			onSuccess: (data) => {
				toast.success("Integration created successfully");
				setName("");
				setApiKey("");
				onSuccess(data.id);
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
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>
							{isEditMode ? "Edit" : "Add"} Network Integration
						</DialogTitle>
						<DialogDescription>
							{isEditMode
								? "Update your network integration settings."
								: "Connect your network infrastructure vendor to manage your networks."}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* Vendor Selection */}
						<div className="space-y-2">
							<Label htmlFor="vendor">Vendor</Label>
							<Select
								value={vendor}
								onValueChange={setVendor}
								disabled={isEditMode}
							>
								<SelectTrigger id="vendor">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{VENDORS.map((v) => (
										<SelectItem
											key={v.id}
											value={v.id}
											disabled={v.comingSoon}
										>
											<div className="flex items-center gap-2">
												<img
													src={v.logo}
													alt={v.name}
													className="h-4 w-auto object-contain"
												/>
												<span>{v.name}</span>
												{v.comingSoon && (
													<span className="text-xs text-muted-foreground">
														(Coming Soon)
													</span>
												)}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{isEditMode && (
								<p className="text-xs text-muted-foreground">
									Vendor cannot be changed after creation
								</p>
							)}
						</div>

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
								Your{" "}
								{VENDORS.find((v) => v.id === vendor)?.name} API
								key
							</p>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={createMutation.isPending}
						>
							{createMutation.isPending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{isEditMode ? "Update" : "Create"} Integration
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
