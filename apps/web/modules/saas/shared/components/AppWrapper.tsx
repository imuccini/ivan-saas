"use client";

import { config } from "@repo/config";
import { NavBar } from "@saas/shared/components/NavBar";
import { WorkspaceServicesProvider } from "@saas/workspaces/components/WorkspaceServicesProvider";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { AppSidebar } from "@ui/components/app-sidebar";
import { MobileBottomNav } from "@ui/components/mobile-bottom-nav";
import { MobileChatDrawer } from "@ui/components/mobile-chat-drawer";
import { RightPanel } from "@ui/components/right-panel";
import { SettingsSidebar } from "@ui/components/settings-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	useSidebar,
} from "@ui/components/sidebar";
import { SuperAdminSidebar } from "@ui/components/superadmin-sidebar";
import { cn } from "@ui/lib";
import { usePathname } from "next/navigation";
import * as React from "react";
import { type PropsWithChildren, useEffect, useState } from "react";

function AppLayout({ children }: PropsWithChildren) {
	const { setOpen, open, isMobile } = useSidebar();
	const { activeWorkspace, isLoading: isWorkspaceLoading } =
		useActiveWorkspace();
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [initialMessage, setInitialMessage] = useState("");
	const insetRef = React.useRef<HTMLElement>(null);
	const pathname = usePathname();

	const openRef = React.useRef(open);

	// Determine if we should show loading overlay
	// Show loader by default until workspace is confirmed (not just while loading)
	// Don't show on superadmin routes
	const isSuperAdminRoute =
		pathname === "/app" || pathname.startsWith("/app/admin");
	const shouldShowLoadingOverlay =
		!isSuperAdminRoute && (isWorkspaceLoading || !activeWorkspace);

	// Handler to open AI chat from mobile bottom nav
	const handleOpenChat = React.useCallback(() => {
		setIsChatOpen(true);
	}, []);

	// Keep ref in sync with state
	React.useEffect(() => {
		openRef.current = open;
	}, [open]);

	/**
	 * UNIFIED SIDEBAR MANAGEMENT WITH HYSTERESIS
	 *
	 * PRIORITY 1: Chat Panel Override
	 * - When chat is open AND viewport too small → FORCE sidebar closed
	 *
	 * PRIORITY 2: Viewport Width with HYSTERESIS
	 * - Close at < 1060px (lower threshold)
	 * - Open at >= 1300px (upper threshold)
	 * - Between 1060-1300px: maintain current state (prevents bouncing)
	 *
	 * DEBOUNCING: 150ms delay prevents rapid toggling during resize
	 */
	useEffect(() => {
		let debounceTimeout: NodeJS.Timeout;

		const evaluateSidebarState = () => {
			clearTimeout(debounceTimeout);
			debounceTimeout = setTimeout(() => {
				const viewportWidth = window.innerWidth;
				const currentOpen = openRef.current;

				// PRIORITY 1: Chat panel takes absolute precedence
				if (isChatOpen && viewportWidth < 1200) {
					if (currentOpen) {
						setOpen(false);
					}
					return; // Exit early - don't evaluate other rules while chat is open
				}

				// PRIORITY 2: Viewport width with HYSTERESIS
				if (viewportWidth < 1060 && currentOpen) {
					// Viewport too narrow - close sidebar
					setOpen(false);
				} else if (
					viewportWidth >= 1300 &&
					!currentOpen &&
					!isChatOpen
				) {
					// Viewport wide enough and chat not open - open sidebar
					setOpen(true);
				}
				// Between 1060-1300px: maintain current state (no change)
			}, 150);
		};

		// Watch for window resize events
		window.addEventListener("resize", evaluateSidebarState);

		// Run initial evaluation
		evaluateSidebarState();

		// Cleanup
		return () => {
			clearTimeout(debounceTimeout);
			window.removeEventListener("resize", evaluateSidebarState);
		};
	}, [setOpen, isChatOpen]);

	// Expose chat controls globally for Launchpad to use
	React.useEffect(() => {
		(window as any).openAIChat = (message: string) => {
			setInitialMessage(message);
			setIsChatOpen(true);
		};
		return () => {
			delete (window as any).openAIChat;
		};
	}, []);

	return (
		<>
			<SidebarInset ref={insetRef} className="relative">
				<main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
					{children}
				</main>

				{/* Loading overlay - blocks all interactions while workspace is loading */}
				{shouldShowLoadingOverlay && (
					<div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
						<div className="flex flex-col items-center gap-3">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
							<p className="text-sm text-muted-foreground">
								Loading workspace...
							</p>
						</div>
					</div>
				)}
			</SidebarInset>
			{/* Desktop: Right side panel for AI chat */}
			{!isMobile && (
				<RightPanel
					isOpen={isChatOpen}
					onOpenChange={setIsChatOpen}
					initialMessage={initialMessage}
				/>
			)}
			{/* Mobile: Bottom drawer for AI chat + bottom navigation bar */}
			{isMobile && (
				<>
					<MobileChatDrawer
						isOpen={isChatOpen}
						onOpenChange={setIsChatOpen}
						initialMessage={initialMessage}
					/>
					<MobileBottomNav onOpenChat={handleOpenChat} />
				</>
			)}
		</>
	);
}

export function AppWrapper({ children }: PropsWithChildren) {
	const pathname = usePathname();

	// Check if we're on a settings route
	const isSettingsRoute = pathname.includes("/settings");

	// Check if we're on the superadmin/organization list route
	// This includes /app (exact) and /app/admin/*
	const isSuperAdminRoute =
		pathname === "/app" || pathname.startsWith("/app/admin");

	// Store the return URL when entering settings
	React.useEffect(() => {
		const RETURN_URL_KEY = "settings-return-url";
		const previousUrl = sessionStorage.getItem("previous-url");

		if (
			isSettingsRoute &&
			previousUrl &&
			!previousUrl.includes("/settings")
		) {
			// We just entered settings from a non-settings page
			sessionStorage.setItem(RETURN_URL_KEY, previousUrl);
		}

		// Always store current URL as previous for next navigation
		sessionStorage.setItem("previous-url", pathname);
	}, [pathname, isSettingsRoute]);

	if (config.ui.saas.useSidebarLayout) {
		return (
			<SidebarProvider storageKey="left_sidebar">
				<WorkspaceServicesProvider>
					{isSettingsRoute ? (
						<SettingsSidebar />
					) : isSuperAdminRoute ? (
						<SuperAdminSidebar />
					) : (
						<AppSidebar />
					)}
					<AppLayout>{children}</AppLayout>
				</WorkspaceServicesProvider>
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
