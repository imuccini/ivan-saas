"use client";

import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { Step0IntegrationSelect } from "./steps/step-0-integration-select";
import { Step1VendorSelection } from "./steps/step-1-vendor-selection";
import { Step2Authentication } from "./steps/step-2-authentication";
import { Step3ResourceSelection } from "./steps/step-3-resource-selection";
import {
	type SSIDMapping,
	Step4SsidMapping,
} from "./steps/step-4-ssid-mapping";
import { Step5Provisioning } from "./steps/step-5-provisioning";

export type WizardStep =
	| "integration-select"
	| "vendor"
	| "auth"
	| "resources"
	| "ssid"
	| "provisioning";

interface AddNetworkWizardProps {
	onClose: () => void;
}

export function AddNetworkWizard({ onClose }: AddNetworkWizardProps) {
	const [step, setStep] = useState<WizardStep>("integration-select");
	const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
	const [integrationId, setIntegrationId] = useState<string | null>(null);
	const [organizationId, setOrganizationId] = useState<string | null>(null);
	// biome-ignore lint/suspicious/noExplicitAny: Network object structure varies
	const [selectedNetworks, setSelectedNetworks] = useState<any[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [ssidMapping, setSsidMapping] = useState<SSIDMapping | undefined>(
		undefined,
	);

	const handleSelectExistingIntegration = (id: string, vendor: string) => {
		setIntegrationId(id);
		setSelectedVendor(vendor);
		setStep("resources");
	};

	const handleCreateNewIntegration = () => {
		setStep("vendor");
	};

	const handleVendorSelect = (vendor: string) => {
		setSelectedVendor(vendor);
		setStep("auth");
	};

	const handleAuthenticationComplete = (id: string) => {
		setIntegrationId(id);
		setStep("resources");
	};

	// biome-ignore lint/suspicious/noExplicitAny: Network object structure varies
	const handleResourcesComplete = (
		orgId: string,
		networks: any[],
		tags: string[],
	) => {
		setOrganizationId(orgId);
		setSelectedNetworks(networks);
		setSelectedTags(tags);
		setStep("ssid");
	};

	const handleSsidMappingComplete = (mapping: SSIDMapping) => {
		setSsidMapping(mapping);
		setStep("provisioning");
	};

	const handleSsidMappingSkip = () => {
		setSsidMapping(undefined);
		setStep("provisioning");
	};

	const handleBack = () => {
		if (step === "vendor") setStep("integration-select");
		if (step === "auth") setStep("vendor");
		if (step === "resources") {
			// If we came from integration-select (existing integration), go back there
			// If we came from auth (new integration), go back to auth
			// Wait, if existing, we skip auth. 
			// If we selected existing integration, selectedVendor is set.
			// If we created new, selectedVendor is set too.
			// We can differentiate based on previous step logic, but here simple back is fine?
			// If we were in auth, we go to vendor.
			// If we were in resources, we want to go back to selection or auth.
			// But we don't track history.
			// Simple logic: if integration was created now, go to auth? No, auth is done.
			// Let's go to integration-select always for now or improve later.
			// Actually, let's just go back to integration-select.
			setStep("integration-select");
		}
		if (step === "ssid") setStep("resources");
		if (step === "provisioning") setStep("ssid");
	};

	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<div className="mb-8 flex items-center justify-between">
				<div className="flex items-center gap-4">
					{step !== "integration-select" && (
						<Button
							variant="ghost"
							size="icon"
							onClick={handleBack}
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
					)}
					<h1 className="text-2xl font-bold">Add Network</h1>
				</div>
				<Button variant="ghost" size="icon" onClick={onClose}>
					<X className="h-4 w-4" />
				</Button>
			</div>

			<Card className="p-6">
				{step === "integration-select" && (
					<Step0IntegrationSelect
						onSelectExisting={handleSelectExistingIntegration}
						onCreateNew={handleCreateNewIntegration}
					/>
				)}
				{step === "vendor" && (
					<Step1VendorSelection onSelect={handleVendorSelect} />
				)}
				{step === "auth" && selectedVendor && (
					<Step2Authentication
						vendor={selectedVendor}
						onComplete={handleAuthenticationComplete}
					/>
				)}
				{step === "resources" && integrationId && (
					<Step3ResourceSelection
						integrationId={integrationId}
						vendor={selectedVendor || "meraki"} // Default to meraki for safety
						onComplete={handleResourcesComplete}
					/>
				)}
				{step === "ssid" &&
					integrationId &&
					selectedNetworks.length > 0 && (
						<Step4SsidMapping
							integrationId={integrationId}
							selectedNetworks={selectedNetworks}
							vendor={selectedVendor || "meraki"}
							onComplete={handleSsidMappingComplete}
							onSkip={handleSsidMappingSkip}
						/>
					)}
				{step === "provisioning" &&
					integrationId &&
					organizationId &&
					selectedNetworks.length > 0 && (
						<Step5Provisioning
							integrationId={integrationId}
							organizationId={organizationId}
							networks={selectedNetworks}
							tags={selectedTags}
							ssidMapping={ssidMapping}
						/>
					)}
			</Card>
		</div>
	);
}
