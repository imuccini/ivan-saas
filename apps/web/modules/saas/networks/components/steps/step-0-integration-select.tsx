"use client";

import { NETWORK_VENDORS } from "@saas/networks/lib/vendors";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { CheckCircle2Icon, PlusIcon, WifiIcon } from "lucide-react";

interface Step0Props {
	onSelectExisting: (integrationId: string) => void;
	onCreateNew: () => void;
}

export function Step0IntegrationSelect({
	onSelectExisting,
	onCreateNew,
}: Step0Props) {
	const { activeWorkspace } = useActiveWorkspace();

	// Fetch existing integrations
	const { data: integrations, isLoading } = useQuery({
		...orpc.integrations.list.queryOptions({
			input: {
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled: !!activeWorkspace?.id,
	});

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold">Select Network Integration</h2>
				<p className="text-muted-foreground">
					Choose an existing integration or create a new one
				</p>
			</div>

			{isLoading ? (
				<div className="py-12 text-center text-muted-foreground">
					Loading integrations...
				</div>
			) : integrations && integrations.length > 0 ? (
				<div className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{integrations.map((integration) => {
							const vendor = integration.provider
								? NETWORK_VENDORS[
										integration.provider as keyof typeof NETWORK_VENDORS
									]
								: null;

							return (
								<button
									key={integration.id}
									type="button"
									onClick={() => onSelectExisting(integration.id)}
									className="group relative rounded-lg border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-md"
								>
									<div className="flex items-start gap-4">
										<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 p-2">
											{vendor?.logo ? (
												<img
													src={vendor.logo}
													alt={vendor.name}
													className="h-full w-full object-contain"
												/>
											) : (
												<WifiIcon className="size-6" />
											)}
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<h3 className="font-semibold">{integration.name}</h3>
												<span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
													<CheckCircle2Icon className="size-3" />
													Synced
												</span>
											</div>
											{vendor && (
												<p className="mt-1 text-sm text-muted-foreground">
													{vendor.name}
												</p>
											)}
											{integration.createdAt && (
												<p className="mt-1 text-xs text-muted-foreground">
													Added{" "}
													{new Date(integration.createdAt).toLocaleDateString()}
												</p>
											)}
										</div>
									</div>

									<div className="mt-4 flex items-center gap-4 border-t pt-4 text-sm text-muted-foreground">
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
												<title>Networks</title>
												<rect width="16" height="16" x="4" y="4" rx="2" />
												<rect width="6" height="6" x="9" y="9" rx="1" />
												<path d="M15 2v2" />
												<path d="M15 20v2" />
												<path d="M2 15h2" />
												<path d="M2 9h2" />
												<path d="M20 15h2" />
												<path d="M20 9h2" />
												<path d="M9 2v2" />
												<path d="M9 20v2" />
											</svg>
											<span>
												{(integration as any).networkCount || 0} Networks
											</span>
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</div>
			) : (
				<div className="rounded-lg border border-dashed p-12 text-center">
					<WifiIcon className="mx-auto size-12 text-muted-foreground/50" />
					<h3 className="mt-4 font-semibold">No integrations yet</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Create your first network integration to get started
					</p>
				</div>
			)}

			<div className="border-t pt-6">
				<Button onClick={onCreateNew} variant="outline" className="w-full">
					<PlusIcon className="mr-2 size-4" />
					Create New Integration
				</Button>
			</div>
		</div>
	);
}
