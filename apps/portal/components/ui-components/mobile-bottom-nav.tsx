"use client";

import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { Button } from "./button";
import { useSidebar } from "./sidebar";
import { cn } from "./lib";
import { BrainIcon, MenuIcon, RocketIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileBottomNavProps {
	onOpenChat: () => void;
}

export function MobileBottomNav({ onOpenChat }: MobileBottomNavProps) {
	const pathname = usePathname();
	const { setOpenMobile } = useSidebar();
	const { activeOrganization } = useActiveOrganization();
	const { activeWorkspace } = useActiveWorkspace();

	const workspaceSlug = activeWorkspace?.slug ?? "";
	const basePath = activeOrganization
		? `/app/${activeOrganization.slug}/${workspaceSlug}`
		: "/app";

	const isLaunchpadActive = pathname === basePath;

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around bg-background/95 backdrop-blur-sm border-t h-16 safe-area-inset-bottom">
			{/* Launchpad */}
			<Link
				href={basePath}
				className={cn(
					"flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
					isLaunchpadActive
						? "text-primary"
						: "text-muted-foreground hover:text-foreground"
				)}
			>
				<RocketIcon className="size-5" />
				<span className="text-xs font-medium">Launchpad</span>
			</Link>

			{/* AI Assistant */}
			<button
				type="button"
				onClick={onOpenChat}
				className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-muted-foreground hover:text-foreground transition-colors"
			>
				<BrainIcon className="size-5" />
				<span className="text-xs font-medium">AI Assistant</span>
			</button>

			{/* Menu */}
			<button
				type="button"
				onClick={() => setOpenMobile(true)}
				className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-muted-foreground hover:text-foreground transition-colors"
			>
				<MenuIcon className="size-5" />
				<span className="text-xs font-medium">Menu</span>
			</button>
		</nav>
	);
}
