"use client";

import { config } from "@repo/config";
import { NavBar } from "@saas/shared/components/NavBar";
import { cn } from "@ui/lib";
import type { PropsWithChildren } from "react";
import { AppSidebar } from "@ui/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@ui/components/sidebar"
import { Separator } from "@ui/components/separator"

export function AppWrapper({ children }: PropsWithChildren) {
  if (config.ui.saas.useSidebarLayout) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <div
      className={cn(
        "bg-[radial-gradient(farthest-corner_at_0%_0%,color-mix(in_oklch,var(--color-primary),transparent_95%)_0%,var(--color-background)_50%)] dark:bg-[radial-gradient(farthest-corner_at_0%_0%,color-mix(in_oklch,var(--color-primary),transparent_90%)_0%,var(--color-background)_50%)]",
      )}
    >
      <NavBar />
      <div className="md:pr-4 py-4 flex">
        <main className="py-6 border rounded-2xl bg-card px-4 md:p-8 min-h-full w-full">
          <div className="container px-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
