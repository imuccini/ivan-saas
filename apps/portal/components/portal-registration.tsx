"use client";

import type { Term } from "@repo/portal-shared";
import { useState } from "react";
import { Button } from "./ui-components/button";
import { Input } from "./ui-components/input";

interface FormField {
	id: string;
	label: string;
	placeholder?: string;
	required: boolean;
	type: string;
	isCustom?: boolean;
	options?: string[];
}

interface SelectedTerm {
	id: string;
	termDefinitionId: string;
	required: boolean;
}

interface PortalRegistrationProps {
	title: string;
	description: string;
	submitButtonText: string;
	fields: FormField[];
	selectedTerms: SelectedTerm[];
	availableTerms: Term[];
	primaryColor: string;
	baseFontSize: string;
	spacing: string;
	onBack: () => void;
	onSubmit: (data: Record<string, string>) => void;
}

export function PortalRegistration({
	title,
	description,
	submitButtonText,
	fields,
	selectedTerms,
	availableTerms,
	primaryColor,
	baseFontSize,
	spacing,
	onBack,
	onSubmit,
}: PortalRegistrationProps) {
	const [formData, setFormData] = useState<Record<string, string>>({});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const handleChange = (id: string, value: string) => {
		setFormData((prev) => ({ ...prev, [id]: value }));
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
				{fields.map((field) => (
					<div key={field.id}>
						<label htmlFor={field.id} className="sr-only">
							{field.label}
						</label>
						<Input
							id={field.id}
							type={field.type}
							placeholder={field.placeholder || field.label}
							required={field.required}
							value={formData[field.id] || ""}
							onChange={(e) =>
								handleChange(field.id, e.target.value)
							}
							style={{
								fontSize: `${baseFontSize}px`,
							}}
						/>
					</div>
				))}

				{selectedTerms.length > 0 && (
					<div className="space-y-2 text-left">
						{selectedTerms.map((term) => {
							const definition = availableTerms.find(
								(t) => t.id === term.termDefinitionId,
							);
							if (!definition) return null;

							return (
								<div
									key={term.id}
									className="flex items-start gap-2"
								>
									<input
										type="checkbox"
										id={`term-${term.id}`}
										className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
										required={term.required}
									/>
									<label
										htmlFor={`term-${term.id}`}
										className="text-sm text-muted-foreground"
										style={{
											fontSize: `${Math.max(
												12,
												Number.parseInt(baseFontSize) -
													2,
											)}px`,
										}}
									>
										{definition.name}
										{term.required && (
											<span className="text-destructive ml-1">
												*
											</span>
										)}
									</label>
								</div>
							);
						})}
					</div>
				)}

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
