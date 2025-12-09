import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";
import { getPortalConfigById } from "@/lib/config-loader";

interface PortalPageProps {
	params: Promise<{
		organizationId: string;
		workspaceId: string;
		instanceId: string;
	}>;
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export async function generateMetadata({
	params,
}: PortalPageProps): Promise<Metadata> {
	const { organizationId, workspaceId, instanceId } = await params;
	const config = await getPortalConfigById(
		organizationId,
		workspaceId,
		instanceId,
	);

	if (!config) {
		return { title: "Portal Not Found" };
	}

	// Extract title from config if available
	const wizardConfig = config.config as {
		content?: Record<string, { title?: string; description?: string }>;
		selectedLanguages?: string[];
	};
	const defaultLang = wizardConfig.selectedLanguages?.[0] ?? "en";
	const content = wizardConfig.content?.[defaultLang];

	return {
		title: content?.title ?? "Guest WiFi Portal",
		description: content?.description ?? "Connect to our guest network",
		robots: "noindex, nofollow",
	};
}

export default async function PortalPage({ params }: PortalPageProps) {
	const { organizationId, workspaceId, instanceId } = await params;
	const config = await getPortalConfigById(
		organizationId,
		workspaceId,
		instanceId,
	);

	if (!config) {
		notFound();
	}

	return (
		<PortalShell
			config={config.config}
			workspaceId={config.workspaceId}
			customFields={config.customFields}
			sponsors={config.sponsors}
			terms={config.terms}
		/>
	);
}
