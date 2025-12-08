"use client";

import { type VendorId } from "@saas/networks/lib/vendors";
import { IntegrationConfigForm } from "../integration-config-form";

interface Step2Props {
	vendor: string;
	onComplete: (integrationId: string) => void;
}

export function Step2Authentication({ vendor, onComplete }: Step2Props) {
	return (
		<IntegrationConfigForm
			vendor={vendor as VendorId}
			onComplete={onComplete}
		/>
	);
}
