"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Settings,
  LayoutGrid,
  Book,
  Home
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuPortal
} from "@ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@ui/components/sidebar"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { authClient } from "@repo/auth/client"
import { config } from "@repo/config"
import Link from "next/link"
import { useState } from "react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const t = useTranslations()
  const { setTheme: setCurrentTheme, theme: currentTheme } = useTheme()
  const [theme, setTheme] = useState<string>(currentTheme ?? "system")

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          window.location.href = new URL(
            config.auth.redirectAfterLogout,
            window.location.origin,
          ).toString()
        },
      },
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
             <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Sun className="mr-2 size-4" />
                {t("app.userMenu.colorMode")}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => {
                      setTheme(value)
                      setCurrentTheme(value)
                    }}
                  >
                    <DropdownMenuRadioItem value="system">
                      <Laptop className="mr-2 size-4 opacity-50" />
                      System
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">
                      <Sun className="mr-2 size-4 opacity-50" />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <Moon className="mr-2 size-4 opacity-50" />
                      Dark
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/app">
                  <LayoutGrid className="mr-2 size-4" />
                  Workspaces
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/settings/general">
                  <Settings className="mr-2 size-4" />
                  {t("app.userMenu.accountSettings")}
                </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <a href="https://supastarter.dev/docs/nextjs">
                  <Book className="mr-2 size-4" />
                  {t("app.userMenu.documentation")}
                </a>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/">
                  <Home className="mr-2 size-4" />
                  {t("app.userMenu.home")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 size-4" />
              {t("app.userMenu.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
