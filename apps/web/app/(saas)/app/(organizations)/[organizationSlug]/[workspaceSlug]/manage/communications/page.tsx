import { CommunicationHub } from "@saas/communications/components/CommunicationHub";

export default async function CommunicationsPage({
	params,
}: {
	params: Promise<{ workspaceSlug: string }>;
}) {
	await params; // Satisfy Next.js 15 requirement
	return <CommunicationHub />;
}
