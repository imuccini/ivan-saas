"use client";

import { cn } from "@ui/lib";

const VENDORS = [
	{
		id: "meraki",
		name: "Cisco Meraki",
		logo: "/images/vendors/meraki.svg",
		available: true,
	},
	{ id: "cisco", name: "Cisco Catalyst", available: false },
	{ id: "aruba", name: "Aruba Central", available: false },
	{ id: "fortigate", name: "Fortigate", available: false },
	{ id: "fortiedge", name: "FortiEdge Cloud", available: false },
	{ id: "omada", name: "TP-Link Omada", available: false },
	{ id: "ruckus", name: "Ruckus One", available: false },
	{ id: "mist", name: "Mist", available: false },
];

interface Step1Props {
	onSelect: (vendor: string) => void;
}

export function Step1VendorSelection({ onSelect }: Step1Props) {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold">Select Vendor</h2>
				<p className="text-muted-foreground">
					Choose the hardware vendor you want to connect.
				</p>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{VENDORS.map((vendor) => (
					<button
						key={vendor.id}
						type="button"
						onClick={() => vendor.available && onSelect(vendor.id)}
						disabled={!vendor.available}
						className={cn(
							"flex flex-col items-center justify-center p-6 border rounded-lg transition-all",
							vendor.available
								? "hover:border-primary hover:bg-accent cursor-pointer"
								: "opacity-50 cursor-not-allowed bg-muted",
						)}
					>
						<div className="h-12 w-12 bg-muted rounded-full mb-3 flex items-center justify-center">
							{/* Placeholder for logo */}
							<span className="text-xs font-bold">
								{vendor.name[0]}
							</span>
						</div>
						<span className="font-medium text-center text-sm">
							{vendor.name}
						</span>
						{!vendor.available && (
							<span className="text-[10px] bg-muted-foreground/20 px-2 py-0.5 rounded-full mt-2">
								Coming Soon
							</span>
						)}
					</button>
				))}
			</div>
		</div>
	);
}
