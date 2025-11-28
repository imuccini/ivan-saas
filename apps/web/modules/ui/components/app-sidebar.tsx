"use client"

import * as React from "react"
import {
  BotMessageSquareIcon,
  HomeIcon,
  SettingsIcon,
  UserCog2Icon,
  UserCogIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

import { config } from "@repo/config"
import { useSession } from "@saas/auth/hooks/use-session"
import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization"
import { NavMain } from "@ui/components/nav-main"
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
  const t = useTranslations()
  const pathname = usePathname()
  const { user } = useSession()
  const { activeOrganization } = useActiveOrganization()

  const basePath = activeOrganization
    ? `/app/${activeOrganization.slug}`
    : "/app"

  const navMain = [
    {
      title: t("app.menu.start"),
      url: basePath,
      icon: HomeIcon,
      isActive: pathname === basePath,
    },
    {
      title: t("app.menu.aiChatbot"),
      url: activeOrganization
        ? `/app/${activeOrganization.slug}/chatbot`
        : "/app/chatbot",
      icon: BotMessageSquareIcon,
      isActive: pathname.includes("/chatbot"),
    },
    ...(activeOrganization && !config.organizations.hideOrganization
      ? [
          {
            title: t("app.menu.organizationSettings"),
            url: `${basePath}/settings`,
            icon: SettingsIcon,
            isActive: pathname.startsWith(`${basePath}/settings/`),
          },
        ]
      : []),
    {
      title: t("app.menu.accountSettings"),
      url: "/app/settings",
      icon: UserCog2Icon,
      isActive: pathname.startsWith("/app/settings/"),
    },
    ...(user?.role === "admin"
      ? [
          {
            title: t("app.menu.admin"),
            url: "/app/admin",
            icon: UserCogIcon,
            isActive: pathname.startsWith("/app/admin/"),
          },
        ]
      : []),
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
             <UnifiedWorkspaceSwitcher isSidebar />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
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
