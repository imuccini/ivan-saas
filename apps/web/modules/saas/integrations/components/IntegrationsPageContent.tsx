"use client";

import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import {
	CheckCircle2Icon,
	MoreVerticalIcon,
	PlusIcon,
	SearchIcon,
	ShieldIcon,
	WifiIcon,
	ZapIcon,
} from "lucide-react";
import { useState } from "react";

// Mock data for integrations
const MOCK_INTEGRATIONS = [
	{
		id: "1",
		name: "Microsoft Entra ID",
		category: "identity-providers",
		logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
		status: "synced",
		domain: "@corpornation.com",
		users: 541,
		groups: 5,
	},
	// Add more mock integrations as needed
];

const CATEGORIES = [
	{ id: "all", label: "All", icon: ZapIcon },
	{ id: "identity-providers", label: "Identity Providers", icon: ShieldIcon },
	{ id: "networks", label: "Networks", icon: WifiIcon },
	{ id: "marketing", label: "Marketing", icon: ZapIcon },
];

interface IntegrationCardProps {
	integration: (typeof MOCK_INTEGRATIONS)[0];
}

function IntegrationCard({ integration }: IntegrationCardProps) {
	return (
		<div className="group relative rounded-lg border bg-card p-6 transition-shadow hover:shadow-md">
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-4">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<img
							src={integration.logo}
							alt={integration.name}
							className="size-8 object-contain"
						/>
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold">
								{integration.name}
							</h3>
							{integration.status === "synced" && (
								<span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
									<CheckCircle2Icon className="size-3" />
									Synced
								</span>
							)}
						</div>
						{integration.domain && (
							<p className="mt-1 text-sm text-muted-foreground">
								{integration.domain}
							</p>
						)}
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="opacity-0 transition-opacity group-hover:opacity-100"
				>
					<MoreVerticalIcon className="size-4" />
				</Button>
			</div>

			{(integration.users || integration.groups) && (
				<div className="mt-4 flex items-center gap-4 border-t pt-4 text-sm text-muted-foreground">
					{integration.users && (
						<div className="flex items-center gap-1.5">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
							<span>{integration.users} Users</span>
						</div>
					)}
					{integration.groups && (
						<div className="flex items-center gap-1.5">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
							<span>{integration.groups} groups</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export function IntegrationsPageContent() {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("identity-providers");

	const filteredIntegrations = MOCK_INTEGRATIONS.filter((integration) => {
		const matchesSearch = integration.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesCategory =
			activeCategory === "all" || integration.category === activeCategory;
		return matchesSearch && matchesCategory;
	});

	const getCategoryLabel = (categoryId: string) => {
		return CATEGORIES.find((c) => c.id === categoryId)?.label || categoryId;
	};

	return (
		<div className="space-y-6">
			<Tabs value={activeCategory} onValueChange={setActiveCategory}>
				<div className="flex items-center justify-between">
					<TabsList>
						{CATEGORIES.map((category) => (
							<TabsTrigger key={category.id} value={category.id}>
								{category.label}
							</TabsTrigger>
						))}
					</TabsList>

					<div className="relative w-64">
						<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
				</div>

				{CATEGORIES.map((category) => (
					<TabsContent
						key={category.id}
						value={category.id}
						className="mt-6"
					>
						<div className="space-y-6">
							{/* Category Section */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<h2 className="text-2xl font-semibold">
											{getCategoryLabel(category.id)}
										</h2>
										<p className="mt-1 text-sm text-muted-foreground">
											{category.id ===
												"identity-providers" &&
												"Manage identity providers for employee authentication"}
											{category.id === "networks" &&
												"Configure network integrations and connectivity"}
											{category.id === "marketing" &&
												"Connect marketing tools and analytics platforms"}
											{category.id === "all" &&
												"View all active integrations across categories"}
										</p>
									</div>
									<Button>
										<PlusIcon className="mr-2 size-4" />
										Add{" "}
										{getCategoryLabel(category.id).slice(
											0,
											-1,
										)}
									</Button>
								</div>

								{/* Integrations Grid */}
								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
									{filteredIntegrations.length > 0 ? (
										filteredIntegrations.map(
											(integration) => (
												<IntegrationCard
													key={integration.id}
													integration={integration}
												/>
											),
										)
									) : (
										<div className="col-span-full py-12 text-center text-muted-foreground">
											No integrations found
										</div>
									)}
								</div>
							</div>

							{/* Information Section (only for identity providers) */}
							{category.id === "identity-providers" && (
								<div className="space-y-4 rounded-lg border bg-muted/50 p-6">
									<h3 className="text-lg font-semibold">
										Identity Provider Configuration
									</h3>
									<p className="text-sm text-muted-foreground">
										Identity providers authenticate
										employees and sync user directories for
										access control
									</p>

									<div className="grid gap-6 md:grid-cols-3">
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<ShieldIcon className="size-5" />
												<h4 className="font-medium">
													Authentication
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												Employees sign in using their
												corporate credentials from
												connected identity providers
											</p>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
													<path d="M22 12A10 10 0 0 0 12 2v10z" />
												</svg>
												<h4 className="font-medium">
													Directory Sync
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												User and group information is
												automatically synchronized from
												your identity provider
											</p>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<rect
														width="18"
														height="11"
														x="3"
														y="11"
														rx="2"
														ry="2"
													/>
													<path d="M7 11V7a5 5 0 0 1 10 0v4" />
												</svg>
												<h4 className="font-medium">
													Access Control
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												Use synced groups to create
												access rules and manage network
												permissions
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
