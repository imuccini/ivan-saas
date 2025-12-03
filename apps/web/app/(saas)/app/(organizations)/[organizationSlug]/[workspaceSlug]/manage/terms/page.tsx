import { TermsPageContent } from "@saas/terms/components/TermsPageContent";

export default async function TermsPage({
	params,
}: {
	params: Promise<{ workspaceSlug: string }>;
}) {
	await params;
	return <TermsPageContent />;
}
