"use client";

import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import {
	BotIcon,
	CheckCircle2Icon,
	CircleIcon,
	PlusIcon,
	RadioTowerIcon,
	ShieldCheckIcon,
	WifiIcon,
	XCircleIcon,
} from "lucide-react";

// Mock data for networks
const MOCK_NETWORKS = [
	{
		id: "1",
		name: "HQ Campus Network",
		vendor: "Cisco Meraki",
		status: "connected",
		accessPoints: 24,
		ssids: {
			guestWifi: true,
			iot: true,
			employees: true,
		},
	},
	{
		id: "2",
		name: "Branch Office - NYC",
		vendor: "Ubiquiti UniFi",
		status: "connected",
		accessPoints: 8,
		ssids: {
			guestWifi: true,
			iot: false,
			employees: true,
		},
	},
	{
		id: "3",
		name: "Warehouse Network",
		vendor: "Aruba Instant",
		status: "disconnected",
		accessPoints: 6,
		ssids: {
			guestWifi: false,
			iot: true,
			employees: false,
		},
	},
	{
		id: "4",
		name: "Retail Store - SF",
		vendor: "Cisco Meraki",
		status: "connected",
		accessPoints: 12,
		ssids: {
			guestWifi: true,
			iot: true,
			employees: true,
		},
	},
	{
		id: "5",
		name: "Remote Office - LA",
		vendor: "Ubiquiti UniFi",
		status: "connected",
		accessPoints: 4,
		ssids: {
			guestWifi: true,
			iot: false,
			employees: true,
		},
	},
];

const VENDOR_ICONS: Record<string, string> = {
	"Cisco Meraki": "🔷",
	"Ubiquiti UniFi": "⚡",
	"Aruba Instant": "🟠",
};

interface NetworkCardProps {
	network: (typeof MOCK_NETWORKS)[0];
}

function NetworkCard({ network }: NetworkCardProps) {
	const isConnected = network.status === "connected";

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<div className="flex items-start justify-between">
					<CardTitle className="text-lg">{network.name}</CardTitle>
					<Badge
						variant={isConnected ? "default" : "secondary"}
						className={
							isConnected
								? "bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400"
								: "bg-muted text-muted-foreground"
						}
					>
						{isConnected ? (
							<CheckCircle2Icon className="mr-1 size-3" />
						) : (
							<XCircleIcon className="mr-1 size-3" />
						)}
						{isConnected ? "Connected" : "Disconnected"}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-4">
				{/* Vendor */}
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span className="text-lg">
						{VENDOR_ICONS[network.vendor] || "📡"}
					</span>
					<span>{network.vendor}</span>
				</div>

				{/* Access Points */}
				<div className="flex items-center gap-2 text-sm">
					<RadioTowerIcon className="size-4 text-muted-foreground" />
					<span className="font-medium">
						{network.accessPoints} APs
					</span>
				</div>

				{/* SSIDs */}
				<div className="space-y-2">
					<p className="text-xs font-medium text-muted-foreground">
						Deployed SSIDs
					</p>
					<div className="flex flex-wrap gap-2">
						<Badge
							variant="outline"
							className={
								network.ssids.guestWifi
									? "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400"
									: "opacity-50"
							}
						>
							<WifiIcon className="mr-1 size-3" />
							Guest WiFi
							{network.ssids.guestWifi ? (
								<CheckCircle2Icon className="ml-1 size-3" />
							) : (
								<CircleIcon className="ml-1 size-3" />
							)}
						</Badge>
						<Badge
							variant="outline"
							className={
								network.ssids.iot
									? "border-purple-500/50 bg-purple-500/10 text-purple-600 dark:text-purple-400"
									: "opacity-50"
							}
						>
							<BotIcon className="mr-1 size-3" />
							IoT
							{network.ssids.iot ? (
								<CheckCircle2Icon className="ml-1 size-3" />
							) : (
								<CircleIcon className="ml-1 size-3" />
							)}
						</Badge>
						<Badge
							variant="outline"
							className={
								network.ssids.employees
									? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
									: "opacity-50"
							}
						>
							<ShieldCheckIcon className="mr-1 size-3" />
							Employees
							{network.ssids.employees ? (
								<CheckCircle2Icon className="ml-1 size-3" />
							) : (
								<CircleIcon className="ml-1 size-3" />
							)}
						</Badge>
					</div>
				</div>

				{/* Edit Button */}
				<Button variant="outline" className="mt-auto w-full">
					Edit Network
				</Button>
			</CardContent>
		</Card>
	);
}

export function NetworksPageContent() {
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
				<Button>
					<PlusIcon className="mr-2 size-4" />
					Add Network
				</Button>
			</div>

			{/* Networks Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{MOCK_NETWORKS.map((network) => (
					<NetworkCard key={network.id} network={network} />
				))}
			</div>
		</div>
	);
}
