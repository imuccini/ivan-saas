"use client";

import { useState } from "react";
import { Button } from "./ui-components/button";
import { Input } from "./ui-components/input";

interface PortalApprovalRequestProps {
	title: string;
	description: string;
	submitButtonText: string;
	primaryColor: string;
	baseFontSize: string;
	spacing: string;
	onBack: () => void;
	onSubmit: (sponsorEmail: string) => void;
}

export function PortalApprovalRequest({
	title,
	description,
	submitButtonText,
	primaryColor,
	baseFontSize,
	spacing,
	onBack,
	onSubmit,
}: PortalApprovalRequestProps) {
	const [sponsorEmail, setSponsorEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (sponsorEmail.trim()) {
			onSubmit(sponsorEmail);
		}
	};

	return (
		<>
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

			{/* Form */}
			<form
				onSubmit={handleSubmit}
				className={`flex flex-col ${
					spacing === "compact"
						? "gap-2"
						: spacing === "spacious"
							? "gap-5"
							: "gap-3"
				}`}
			>
				<Input
					type="email"
					placeholder="Sponsor's Email"
					value={sponsorEmail}
					onChange={(e) => setSponsorEmail(e.target.value)}
					style={{ fontSize: `${baseFontSize}px` }}
					required
				/>

				<Button
					type="submit"
					className="w-full"
					style={{
						backgroundColor: primaryColor,
						fontSize: `${baseFontSize}px`,
					}}
				>
					{submitButtonText}
				</Button>

				<button
					type="button"
					onClick={onBack}
					className="text-sm text-muted-foreground hover:underline"
					style={{
						fontSize: `${Math.max(
							12,
							Number.parseInt(baseFontSize) - 2,
						)}px`,
					}}
				>
					Back
				</button>
			</form>
		</>
	);
}
