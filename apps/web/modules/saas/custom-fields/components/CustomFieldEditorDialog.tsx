"use client";

import { LanguageSelector } from "@shared/components/language-selector";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

interface CustomFieldTranslation {
	label: string;
	placeholder?: string;
}

interface CustomField {
	id: string;
	name: string;
	type: string;
	validationType: string | null;
	options?: string[];
	translations: Record<string, CustomFieldTranslation>;
	isRequired: boolean;
	createdAt: string;
}

interface CustomFieldEditorDialogProps {
	open: boolean;
	onClose: () => void;
	field?: CustomField | null;
	workspaceId: string;
	onSuccess?: (field: any) => void;
}

export function CustomFieldEditorDialog({
	open,
	onClose,
	field,
	workspaceId,
	onSuccess,
}: CustomFieldEditorDialogProps) {
	const queryClient = useQueryClient();
	const isEdit = !!field;

	// Form state
	const [name, setName] = useState("");
	const [type, setType] = useState<"text" | "select" | "boolean">("text");
	const [validationType, setValidationType] = useState("text");
	const [options, setOptions] = useState<string[]>(["Option 1"]);
	const [newOption, setNewOption] = useState("");
	const [isRequired, setIsRequired] = useState(false);
	const [activeLanguage, setActiveLanguage] = useState("en");
	const [translations, setTranslations] = useState<
		Record<string, CustomFieldTranslation>
	>({
		en: { label: "", placeholder: "" },
	});

	// Reset form when field changes or dialog opens
	useState(() => {
		if (field) {
			setName(field.name);
			setType(field.type as "text" | "select" | "boolean");
			setValidationType(field.validationType || "text");
			setOptions(field.options || ["Option 1"]);
			setIsRequired(field.isRequired);
			setTranslations(field.translations);
			setActiveLanguage(Object.keys(field.translations)[0] || "en");
		} else {
			setName("");
			setType("text");
			setValidationType("text");
			setOptions(["Option 1"]);
			setIsRequired(false);
			setTranslations({ en: { label: "", placeholder: "" } });
			setActiveLanguage("en");
		}
	});

	// Create mutation
	const createMutation = useMutation(
		orpc.customFields.create.mutationOptions({
			onSuccess: (data) => {
				queryClient.invalidateQueries({
					queryKey: orpc.customFields.list.queryKey({
						input: { workspaceId },
					}),
				});
				onSuccess?.(data);
				onClose();
			},
		}),
	);

	// Update mutation
	const updateMutation = useMutation(
		orpc.customFields.update.mutationOptions({
			onSuccess: (data) => {
				queryClient.invalidateQueries({
					queryKey: orpc.customFields.list.queryKey({
						input: { workspaceId },
					}),
				});
				onSuccess?.(data);
				onClose();
			},
		}),
	);

	const handleSave = () => {
		if (!name.trim()) return;

		const data = {
			name,
			type,
			validationType: type === "text" ? validationType : undefined,
			options: type === "select" ? options : undefined,
			translations,
			isRequired,
		};

		if (isEdit && field) {
			updateMutation.mutate({ id: field.id, ...data });
		} else {
			createMutation.mutate({ workspaceId, ...data });
		}
	};

	const handleAddOption = () => {
		if (newOption.trim()) {
			setOptions([...options, newOption.trim()]);
			setNewOption("");
		}
	};

	const handleRemoveOption = (index: number) => {
		setOptions(options.filter((_, i) => i !== index));
	};

	const updateTranslation = (
		field: keyof CustomFieldTranslation,
		value: string,
	) => {
		setTranslations({
			...translations,
			[activeLanguage]: {
				...translations[activeLanguage],
				[field]: value,
			},
		});
	};

	const currentTranslation = translations[activeLanguage] || {
		label: "",
		placeholder: "",
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? "Edit Custom Field" : "Create Custom Field"}
					</DialogTitle>
					<DialogDescription>
						Configure your custom field with label, placeholder, and
						type-specific settings.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Internal Name */}
					<div className="space-y-2">
						<Label htmlFor="name">
							Internal Name{" "}
							<span className="text-destructive">*</span>
						</Label>
						<Input
							id="name"
							placeholder="e.g., job_title"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<p className="text-xs text-muted-foreground">
							Used as an identifier. No spaces allowed.
						</p>
					</div>

					{/* Field Type */}
					<div className="space-y-2">
						<Label>Field Type</Label>
						<Select
							value={type}
							onValueChange={(v) =>
								setType(v as "text" | "select" | "boolean")
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="text">Text Input</SelectItem>
								<SelectItem value="select">
									Dropdown Select
								</SelectItem>
								<SelectItem value="boolean">
									Checkbox
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Validation Type for Text */}
					{type === "text" && (
						<div className="space-y-2">
							<Label>Validation Type</Label>
							<Select
								value={validationType}
								onValueChange={setValidationType}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="text">Text</SelectItem>
									<SelectItem value="email">Email</SelectItem>
									<SelectItem value="number">
										Number
									</SelectItem>
									<SelectItem value="tel">Phone</SelectItem>
									<SelectItem value="url">URL</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}

					{/* Options for Select */}
					{type === "select" && (
						<div className="space-y-3">
							<Label>Options</Label>
							<div className="space-y-2">
								{options.map((option, index) => (
									<div
										key={index}
										className="flex items-center gap-2"
									>
										<Input
											value={option}
											disabled
											className="flex-1"
										/>
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												handleRemoveOption(index)
											}
											disabled={options.length === 1}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								))}
								<div className="flex items-center gap-2">
									<Input
										placeholder="Add new option"
										value={newOption}
										onChange={(e) =>
											setNewOption(e.target.value)
										}
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

					{/* Language Selector */}
					<div className="space-y-2">
						<Label>Labels & Placeholders</Label>
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium">
								Language:
							</span>
							<LanguageSelector
								selectedLanguages={Object.keys(translations)}
								activeLanguage={activeLanguage}
								onActiveLanguageChange={setActiveLanguage}
								onAddLanguage={(code) => {
									setTranslations({
										...translations,
										[code]: { label: "", placeholder: "" },
									});
									setActiveLanguage(code);
								}}
								onRemoveLanguage={(code) => {
									const newTranslations = { ...translations };
									delete newTranslations[code];
									setTranslations(newTranslations);
								}}
								showRemoveButton={true}
								minLanguages={1}
							/>
						</div>
					</div>

					{/* Translation Fields */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Label htmlFor="label">
									Field Label{" "}
									<span className="text-destructive">*</span>
								</Label>
								<HelpCircle className="h-4 w-4 text-muted-foreground" />
							</div>
							<Input
								id="label"
								placeholder="Enter field label"
								value={currentTranslation.label}
								onChange={(e) =>
									updateTranslation("label", e.target.value)
								}
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Label htmlFor="placeholder">
									Placeholder Text
								</Label>
								<HelpCircle className="h-4 w-4 text-muted-foreground" />
							</div>
							<Input
								id="placeholder"
								placeholder="Enter placeholder text"
								value={currentTranslation.placeholder || ""}
								onChange={(e) =>
									updateTranslation(
										"placeholder",
										e.target.value,
									)
								}
							/>
						</div>
					</div>

					{/* Required Toggle */}
					<div className="flex items-center justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<Label>Required Field</Label>
							<p className="text-sm text-muted-foreground">
								Users must fill this field to proceed
							</p>
						</div>
						<input
							type="checkbox"
							checked={isRequired}
							onChange={(e) => setIsRequired(e.target.checked)}
							className="h-5 w-5"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={!name.trim()}>
						{isEdit ? "Update Field" : "Create Field"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
