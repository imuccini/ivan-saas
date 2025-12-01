"use client";

import { useSession } from "@saas/auth/hooks/use-session";
import { Logo } from "@shared/components/Logo";
import { NavUser } from "@ui/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@ui/components/sidebar";
import { Building2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UnifiedWorkspaceSwitcher } from "../../saas/shared/components/UnifiedWorkspaceSwitcher";

export function SuperAdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const { user } = useSession();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<div className="flex h-12 items-center px-4">
					<Logo />
				</div>
				<div className="px-2">
					<UnifiedWorkspaceSwitcher isSidebar />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={
										pathname === "/app" ||
										pathname.startsWith(
											"/app/admin/organizations",
										)
									}
									tooltip="Organizations"
								>
									<Link href="/app">
										<Building2Icon />
										<span>Organizations</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
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
