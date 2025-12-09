"use client";

import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { useOrganizationListQuery } from "@saas/organizations/lib/api";
import { NavMain } from "./nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./sidebar";
import { ArrowLeftIcon, GlobeIcon, UserIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

export function SettingsSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const router = useRouter();
	const { activeOrganization } = useActiveOrganization();
	const { data: organizations } = useOrganizationListQuery();

	// Get organization slug from active organization or fallback to first organization
	const organizationSlug =
		activeOrganization?.slug ?? organizations?.[0]?.slug;

	const handleBack = () => {
		const RETURN_URL_KEY = "settings-return-url";
		const returnUrl = sessionStorage.getItem(RETURN_URL_KEY);

		if (returnUrl) {
			// Clear the stored URL and navigate to it
			sessionStorage.removeItem(RETURN_URL_KEY);
			router.push(returnUrl);
		} else {
			// Fallback: go to organization or app root
			if (organizationSlug) {
				router.push(`/app/${organizationSlug}`);
			} else {
				router.push("/app");
			}
		}
	};

	const organizationSettings = organizationSlug
		? [
				{
					title: "Organization Settings",
					url: "#",
					icon: GlobeIcon,
					isActive: pathname.includes(
						`/app/${organizationSlug}/settings`,
					),
					items: [
						{
							title: "General",
							url: `/app/${organizationSlug}/settings/general`,
							isActive:
								pathname ===
									`/app/${organizationSlug}/settings` ||
								pathname ===
									`/app/${organizationSlug}/settings/general`,
						},
						{
							title: "Billing",
							url: `/app/${organizationSlug}/settings/billing`,
							isActive: pathname.includes(
								`/app/${organizationSlug}/settings/billing`,
							),
						},
						{
							title: "Collaborators",
							url: `/app/${organizationSlug}/settings/members`,
							isActive: pathname.includes(
								`/app/${organizationSlug}/settings/members`,
							),
						},
						{
							title: "Workspaces",
							url: `/app/${organizationSlug}/settings/workspaces`,
							isActive: pathname.includes(
								`/app/${organizationSlug}/settings/workspaces`,
							),
						},
						{
							title: "Danger Zone",
							url: `/app/${organizationSlug}/settings/danger-zone`,
							isActive: pathname.includes(
								`/app/${organizationSlug}/settings/danger-zone`,
							),
						},
					],
				},
			]
		: [];

	const accountSettings = [
		{
			title: "Personal Settings",
			url: "#",
			icon: UserIcon,
			isActive:
				pathname.startsWith("/app/settings") &&
				!pathname.includes(`/${organizationSlug}/`),
			items: [
				{
					title: "General",
					url: "/app/settings",
					isActive:
						pathname === "/app/settings" ||
						pathname === "/app/settings/general",
				},
				{
					title: "Security",
					url: "/app/settings/security",
					isActive: pathname.includes("/app/settings/security"),
				},
				{
					title: "Danger Zone",
					url: "/app/settings/danger-zone",
					isActive: pathname.includes("/app/settings/danger-zone"),
				},
			],
		},
	];

	// Always show both groups when available
	const navItems = [...organizationSettings, ...accountSettings];

	return (
		<Sidebar variant="inset" collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							onClick={handleBack}
							className="gap-2"
							type="button"
						>
							<ArrowLeftIcon className="size-4" />
							<span className="font-semibold">Settings</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navItems} collapsible="manual" />
			</SidebarContent>
		</Sidebar>
	);
}
