import { CustomFieldsPageContent } from "@saas/custom-fields/components/CustomFieldsPageContent";

export default async function CustomFieldsPage({
	params,
}: {
	params: Promise<{ workspaceSlug: string }>;
}) {
	await params;
	return <CustomFieldsPageContent />;
}
