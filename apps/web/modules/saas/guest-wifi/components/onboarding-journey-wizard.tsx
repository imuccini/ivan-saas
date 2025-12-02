"use client";

import { Button } from "@ui/components/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { StepAuthentication } from "./steps/step-1-authentication";
import { StepContent } from "./steps/step-2-content";
import { StepJourney } from "./steps/step-3-journey";

interface OnboardingJourneyWizardProps {
	open: boolean;
	onClose: () => void;
}

interface FormField {
	id: string;
	label: string;
	placeholder?: string;
	required: boolean;
	type: string;
	isCustom?: boolean;
	options?: string[];
}

const STEPS = [
	{ id: 1, name: "Authentication", component: StepAuthentication },
	{ id: 2, name: "Content", component: StepContent },
	{ id: 3, name: "Journey", component: StepJourney },
];

export function OnboardingJourneyWizard({
	open,
	onClose,
}: OnboardingJourneyWizardProps) {
	const [currentStep, setCurrentStep] = useState(1);
	const [registrationFields, setRegistrationFields] = useState<FormField[]>([
		{
			id: "1",
			label: "First Name",
			placeholder: "Enter your first name",
			required: false,
			type: "text",
		},
		{
			id: "3",
			label: "Email",
			placeholder: "Enter your email address",
			required: true,
			type: "email",
		},
	]);

	if (!open) return null;

	const CurrentStepComponent = STEPS.find(
		(s) => s.id === currentStep,
	)?.component;

	const handleSaveAndContinue = () => {
		if (currentStep < STEPS.length) {
			setCurrentStep(currentStep + 1);
		} else {
			// Save and close
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 z-40"
			style={{ backgroundColor: "var(--sidebar)" }}
		>
			<div className="h-full w-full p-5">
				<div className="h-full flex flex-col">
					{/* Header */}
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
											onClick={() =>
												setCurrentStep(step.id)
											}
											className={`text-sm font-medium transition-colors ${
												currentStep === step.id
													? "text-foreground"
													: "text-muted-foreground hover:text-foreground"
											}`}
										>
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
								<Button variant="ghost" onClick={onClose}>
									Exit
								</Button>
								<Button
									onClick={handleSaveAndContinue}
									className="gap-2"
								>
									Save & Continue
									<ArrowRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 rounded-b-2xl border border-t-0 bg-card text-card-foreground shadow-sm overflow-hidden">
						{currentStep === 1 && (
							<StepAuthentication
								registrationFields={registrationFields}
								setRegistrationFields={setRegistrationFields}
							/>
						)}
						{currentStep === 2 && (
							<StepContent
								registrationFields={registrationFields}
							/>
						)}
						{currentStep === 3 && <StepJourney />}
					</div>
				</div>
			</div>
		</div>
	);
}
