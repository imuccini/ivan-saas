"use client";

import { config } from "@repo/config";
import { NavBar } from "@saas/shared/components/NavBar";
import { AppSidebar } from "@ui/components/app-sidebar";
import { RightPanel } from "@ui/components/right-panel";
import {
	SidebarInset,
	SidebarProvider,
	useSidebar,
} from "@ui/components/sidebar";
import { cn } from "@ui/lib";
import * as React from "react";
import { type PropsWithChildren, useEffect, useState } from "react";

function AppLayout({ children }: PropsWithChildren) {
	const { setOpen, open } = useSidebar();
	const [isChatOpen, setIsChatOpen] = useState(false);
	const insetRef = React.useRef<HTMLElement>(null);

	const openRef = React.useRef(open);

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

	return (
		<>
			<SidebarInset ref={insetRef}>
				<main className="flex-1 overflow-auto p-4 md:p-6">
					{children}
				</main>
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
