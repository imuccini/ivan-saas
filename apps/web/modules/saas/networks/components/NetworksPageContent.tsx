"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import {
	CheckCircle2Icon,
	Loader2,
	PlusIcon,
	RadioTowerIcon,
	XCircleIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AddNetworkWizard } from "./add-network-wizard";

const VENDOR_ICONS: Record<string, string> = {
	meraki: "🔷",
	cisco: "🔷",
	aruba: "🟠",
	ubiquiti: "⚡",
	fortigate: "🔴",
	fortiedge: "🔴",
	omada: "🟢",
	ruckus: "🟡",
	mist: "🔵",
};

interface NetworkCardProps {
	network: {
		id: string;
		name: string;
		provisioningStatus: string;
		integration: {
			provider: string;
			name: string;
		};
		// biome-ignore lint/suspicious/noExplicitAny: Config structure varies
		config: any;
	};
}

function NetworkCard({ network }: NetworkCardProps) {
	const isActive = network.provisioningStatus === "active";
	const isPending =
		network.provisioningStatus === "pending" ||
		network.provisioningStatus === "provisioning";
	const isFailed = network.provisioningStatus === "failed";

	// Extract network info from config
	const networkConfig = network.config || {};
	const productTypes = networkConfig.productTypes || [];
	const hasWireless = productTypes.includes("wireless");

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<div className="flex items-start justify-between">
					<CardTitle className="text-lg">{network.name}</CardTitle>
					<Badge
						variant={isActive ? "default" : "secondary"}
						className={
							isActive
								? "bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400"
								: isPending
									? "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-400"
									: isFailed
										? "bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400"
										: "bg-muted text-muted-foreground"
						}
					>
						{isPending ? (
							<Loader2 className="mr-1 size-3 animate-spin" />
						) : isActive ? (
							<CheckCircle2Icon className="mr-1 size-3" />
						) : (
							<XCircleIcon className="mr-1 size-3" />
						)}
						{network.provisioningStatus}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-4">
				{/* Integration Info */}
				<div className="flex items-center gap-2">
					<span className="text-2xl">
						{VENDOR_ICONS[
							network.integration.provider.toLowerCase()
						] || "🔷"}
					</span>
					<div>
						<p className="text-sm font-medium">
							{network.integration.name}
						</p>
						<p className="text-xs text-muted-foreground capitalize">
							{network.integration.provider}
						</p>
					</div>
				</div>

				{/* Network Type */}
				{hasWireless && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<RadioTowerIcon className="size-4" />
						<span>Wireless Network</span>
					</div>
				)}

				{/* Device Tags */}
				{networkConfig.tags && networkConfig.tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{networkConfig.tags.map((tag: string) => (
							<Badge
								key={tag}
								variant="outline"
								className="text-xs"
							>
								{tag}
							</Badge>
						))}
					</div>
				)}

				{/* Edit Button */}
				<Button variant="outline" className="mt-auto w-full">
					Edit Network
				</Button>
			</CardContent>
		</Card>
	);
}

export function NetworksPageContent() {
	const [isWizardOpen, setIsWizardOpen] = useState(false);
	const { activeWorkspace } = useActiveWorkspace();
	const searchParams = useSearchParams();

	// Auto-open wizard if 'add=true' parameter is present
	useEffect(() => {
		if (searchParams.get("add") === "true") {
			setIsWizardOpen(true);
		}
	}, [searchParams]);

	// Fetch networks from database
	const { data: networks, isLoading } = useQuery({
		...orpc.networks.list.queryOptions({
			input: {
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled: !!activeWorkspace?.id,
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Networks</h1>
					<p className="text-muted-foreground">
						Manage your network infrastructure and deployments
					</p>
				</div>
				<Button onClick={() => setIsWizardOpen(true)}>
					<PlusIcon className="mr-2 size-4" />
					Add Network
				</Button>
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			)}

			{/* Empty State */}
			{!isLoading && (!networks || networks.length === 0) && (
				<Card className="p-12">
					<div className="flex flex-col items-center justify-center text-center">
						<RadioTowerIcon className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							No networks yet
						</h3>
						<p className="text-muted-foreground mb-6 max-w-sm">
							Connect your network infrastructure to start
							managing Guest WiFi, IoT, and Employee access.
						</p>
						<Button onClick={() => setIsWizardOpen(true)}>
							<PlusIcon className="mr-2 size-4" />
							Add Your First Network
						</Button>
					</div>
				</Card>
			)}

			{/* Networks Grid */}
			{!isLoading && networks && networks.length > 0 && (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{networks.map((network) => (
						<NetworkCard key={network.id} network={network} />
					))}
				</div>
			)}

			{/* Add Network Wizard */}
			{isWizardOpen && (
				<div className="fixed inset-0 z-50 bg-background overflow-y-auto">
					<AddNetworkWizard onClose={() => setIsWizardOpen(false)} />
				</div>
			)}
		</div>
	);
}
