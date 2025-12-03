import { GuestWifiPageContent } from "@saas/guest-wifi/components/GuestWifiPageContent";

export default async function GuestWifiPage({
	params,
}: {
	params: Promise<{ workspaceSlug: string }>;
}) {
	await params;
	return <GuestWifiPageContent />;
}
