"use client";

import { Button } from "./ui-components/button";

interface PortalEasyWifiProps {
	title: string;
	description: string;
	ctaText: string;
	skipText: string;
	primaryColor: string;
	baseFontSize: string;
	spacing: string;
	onConnect: () => void;
	onSkip: () => void;
}

export function PortalEasyWifi({
	title,
	description,
	ctaText,
	skipText,
	primaryColor,
	baseFontSize,
	spacing,
	onConnect,
	onSkip,
}: PortalEasyWifiProps) {
	return (
		<>
			{/* Icon */}
			<div className="flex justify-center mb-4">
				<div className="rounded-full bg-blue-100 p-3">
					<svg
						className="h-8 w-8 text-blue-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
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
					onClick={onConnect}
					style={{
						backgroundColor: primaryColor,
						fontSize: `${baseFontSize}px`,
					}}
				>
					{ctaText}
				</Button>

				<button
					type="button"
					onClick={onSkip}
					className="text-sm text-muted-foreground hover:underline"
					style={{
						fontSize: `${Math.max(
							12,
							Number.parseInt(baseFontSize) - 2,
						)}px`,
					}}
				>
					{skipText}
				</button>
			</div>
		</>
	);
}
