import { IntegrationsPageContent } from "@saas/integrations/components/IntegrationsPageContent";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: "Integrations",
	};
}

export default function IntegrationsPage() {
	return <IntegrationsPageContent />;
}
