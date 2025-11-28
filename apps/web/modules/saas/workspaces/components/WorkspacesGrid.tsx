"use client";

import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { useCreateWorkspaceMutation, useWorkspaceListQuery } from "../lib/api";
import { Card } from "@ui/components/card";
import Link from "next/link";
import { Button } from "@ui/components/button";
import { PlusIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@ui/components/input";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@ui/components/dialog";

export function WorkspacesGrid() {
	const { activeOrganization } = useActiveOrganization();
	const { data: workspaces, refetch } = useWorkspaceListQuery(
		activeOrganization?.id ?? "",
	);
	const { mutateAsync: createWorkspace, isPending } =
		useCreateWorkspaceMutation();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newWorkspaceName, setNewWorkspaceName] = useState("");

	const handleCreateWorkspace = async () => {
		try {
			if (!activeOrganization) return;
			await createWorkspace({
				name: newWorkspaceName,
				organizationId: activeOrganization.id,
			});
			await refetch();
			setIsDialogOpen(false);
			setNewWorkspaceName("");
			toast.success("Workspace created successfully");
		} catch (error) {
			toast.error("Failed to create workspace");
		}
	};

	if (!activeOrganization) {
		return null;
	}

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Workspaces</h2>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<PlusIcon className="mr-2 size-4" />
							Create Workspace
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Workspace</DialogTitle>
							<DialogDescription>
								Create a new workspace to organize your
								projects.
							</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<Input
								placeholder="Workspace Name"
								value={newWorkspaceName}
								onChange={(e) =>
									setNewWorkspaceName(e.target.value)
								}
							/>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleCreateWorkspace}
								disabled={isPending || !newWorkspaceName}
							>
								{isPending ? "Creating..." : "Create"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{workspaces?.map((workspace) => (
					<Link
						key={workspace.id}
						href={`/app/${activeOrganization.slug}/${workspace.slug}`}
						className="block"
					>
						<Card className="flex h-full flex-col justify-between p-6 transition-colors hover:bg-muted/50">
							<div>
								<h3 className="font-semibold text-lg">
									{workspace.name}
								</h3>
							</div>
							<div className="mt-4 flex items-center text-primary text-sm">
								Open Workspace
								<ArrowRightIcon className="ml-2 size-4" />
							</div>
						</Card>
					</Link>
				))}

				{workspaces?.length === 0 && (
					<div className="col-span-full py-12 text-center text-muted-foreground">
						No workspaces found. Create one to get started.
					</div>
				)}
			</div>
		</div>
	);
}
