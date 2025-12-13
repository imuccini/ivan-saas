"use client";

import {
	getAllIdpVendors,
	getAvailableIdpVendors,
	type IdpId,
} from "@saas/integrations/lib/identity-providers";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { cn } from "@ui/lib";
import { Check } from "lucide-react";

interface VendorSelectionStepProps {
	onSelect: (vendorId: IdpId) => void;
}

export function VendorSelectionStep({ onSelect }: VendorSelectionStepProps) {
	const vendors = getAllIdpVendors();

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Select Identity Provider</h3>
				<p className="text-sm text-muted-foreground">
					Choose the identity provider you want to connect to.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{vendors.map((vendor) => (
					<VendorCard
						key={vendor.id}
						vendor={vendor}
						onSelect={() => !vendor.comingSoon && onSelect(vendor.id)}
					/>
				))}
			</div>
		</div>
	);
}

function VendorCard({
	vendor,
	onSelect,
}: {
	vendor: any;
	onSelect: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onSelect}
			disabled={vendor.comingSoon}
			className={cn(
				"relative flex flex-col items-start gap-4 p-4 text-left rounded-lg border bg-card transition-all hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed",
				!vendor.comingSoon && "hover:border-primary",
			)}
		>
			<div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-background p-2">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={vendor.logo}
					alt={vendor.name}
					className="h-full w-full object-contain"
				/>
			</div>
			<div className="space-y-1">
				<h4 className="font-semibold leading-none">{vendor.name}</h4>
				<p className="text-sm text-muted-foreground line-clamp-2">
					{vendor.description}
				</p>
			</div>
			{vendor.comingSoon && (
				<Badge
					variant="secondary"
					className="absolute top-4 right-4 text-[10px]"
				>
					Soon
				</Badge>
			)}
		</button>
	);
}
