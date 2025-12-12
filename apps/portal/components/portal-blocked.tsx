"use client";

import { Button } from "./ui-components/button";

interface PortalBlockedProps {
	title: string;
	description: string;
	primaryColor: string;
	baseFontSize: string;
	spacing: string;
	onRetry: () => void;
}

export function PortalBlocked({
	title,
	description,
	primaryColor,
	baseFontSize,
	spacing,
	onRetry,
}: PortalBlockedProps) {
	return (
		<>
			{/* Icon */}
			<div className="flex justify-center mb-4">
				<div className="rounded-full bg-red-100 p-3">
					<svg
						className="h-8 w-8 text-red-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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
					onClick={onRetry}
					style={{
						backgroundColor: primaryColor,
						fontSize: `${baseFontSize}px`,
					}}
				>
					Try Again
				</Button>
			</div>
		</>
	);
}
