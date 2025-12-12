"use client";

import { Button } from "./ui-components/button";

interface PortalApprovalPendingProps {
	title: string;
	description: string;
	primaryColor: string;
	baseFontSize: string;
	spacing: string;
	onCheckStatus: () => void;
}

export function PortalApprovalPending({
	title,
	description,
	primaryColor,
	baseFontSize,
	spacing,
	onCheckStatus,
}: PortalApprovalPendingProps) {
	return (
		<>
			{/* Icon */}
			<div className="flex justify-center mb-4">
				<div className="rounded-full bg-yellow-100 p-3">
					<svg
						className="h-8 w-8 text-yellow-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
			</div>

			{/* Title & Description */}
			<div
				className={`text-center ${
					spacing === "compact"
						? "space-y-1"
						: spacing === "spacious"
							? "space-y-4"
							: "space-y-2"
				}`}
			>
				<h2
					className="font-bold"
					style={{
						fontSize: `${Number.parseInt(baseFontSize) * 1.25}px`,
					}}
				>
					{title}
				</h2>
				<p
					className="text-muted-foreground"
					style={{
						fontSize: `${baseFontSize}px`,
					}}
				>
					{description}
				</p>
			</div>

			{/* Actions */}
			<div
				className={`flex flex-col mt-6 ${
					spacing === "compact"
						? "gap-2"
						: spacing === "spacious"
							? "gap-5"
							: "gap-3"
				}`}
			>
				<Button
					className="w-full"
					onClick={onCheckStatus}
					style={{
						backgroundColor: primaryColor,
						fontSize: `${baseFontSize}px`,
					}}
				>
					Check Status
				</Button>
			</div>
		</>
	);
}
