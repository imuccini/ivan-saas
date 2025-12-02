import { NetworksPageContent } from "@saas/networks/components/NetworksPageContent";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: "Networks",
	};
}

export default function NetworksPage() {
	return <NetworksPageContent />;
}
