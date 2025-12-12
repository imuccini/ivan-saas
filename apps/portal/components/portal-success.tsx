"use client";

import { useEffect } from "react";
import { Button } from "./ui-components/button";

interface PortalSuccessProps {
	title: string;
	description: string;
	redirectUrl?: string;
	redirectMode: "external" | "text";
	primaryColor: string;
	baseFontSize: string;
	spacing: string;
}

export function PortalSuccess({
	title,
	description,
	redirectUrl,
	redirectMode,
	primaryColor,
	baseFontSize,
	spacing,
}: PortalSuccessProps) {
	useEffect(() => {
		if (redirectMode === "external" && redirectUrl) {
			const timer = setTimeout(() => {
				window.location.href = redirectUrl;
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [redirectMode, redirectUrl]);

	return (
		<>
			{/* Icon */}
			<div className="flex justify-center mb-4">
				<div className="rounded-full bg-green-100 p-3">
					<svg
						className="h-8 w-8 text-green-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
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
			{redirectMode === "external" && redirectUrl && (
				<div
					className={`flex flex-col mt-6 ${
						spacing === "compact"
							? "gap-2"
							: spacing === "spacious"
								? "gap-5"
								: "gap-3"
					}`}
				>
					<p
						className="text-sm text-muted-foreground text-center"
						style={{
							fontSize: `${Math.max(
								12,
								Number.parseInt(baseFontSize) - 2,
							)}px`,
						}}
					>
						Redirecting you in a few seconds...
					</p>
					<Button
						className="w-full"
						onClick={() => (window.location.href = redirectUrl)}
						style={{
							backgroundColor: primaryColor,
							fontSize: `${baseFontSize}px`,
						}}
					>
						Continue now
					</Button>
				</div>
			)}
		</>
	);
}
