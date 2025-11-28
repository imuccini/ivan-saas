"use client";

import { PageHeader } from "@saas/shared/components/PageHeader";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { Card } from "@ui/components/card";

export default function WorkspacePage() {
	const { activeWorkspace } = useActiveWorkspace();

	if (!activeWorkspace) {
		return null;
	}

	return (
		<div>
			<PageHeader
				title={activeWorkspace.name}
				subtitle="Workspace Dashboard"
			/>

			<Card className="mt-6">
				<div className="flex h-64 items-center justify-center p-8 text-foreground/60">
					Workspace content goes here...
				</div>
			</Card>
		</div>
	);
}
