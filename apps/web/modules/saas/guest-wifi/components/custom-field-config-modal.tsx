"use client";

import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { HelpCircle, Plus, X } from "lucide-react";
import { useState } from "react";

interface CustomFieldConfigModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	fieldType: "text" | "select" | "boolean" | null;
	onSave?: (field: {
		label: string;
		placeholder: string;
		type: string;
		validationType?: string;
		options?: string[];
	}) => void;
	initialData?: {
		label: string;
		placeholder: string;
		validationType?: string;
		options?: string[];
	};
}

export function CustomFieldConfigModal({
	open,
	onOpenChange,
	fieldType,
	onSave,
	initialData,
}: CustomFieldConfigModalProps) {
	const [fieldLabel, setFieldLabel] = useState(initialData?.label || "");
	const [placeholderText, setPlaceholderText] = useState(
		initialData?.placeholder || "",
	);
	const [validationType, setValidationType] = useState(
		initialData?.validationType || "text",
	);
	const [selectOptions, setSelectOptions] = useState<string[]>(
		initialData?.options || ["Option 1"],
	);
	const [newOption, setNewOption] = useState("");

	const handleAddOption = () => {
		if (newOption.trim()) {
			setSelectOptions([...selectOptions, newOption.trim()]);
			setNewOption("");
		}
	};

	const handleRemoveOption = (index: number) => {
		setSelectOptions(selectOptions.filter((_, i) => i !== index));
	};

	const handleSave = () => {
		if (!fieldLabel.trim()) return;

		const field = {
			label: fieldLabel,
			placeholder: placeholderText,
			type: fieldType === "text" ? validationType : fieldType || "text",
			...(fieldType === "text" && { validationType }),
			...(fieldType === "select" && { options: selectOptions }),
		};

		onSave?.(field);
		handleClose();
	};

	const handleClose = () => {
		setFieldLabel("");
		setPlaceholderText("");
		setValidationType("text");
		setSelectOptions(["Option 1"]);
		setNewOption("");
		onOpenChange(false);
	};

	if (!fieldType) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Custom Field</DialogTitle>
					<DialogDescription>
						Configure your custom field with label, placeholder, and type-specific
						settings.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Field Label and Placeholder */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Label htmlFor="field-label">
									Field Label <span className="text-destructive">*</span>
								</Label>
								<HelpCircle className="h-4 w-4 text-muted-foreground" />
							</div>
							<Input
								id="field-label"
								placeholder="Enter field label"
								value={fieldLabel}
								onChange={(e) => setFieldLabel(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Label htmlFor="placeholder-text">Placeholder Text</Label>
								<HelpCircle className="h-4 w-4 text-muted-foreground" />
							</div>
							<Input
								id="placeholder-text"
								placeholder="Enter placeholder text"
								value={placeholderText}
								onChange={(e) => setPlaceholderText(e.target.value)}
							/>
						</div>
					</div>

					{/* Validation Type for Text Fields */}
					{fieldType === "text" && (
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Label htmlFor="validation-type">Validation Type</Label>
								<HelpCircle className="h-4 w-4 text-muted-foreground" />
							</div>
							<Select value={validationType} onValueChange={setValidationType}>
								<SelectTrigger id="validation-type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="text">Text</SelectItem>
									<SelectItem value="email">Email</SelectItem>
									<SelectItem value="number">Number</SelectItem>
									<SelectItem value="tel">Phone</SelectItem>
									<SelectItem value="url">URL</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}

					{/* Options for Select Fields */}
					{fieldType === "select" && (
						<div className="space-y-3">
							<Label>Options</Label>
							<div className="space-y-2">
								{selectOptions.map((option, index) => (
									<div key={index} className="flex items-center gap-2">
										<Input value={option} disabled className="flex-1" />
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleRemoveOption(index)}
											disabled={selectOptions.length === 1}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								))}
								<div className="flex items-center gap-2">
									<Input
										placeholder="Add new option"
										value={newOption}
										onChange={(e) => setNewOption(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddOption();
											}
										}}
										className="flex-1"
									/>
									<Button
										variant="outline"
										size="icon"
										onClick={handleAddOption}
										disabled={!newOption.trim()}
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* Preview Section */}
					<div className="rounded-lg border bg-muted/30 p-6">
						<h3 className="mb-4 text-lg font-semibold">Preview</h3>
						<div className="rounded-lg border bg-background p-6">
							<div className="space-y-2">
								<Label className="text-base font-semibold">
									{fieldLabel || "Field Label"}
								</Label>
								{fieldType === "text" && (
									<Input
										type={validationType}
										placeholder={placeholderText || "Enter placeholder text"}
										disabled
									/>
								)}
								{fieldType === "select" && (
									<Select disabled>
										<SelectTrigger>
											<SelectValue
												placeholder={
													placeholderText || "Select an option"
												}
											/>
										</SelectTrigger>
										<SelectContent>
											{selectOptions.map((option, index) => (
												<SelectItem key={index} value={option}>
													{option}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
								{fieldType === "boolean" && (
									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											disabled
											className="h-4 w-4 rounded border-input"
										/>
										<span className="text-sm text-muted-foreground">
											{placeholderText || "Check this option"}
										</span>
									</div>
								)}
								<p className="text-xs text-primary">Custom Field</p>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={!fieldLabel.trim()}>
						{initialData ? "Update Field" : "Add Field"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
