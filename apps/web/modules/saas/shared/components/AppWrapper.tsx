"use client";

import { config } from "@repo/config";
import { NavBar } from "@saas/shared/components/NavBar";
import { cn } from "@ui/lib";
import { AppSidebar } from "@ui/components/app-sidebar";
import { RightPanel } from "@ui/components/right-panel";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@ui/components/sidebar";
import { Separator } from "@ui/components/separator";
import { type PropsWithChildren, useEffect, useState } from "react";
import * as React from "react";

function AppLayout({ children }: PropsWithChildren) {
  const { setOpen, open } = useSidebar();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const insetRef = React.useRef<HTMLElement>(null);

  // Auto-collapse sidebar based on SidebarInset width
  useEffect(() => {
    const insetElement = insetRef.current;
    if (!insetElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width < 900 && open) {
          setOpen(false);
        } else if (width >= 900 && !open) {
          setOpen(true);
        }
      }
    });

    resizeObserver.observe(insetElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [setOpen, open]);

  useEffect(() => {
    const checkResponsive = () => {
      if (isChatOpen && window.innerWidth < 1024) {
        setOpen(false);
      }
    };

    // Check on mount/update
    checkResponsive();

    window.addEventListener("resize", checkResponsive);
    return () => window.removeEventListener("resize", checkResponsive);
  }, [isChatOpen, setOpen]);

  return (
    <>
      <SidebarInset ref={insetRef}>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
      <RightPanel isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  );
}

export function AppWrapper({ children }: PropsWithChildren) {
  if (config.ui.saas.useSidebarLayout) {
    return (
      <SidebarProvider storageKey="left_sidebar">
        <AppSidebar />
        <AppLayout>{children}</AppLayout>
      </SidebarProvider>
    );
  }

  return (
    <div
      className={cn(
        "bg-[radial-gradient(farthest-corner_at_0%_0%,color-mix(in_oklch,var(--color-primary),transparent_95%)_0%,var(--color-background)_50%)] dark:bg-[radial-gradient(farthest-corner_at_0%_0%,color-mix(in_oklch,var(--color-primary),transparent_90%)_0%,var(--color-background)_50%)]",
      )}
    >
      <NavBar />
      <div className="flex py-4 md:pr-4">
        <main className="min-h-full w-full rounded-2xl border bg-card px-4 py-6 md:p-8">
          <div className="container px-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
