"use client";

import {
	type IdpId,
	getIdpVendor,
} from "@saas/integrations/lib/identity-providers";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@ui/components/dialog";
import { VisuallyHidden } from "@ui/components/visually-hidden";
import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfigOptionsForm } from "./steps/config-options-form";
import { CredentialsForm } from "./steps/credentials-form";
import { VendorSelectionStep } from "./steps/vendor-selection";

// Define ORPC input type based on inference (or manual mapping if inference fails in this context)
// input: { workspaceId: string, provider: enum, name: string, credentials: record, config: optional }

interface AddIdpDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

type DialogStep = "vendor" | "credentials" | "config";

export function AddIdpDialog({
	open,
	onOpenChange,
	onSuccess,
}: AddIdpDialogProps) {
	const { activeWorkspace } = useActiveWorkspace();
	const queryClient = useQueryClient();

	const [step, setStep] = useState<DialogStep>("vendor");
	const [selectedVendor, setSelectedVendor] = useState<IdpId | null>(null);
	const [credentials, setCredentials] = useState<Record<string, string>>({});
    
    // Mutation
    const createMutation = useMutation(
        orpc.identityProviders.create.mutationOptions({
            onSuccess: () => {
                 toast.success("Identity Provider connected successfully");
                 queryClient.invalidateQueries({
                     queryKey: orpc.identityProviders.list.queryOptions({ input: { workspaceId: activeWorkspace?.id || "" } }).queryKey
                 });
                 onSuccess?.();
                 handleClose();
            },
            onError: (err) => {
                toast.error(err.message || "Failed to create integration");
            }
        })
    );

	const handleVendorSelect = (vendor: IdpId) => {
		setSelectedVendor(vendor);
		setStep("credentials");
	};

	const handleCredentialsSubmit = (data: Record<string, string>) => {
		setCredentials(data);
		setStep("config");
	};

	const handleConfigSubmit = (data: any) => {
		if (!activeWorkspace?.id || !selectedVendor) return;

        // Transform comma strings to arrays
        const config = {
            ssoGroups: data.ssoGroups ? data.ssoGroups.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
            sponsorGroups: data.sponsorGroups ? data.sponsorGroups.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
            byodEnabled: data.byodEnabled,
            byodImportAll: data.byodImportAll,
            byodGroups: data.byodGroups ? data.byodGroups.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        };
        
        // Use generic request
        createMutation.mutate({
            workspaceId: activeWorkspace.id,
            provider: selectedVendor,
            name: getIdpVendor(selectedVendor).name,
            credentials,
            config
        });
	};

	const handleBack = () => {
		if (step === "credentials") setStep("vendor");
		if (step === "config") setStep("credentials");
	};

	const handleClose = () => {
		onOpenChange(false);
		setTimeout(() => {
			setStep("vendor");
			setSelectedVendor(null);
			setCredentials({});
		}, 200);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-full h-full p-0 gap-0 [&>button]:hidden">
				<VisuallyHidden>
					<DialogTitle>Add Identity Provider</DialogTitle>
					<DialogDescription>
						Connect a new identity provider
					</DialogDescription>
				</VisuallyHidden>

				<div className="h-full flex flex-col bg-background">
					<div className="max-w-4xl mx-auto px-4 py-8 w-full">
						<div className="mb-8 flex items-center justify-between">
							<div className="flex items-center gap-4">
								{step !== "vendor" && (
									<Button
										variant="ghost"
										size="icon"
										onClick={handleBack}
									>
										<ArrowLeft className="h-4 w-4" />
									</Button>
								)}
								<h1 className="text-2xl font-bold">
									Add Identity Provider
								</h1>
							</div>
							<Button variant="ghost" size="icon" onClick={handleClose}>
								<X className="h-4 w-4" />
							</Button>
						</div>

						{/* Content */}
						<Card className="p-6">
							{step === "vendor" && (
								<VendorSelectionStep onSelect={handleVendorSelect} />
							)}
							{step === "credentials" && selectedVendor && (
								<CredentialsForm
									vendorId={selectedVendor}
									defaultValues={credentials}
									onSubmit={handleCredentialsSubmit}
									onBack={handleBack}
								/>
							)}
							{step === "config" && (
								<ConfigOptionsForm
									onSubmit={handleConfigSubmit}
									onBack={handleBack}
                                    isLoading={createMutation.isPending}
								/>
							)}
						</Card>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
