import { db } from "@repo/database";
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

	if (organizations.length === 1) {
		const organization = organizations[0];
		const member = await db.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: organization.id,
					userId: session.user.id,
				},
			},
		});

		if (member) {
			const isOrgAdmin = member.role === "owner" || member.role === "admin";

			const workspace = await db.workspace.findFirst({
				where: {
					organizationId: organization.id,
					...(isOrgAdmin
						? {}
						: {
								workspaceMembers: {
									some: {
										userId: session.user.id,
									},
								},
							}),
				},
				orderBy: {
					createdAt: "asc",
				},
			});

			if (workspace) {
				redirect(`/app/${organization.slug}/${workspace.slug}`);
			}

			redirect(`/app/${organization.slug}/settings/workspaces`);
		}
	}

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
