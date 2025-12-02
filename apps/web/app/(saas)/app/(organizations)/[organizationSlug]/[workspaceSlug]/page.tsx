import { LaunchpadPageContent } from "@saas/launchpad/components/LaunchpadPageContent";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: "Launchpad",
	};
}

export default function WorkspacePage() {
	return <LaunchpadPageContent />;
}
