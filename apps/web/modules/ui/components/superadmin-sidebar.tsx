"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
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

	return (
		<Sidebar collapsible="icon" {...props}>
			<div className="flex h-12 items-center px-4">
				<UnifiedWorkspaceSwitcher isSidebar />
			</div>
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
		</Sidebar>
	);
}
