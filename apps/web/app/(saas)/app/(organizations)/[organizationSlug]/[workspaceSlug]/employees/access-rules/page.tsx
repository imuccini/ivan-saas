import { AccessRulesPageContent } from "@saas/employees/components/AccessRulesPageContent";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: "Access Rules",
	};
}

export default function AccessRulesPage() {
	return <AccessRulesPageContent />;
}
