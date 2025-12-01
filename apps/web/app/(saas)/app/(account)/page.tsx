import { getOrganizationList, getSession } from "@saas/auth/lib/server";
import { UserOrganizationList } from "@saas/organizations/components/UserOrganizationList";
import { PageHeader } from "@saas/shared/components/PageHeader";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function AppStartPage() {
	const session = await getSession();

	if (!session) {
		redirect("/auth/login");
	}

	const organizations = await getOrganizationList();
	const t = await getTranslations();

	return (
		<div className="container py-8">
			<PageHeader
				title={t("start.welcome", { name: session?.user.name })}
				subtitle={t("start.subtitle")}
			/>

			<div className="mt-8">
				<UserOrganizationList organizations={organizations} />
			</div>
		</div>
	);
}
