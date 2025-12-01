"use client";

import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { useWorkspaceListQuery } from "@saas/workspaces/lib/api";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { sidebarMenuButtonVariants } from "@ui/components/sidebar";
import { cn } from "@ui/lib";
import {
	ArrowRightLeftIcon,
	ChevronsUpDownIcon,
	LayoutGridIcon,
	SettingsIcon,
} from "lucide-react";
import Link from "next/link";

export function UnifiedWorkspaceSwitcher({
	className,
	isSidebar,
}: {
	className?: string;
	isSidebar?: boolean;
}) {
	const { activeOrganization } = useActiveOrganization();
	const { activeWorkspace } = useActiveWorkspace();
	const { data: workspaces } = useWorkspaceListQuery(
		activeOrganization?.id ?? "",
	);

	if (!activeOrganization) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className={cn(
						isSidebar
							? sidebarMenuButtonVariants({
									size: "lg",
									variant: "default",
								})
							: "flex items-center gap-2 rounded-md border p-2 text-left hover:bg-accent",
						"data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
						className,
					)}
				>
					<div
						className={cn(
							"flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg",
							isSidebar
								? "bg-sidebar-primary text-sidebar-primary-foreground"
								: "border bg-background",
						)}
					>
						<LayoutGridIcon className="size-4 shrink-0" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">
							{activeWorkspace?.name ??
								workspaces?.[0]?.name ??
								"Select Workspace"}
						</span>
						<span className="truncate text-xs">
							{activeOrganization.name}
						</span>
					</div>
					<ChevronsUpDownIcon className="ml-auto size-4 opacity-50" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				align="start"
				side="bottom"
				sideOffset={4}
			>
				<DropdownMenuLabel className="text-xs text-muted-foreground">
					Workspaces
				</DropdownMenuLabel>
				{workspaces?.map((workspace) => (
					<Link
						key={workspace.id}
						href={`/app/${activeOrganization.slug}/${workspace.slug}`}
						className="block"
					>
						<DropdownMenuCheckboxItem
							checked={
								workspace.slug ===
								(activeWorkspace?.slug ?? workspaces?.[0]?.slug)
							}
							className="gap-2 py-2"
						>
							{workspace.name}
						</DropdownMenuCheckboxItem>
					</Link>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuLabel className="text-xs text-muted-foreground">
					{activeOrganization.name}
				</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link
							href={`/app/${activeOrganization.slug}/settings`}
							className="gap-2 p-2"
						>
							<SettingsIcon className="size-4" />
							Organization Settings
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link
							href={`/app/${activeOrganization.slug}/settings/workspaces`}
							className="gap-2 p-2"
						>
							<LayoutGridIcon className="size-4" />
							Workspaces
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/app" className="gap-2 p-2">
						<ArrowRightLeftIcon className="size-4" />
						Switch Organization
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
