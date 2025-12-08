"use client";

import { getAllVendors } from "@saas/networks/lib/vendors";
import { cn } from "@ui/lib";

const VENDORS = getAllVendors();

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
						onClick={() => !vendor.comingSoon && onSelect(vendor.id)}
						disabled={vendor.comingSoon}
						className={cn(
							"flex flex-col items-center justify-center p-6 border rounded-lg transition-all",
							!vendor.comingSoon
								? "hover:border-primary hover:bg-accent cursor-pointer"
								: "opacity-50 cursor-not-allowed bg-muted",
						)}
					>
						<div className="h-16 w-16 bg-muted rounded-full mb-3 flex items-center justify-center overflow-hidden">
							{vendor.logo ? (
								<img
									src={vendor.logo}
									alt={vendor.name}
									className="h-full w-full object-contain p-2"
								/>
							) : (
								<span className="text-xl font-bold">
									{vendor.name[0]}
								</span>
							)}
						</div>
						<span className="font-medium text-center text-sm">
							{vendor.name}
						</span>
						{vendor.comingSoon && (
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
