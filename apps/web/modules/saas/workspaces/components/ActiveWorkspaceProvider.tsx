"use client";

import { useParams } from "next/navigation";
import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import { ActiveWorkspaceContext } from "../lib/active-workspace-context";
import { useWorkspaceListQuery } from "../lib/api";
import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";

export function ActiveWorkspaceProvider({ children }: PropsWithChildren) {
	const params = useParams();
	const workspaceSlug = params.workspaceSlug as string;
	const { activeOrganization } = useActiveOrganization();

	const { data: workspaces, isLoading } = useWorkspaceListQuery(
		activeOrganization?.id ?? "",
	);

	// Persist active workspace slug
	const [lastActiveSlug, setLastActiveSlug] = useState<string | null>(null);

	useEffect(() => {
		if (workspaceSlug) {
			setLastActiveSlug(workspaceSlug);
			if (activeOrganization?.id) {
				localStorage.setItem(
					`lastActiveWorkspaceSlug-${activeOrganization.id}`,
					workspaceSlug,
				);
			}
		} else if (activeOrganization?.id) {
			const stored = localStorage.getItem(
				`lastActiveWorkspaceSlug-${activeOrganization.id}`,
			);
			if (stored) {
				setLastActiveSlug(stored);
			}
		}
	}, [workspaceSlug, activeOrganization?.id]);

	const activeWorkspace = useMemo(() => {
		if (!workspaces) {
			return null;
		}

		// Prioritize URL param, then stored slug, then first workspace
		const slugToFind =
			workspaceSlug || lastActiveSlug || workspaces[0]?.slug;

		if (!slugToFind) {
			return null;
		}

		return workspaces.find((w) => w.slug === slugToFind) ?? null;
	}, [workspaces, workspaceSlug, lastActiveSlug]);

	return (
		<ActiveWorkspaceContext.Provider
			value={{
				activeWorkspace,
				isLoading,
			}}
		>
			{children}
		</ActiveWorkspaceContext.Provider>
	);
}
