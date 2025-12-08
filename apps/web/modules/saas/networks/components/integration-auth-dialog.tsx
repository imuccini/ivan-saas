"use client";

import { type VendorId } from "@saas/networks/lib/vendors";
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
import { IntegrationConfigForm } from "./integration-config-form";
import { Step1VendorSelection } from "./steps/step-1-vendor-selection";

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

type DialogStep = "vendor" | "config";

export function IntegrationAuthDialog({
	open,
	onOpenChange,
	onSuccess,
	preselectedVendor,
	editingIntegration,
}: IntegrationAuthDialogProps) {
	const [step, setStep] = useState<DialogStep>(
		preselectedVendor || editingIntegration ? "config" : "vendor",
	);
	const [selectedVendor, setSelectedVendor] = useState<VendorId | null>(
		(preselectedVendor as VendorId) ||
			(editingIntegration?.provider as VendorId) ||
			null,
	);

	const handleVendorSelect = (vendor: string) => {
		setSelectedVendor(vendor as VendorId);
		setStep("config");
	};

	const handleBack = () => {
		if (step === "config" && !preselectedVendor && !editingIntegration) {
			setStep("vendor");
		}
	};

	const handleClose = () => {
		onOpenChange(false);
		// Reset state when closing
		setTimeout(() => {
			setStep(preselectedVendor || editingIntegration ? "config" : "vendor");
			setSelectedVendor(
				(preselectedVendor as VendorId) ||
					(editingIntegration?.provider as VendorId) ||
					null,
			);
		}, 200);
	};

	const handleComplete = (integrationId: string) => {
		onSuccess(integrationId);
		handleClose();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-full h-full p-0 gap-0 [&>button]:hidden">
				{/* Accessibility: Hidden title and description for screen readers */}
				<VisuallyHidden>
					<DialogTitle>
						{editingIntegration ? "Edit" : "Add"} Network Integration
					</DialogTitle>
					<DialogDescription>
						{step === "vendor"
							? "Select a network vendor to integrate with your workspace"
							: "Configure your network integration settings"}
					</DialogDescription>
				</VisuallyHidden>

				{/* Full-page layout */}
				<div className="h-full flex flex-col bg-background">
					{/* Header - centered with max-width, no border */}
					<div className="max-w-4xl mx-auto px-4 py-8 w-full">
						<div className="mb-8 flex items-center justify-between">
							<div className="flex items-center gap-4">
								{step === "config" &&
									!preselectedVendor &&
									!editingIntegration && (
										<Button variant="ghost" size="icon" onClick={handleBack}>
											<ArrowLeft className="h-4 w-4" />
										</Button>
									)}
								<h1 className="text-2xl font-bold">
									{editingIntegration ? "Edit" : "Add"} Network Integration
								</h1>
							</div>
							<Button variant="ghost" size="icon" onClick={handleClose}>
								<X className="h-4 w-4" />
							</Button>
						</div>

						{/* Content */}
						<Card className="p-6">
							{step === "vendor" && (
								<Step1VendorSelection onSelect={handleVendorSelect} />
							)}
							{step === "config" && selectedVendor && (
								<IntegrationConfigForm
									vendor={selectedVendor}
									onComplete={handleComplete}
									editingIntegration={editingIntegration}
								/>
							)}
						</Card>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
