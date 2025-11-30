"use client"

import * as React from "react"
import {
  ActivityIcon,
  ClockIcon,
  CpuIcon,
  RocketIcon,
  Settings2Icon,
  ShieldCheckIcon,
  WifiIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"

import { useSession } from "@saas/auth/hooks/use-session"
import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization"
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace"
import { NavMain } from "@ui/components/nav-main"
import { NavSecondary } from "@ui/components/nav-secondary"
import { NavUser } from "@ui/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@ui/components/sidebar"
import { UnifiedWorkspaceSwitcher } from "@saas/shared/components/UnifiedWorkspaceSwitcher"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useSession()
  const { activeOrganization } = useActiveOrganization()
  const { activeWorkspace } = useActiveWorkspace()

  const workspaceSlug = activeWorkspace?.slug ?? ""
  const basePath = activeOrganization
    ? `/app/${activeOrganization.slug}/${workspaceSlug}`
    : "/app"

  const navLaunchpad = [
    {
      title: "Launchpad",
      url: basePath,
      icon: ActivityIcon,
      isActive: pathname === basePath,
    },
  ]

  const navMain = [
    {
      title: "Guest WiFi",
      url: `${basePath}/guest-wifi`,
      icon: WifiIcon,
      isActive: pathname.startsWith(`${basePath}/guest-wifi`),
    },
    {
      title: "Employees",
      url: "#",
      icon: ShieldCheckIcon,
      items: [
        { title: "Directory", url: `${basePath}/employees/directory`, isActive: pathname === `${basePath}/employees/directory` },
        { title: "Access Rules", url: `${basePath}/employees/access-rules`, isActive: pathname === `${basePath}/employees/access-rules` },
        { title: "BYOD", url: `${basePath}/employees/byod`, isActive: pathname === `${basePath}/employees/byod` },
        { title: "Managed Devices", url: `${basePath}/employees/managed-devices`, isActive: pathname === `${basePath}/employees/managed-devices` },
      ],
    },
    {
      title: "IoT",
      url: `${basePath}/iot`,
      icon: CpuIcon,
      isActive: pathname.startsWith(`${basePath}/iot`),
    },
  ]

  const navOperations = [
    {
      title: "Monitor",
      url: "#",
      icon: ClockIcon,
      items: [
        { title: "Performances", url: `${basePath}/monitor/performances`, isActive: pathname === `${basePath}/monitor/performances` },
        { title: "Health", url: `${basePath}/monitor/health`, isActive: pathname === `${basePath}/monitor/health` },
        { title: "Logs", url: `${basePath}/monitor/logs`, isActive: pathname === `${basePath}/monitor/logs` },
      ],
    },
    {
      title: "Manage",
      url: "#",
      icon: Settings2Icon,
      items: [
        { title: "Users & Devices", url: `${basePath}/manage/users-devices`, isActive: pathname === `${basePath}/manage/users-devices` },
        { title: "Networks", url: `${basePath}/manage/networks`, isActive: pathname === `${basePath}/manage/networks` },
        { title: "Integrations", url: `${basePath}/manage/integrations`, isActive: pathname === `${basePath}/manage/integrations` },
      ],
    },
  ]

  const navSecondary = [
    {
      title: "Upgrade to Pro",
      url: "#",
      icon: RocketIcon,
      isActive: false,
    },
  ]

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
             <UnifiedWorkspaceSwitcher isSidebar />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navLaunchpad} />
        <NavMain items={navMain} />
        <NavMain items={navOperations} />
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
  )
}
