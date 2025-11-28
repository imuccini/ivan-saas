"use client";

import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { PageHeader } from "@saas/shared/components/PageHeader";
import { WorkspacesGrid } from "@saas/workspaces/components/WorkspacesGrid";
import { useTranslations } from "next-intl";

export default function WorkspacesSettingsPage() {
	const t = useTranslations();
	const { activeOrganization } = useActiveOrganization();

	if (!activeOrganization) {
		return null;
	}

	return (
		<div>
			<PageHeader
				title="Workspaces"
				subtitle="Manage your workspaces"
			/>

			<WorkspacesGrid />
		</div>
	);
}
