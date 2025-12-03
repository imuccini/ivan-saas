import { IoTPageContent } from "@saas/iot/components/IoTPageContent";

export default async function IoTPage({
	params,
}: {
	params: Promise<{ workspaceSlug: string }>;
}) {
	await params;
	return <IoTPageContent />;
}
