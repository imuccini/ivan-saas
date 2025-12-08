"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@ui/components/alert-dialog";
import { Button } from "@ui/components/button";
import {
	ArrowRight,
	Fingerprint,
	Loader2,
	Palette,
	Workflow,
} from "lucide-react";
import { useState } from "react";
import { useWizard } from "./wizard-context";

const STEPS = [
	{
		id: 1,
		name: "Authentication",
		icon: Fingerprint,
	},
	{ id: 2, name: "Journey", icon: Workflow },
	{ id: 3, name: "Content", icon: Palette },
];

export function WizardHeader({ onClose }: { onClose: () => void }) {
	const {
		currentStep,
		setCurrentStep,
		saveMutation,
		handleSaveAndContinue,
		hasUnsavedChanges,
	} = useWizard();

	const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
		useState(false);

	const handleClose = () => {
		if (hasUnsavedChanges) {
			setShowUnsavedChangesDialog(true);
		} else {
			onClose();
		}
	};

	return (
		<>
			<div className="rounded-t-2xl border bg-card text-card-foreground shadow-sm">
				<div className="flex items-center justify-between px-6 py-4">
					{/* Breadcrumb Navigation */}
					<div className="flex items-center gap-2">
						{STEPS.map((step, index) => (
							<div
								key={step.id}
								className="flex items-center gap-2"
							>
								<button
									type="button"
									onClick={() => setCurrentStep(step.id)}
									className={`flex items-center gap-2 text-sm transition-colors ${
										currentStep === step.id
											? "text-primary font-semibold"
											: "text-muted-foreground font-medium hover:text-foreground"
									}`}
								>
									<step.icon className="h-4 w-4" />
									{step.name}
								</button>
								{index < STEPS.length - 1 && (
									<span className="text-muted-foreground">
										›
									</span>
								)}
							</div>
						))}
					</div>

					{/* Actions */}
					<div className="flex items-center gap-2">
						<Button variant="ghost" onClick={handleClose}>
							Exit
						</Button>
						<Button
							onClick={handleSaveAndContinue}
							className="gap-2"
							disabled={saveMutation.isPending}
						>
							{saveMutation.isPending && (
								<Loader2 className="h-4 w-4 animate-spin" />
							)}
							{currentStep === STEPS.length
								? "Publish"
								: "Save & Continue"}
							<ArrowRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			<AlertDialog
				open={showUnsavedChangesDialog}
				onOpenChange={setShowUnsavedChangesDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
						<AlertDialogDescription>
							You have unsaved changes. Are you sure you want to
							leave? Your changes will be lost.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={onClose}>
							Leave without saving
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
