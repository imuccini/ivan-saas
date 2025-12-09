"use client";

import { useSession } from "@saas/auth/hooks/use-session";

import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { UnifiedWorkspaceSwitcher } from "@saas/shared/components/UnifiedWorkspaceSwitcher";
import { useWorkspaceServices } from "@saas/workspaces/components/WorkspaceServicesProvider";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "./sidebar";
import {
	ActivityIcon,
	ClockIcon,
	CpuIcon,
	RocketIcon,
	Settings2Icon,
	ShieldCheckIcon,
	WifiIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const { user } = useSession();
	const { activeOrganization } = useActiveOrganization();
	const { activeWorkspace, isLoading: isWorkspaceLoading } =
		useActiveWorkspace();
	const [pendingPath, setPendingPath] = React.useState<string | null>(null);

	// Reset pending path when pathname changes (navigation complete)
	React.useEffect(() => {
		setPendingPath(null);
	}, [pathname]);

	const currentPath = pendingPath ?? pathname;

	const workspaceSlug = activeWorkspace?.slug ?? "";
	const basePath = activeOrganization
		? `/app/${activeOrganization.slug}/${workspaceSlug}`
		: "/app";

	// Prevent navigation if workspace is still loading or slug is empty
	const isNavigationDisabled = isWorkspaceLoading || !workspaceSlug;

	// Get enabled services
	const { services } = useWorkspaceServices();

	const navLaunchpad = [
		{
			title: "Launchpad",
			url: basePath,
			icon: ActivityIcon,
			isActive: currentPath === basePath,
		},
	];

	const navMain = [
		services.guestWifi && {
			title: "Guest WiFi",
			url: `${basePath}/guest-wifi`,
			icon: WifiIcon,
			isActive: currentPath.startsWith(`${basePath}/guest-wifi`),
			items: [
				{
					title: "Users & Devices",
					url: `${basePath}/guest-wifi/users-devices`,
					isActive:
						currentPath === `${basePath}/guest-wifi/users-devices`,
				},

				{
					title: "Sponsors",
					url: `${basePath}/guest-wifi/sponsors`,
					isActive: currentPath === `${basePath}/guest-wifi/sponsors`,
				},
				{
					title: "Access Codes",
					url: `${basePath}/guest-wifi/access-codes`,
					isActive:
						currentPath === `${basePath}/guest-wifi/access-codes`,
				},
			],
		},
		services.byod && {
			title: "BYOD",
			url: `${basePath}/employees`,
			icon: ShieldCheckIcon,
			isActive: currentPath.startsWith(`${basePath}/employees`),
			items: [
				{
					title: "Directory",
					url: `${basePath}/employees/directory`,
					isActive: currentPath === `${basePath}/employees/directory`,
				},
				{
					title: "Access Rules",
					url: `${basePath}/employees/access-rules`,
					isActive:
						currentPath === `${basePath}/employees/access-rules`,
				},
				{
					title: "Onboarding",
					url: `${basePath}/employees/onboarding`,
					isActive:
						currentPath === `${basePath}/employees/onboarding`,
				},
				{
					title: "Managed Devices",
					url: `${basePath}/employees/managed-devices`,
					isActive:
						currentPath === `${basePath}/employees/managed-devices`,
				},
			],
		},
		services.iot && {
			title: "IoT",
			url: `${basePath}/iot`,
			icon: CpuIcon,
			isActive: currentPath.startsWith(`${basePath}/iot`),
		},
	].filter((item): item is Exclude<typeof item, false> => Boolean(item));

	const navOperations = [
		{
			title: "Monitor",
			url: "#",
			icon: ClockIcon,
			items: [
				{
					title: "Performances",
					url: `${basePath}/monitor/performances`,
					isActive:
						currentPath === `${basePath}/monitor/performances`,
				},
				{
					title: "Health",
					url: `${basePath}/monitor/health`,
					isActive: currentPath === `${basePath}/monitor/health`,
				},
				{
					title: "Logs",
					url: `${basePath}/monitor/logs`,
					isActive: currentPath === `${basePath}/monitor/logs`,
				},
			],
		},
		{
			title: "Manage",
			url: "#",
			icon: Settings2Icon,
			items: [
				{
					title: "Networks",
					url: `${basePath}/manage/networks`,
					isActive: currentPath === `${basePath}/manage/networks`,
				},
				{
					title: "Integrations",
					url: `${basePath}/manage/integrations`,
					isActive: currentPath === `${basePath}/manage/integrations`,
				},
				{
					title: "Terms",
					url: `${basePath}/manage/terms`,
					isActive: currentPath === `${basePath}/manage/terms`,
				},
				{
					title: "Custom Fields",
					url: `${basePath}/manage/custom-fields`,
					isActive:
						currentPath === `${basePath}/manage/custom-fields`,
				},
				{
					title: "Communications",
					url: `${basePath}/manage/communications`,
					isActive:
						currentPath === `${basePath}/manage/communications`,
				},
				{
					title: "Workspace Settings",
					url: `${basePath}/workspace-settings`,
					isActive: currentPath === `${basePath}/workspace-settings`,
				},
			],
		},
	];

	const navSecondary = [
		{
			title: "Upgrade to Pro",
			url: "#",
			icon: RocketIcon,
			isActive: false,
		},
	];

	return (
		<Sidebar variant="inset" collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<UnifiedWorkspaceSwitcher isSidebar />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent
				className={
					isNavigationDisabled ? "pointer-events-none opacity-50" : ""
				}
			>
				<NavMain
					items={navLaunchpad}
					onNavigate={(url) =>
						!isNavigationDisabled && setPendingPath(url)
					}
				/>
				<NavMain
					items={navMain}
					onNavigate={(url) =>
						!isNavigationDisabled && setPendingPath(url)
					}
				/>
				<NavMain
					items={navOperations}
					onNavigate={(url) =>
						!isNavigationDisabled && setPendingPath(url)
					}
				/>
				<NavSecondary items={navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				{user && (
					<NavUser
						user={{
							name: user.name ?? "",
							email: user.email ?? "",
							avatar: user.image ?? "",
						}}
					/>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
