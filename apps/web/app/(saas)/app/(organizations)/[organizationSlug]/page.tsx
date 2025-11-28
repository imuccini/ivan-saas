"use client";

import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { useWorkspaceListQuery } from "@saas/workspaces/lib/api";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrganizationPage() {
	const { activeOrganization } = useActiveOrganization();
	const { data: workspaces, isLoading } = useWorkspaceListQuery(
		activeOrganization?.id ?? "",
	);
	const router = useRouter();

	useEffect(() => {
		if (isLoading || !activeOrganization) {
			return;
		}

		if (workspaces && workspaces.length > 0) {
			router.replace(
				`/app/${activeOrganization.slug}/${workspaces[0].slug}`,
			);
		} else {
			router.replace(
				`/app/${activeOrganization.slug}/settings/workspaces`,
			);
		}
	}, [activeOrganization, workspaces, isLoading, router]);

	return (
		<div className="flex h-full items-center justify-center">
			<Loader2Icon className="size-8 animate-spin opacity-50" />
		</div>
	);
}
