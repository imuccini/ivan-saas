"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { LanguageSelector } from "@shared/components/language-selector";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Skeleton } from "@ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ui/components/table";
import { HelpCircle, MoreVertical, Plus, Search, X } from "lucide-react";
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

export function CustomFieldsPageContent() {
	const { activeWorkspace: workspace } = useActiveWorkspace();
	const [searchQuery, setSearchQuery] = useState("");
	const [editorOpen, setEditorOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedField, setSelectedField] = useState<CustomField | null>(
		null,
	);
	const queryClient = useQueryClient();

	// Fetch custom fields
	const { data: customFields = [], isLoading } = useQuery(
		orpc.customFields.list.queryOptions({
			input: {
				workspaceId: workspace?.id || "",
			},
		}),
	);

	// Delete mutation
	const deleteMutation = useMutation(
		orpc.customFields.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.customFields.list.queryKey({
						input: { workspaceId: workspace?.id || "" },
					}),
				});
				setDeleteDialogOpen(false);
				setSelectedField(null);
			},
		}),
	);

	const handleEdit = (field: CustomField) => {
		setSelectedField(field);
		setEditorOpen(true);
	};

	const handleDelete = (field: CustomField) => {
		setSelectedField(field);
		setDeleteDialogOpen(true);
	};

	const handleCreate = () => {
		setSelectedField(null);
		setEditorOpen(true);
	};

	const filteredFields = customFields.filter(
		(field: CustomField) =>
			field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			Object.values(field.translations).some(
				(t) =>
					t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
					t.placeholder
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()),
			),
	);

	if (isLoading) {
		return (
			<div className="p-6 space-y-4">
				<Skeleton className="h-8 w-1/3" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Custom Fields</h1>
					<p className="text-muted-foreground">
						Manage custom registration fields for your WiFi portal
					</p>
				</div>
				<Button onClick={handleCreate}>
					<Plus className="mr-2 h-4 w-4" />
					Add Custom Field
				</Button>
			</div>

			{/* Search */}
			<div className="flex items-center gap-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search fields..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
			</div>

			{/* Table */}
			{filteredFields.length === 0 ? (
				<div className="text-center py-12 text-muted-foreground">
					<p>No custom fields found.</p>
					<p className="text-sm">
						Create your first custom field to collect additional
						data from users.
					</p>
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Languages</TableHead>
							<TableHead>Required</TableHead>
							<TableHead className="w-[50px]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredFields.map((field: CustomField) => (
							<TableRow key={field.id}>
								<TableCell className="font-medium">
									{field.name}
								</TableCell>
								<TableCell>
									<Badge variant="secondary">
										{field.type === "text" &&
										field.validationType
											? field.validationType
											: field.type}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="flex gap-1 flex-wrap">
										{Object.keys(field.translations).map(
											(lang) => (
												<Badge
													key={lang}
													variant="outline"
													className="text-xs"
												>
													{lang.toUpperCase()}
												</Badge>
											),
										)}
									</div>
								</TableCell>
								<TableCell>
									{field.isRequired ? (
										<Badge>Required</Badge>
									) : (
										<span className="text-muted-foreground text-sm">
											Optional
										</span>
									)}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() =>
													handleEdit(field)
												}
											>
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-destructive"
												onClick={() =>
													handleDelete(field)
												}
											>
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			{/* Editor Dialog */}
			<CustomFieldEditorDialog
				open={editorOpen}
				onClose={() => {
					setEditorOpen(false);
					setSelectedField(null);
				}}
				field={selectedField}
				workspaceId={workspace?.id || ""}
			/>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Custom Field</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete "
							{selectedField?.name}"? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() =>
								selectedField &&
								deleteMutation.mutate({ id: selectedField.id })
							}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

// Editor Dialog Component
function CustomFieldEditorDialog({
	open,
	onClose,
	field,
	workspaceId,
}: {
	open: boolean;
	onClose: () => void;
	field: CustomField | null;
	workspaceId: string;
}) {
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

	// Reset form when field changes
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
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.customFields.list.queryKey({
						input: { workspaceId },
					}),
				});
				onClose();
			},
		}),
	);

	// Update mutation
	const updateMutation = useMutation(
		orpc.customFields.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.customFields.list.queryKey({
						input: { workspaceId },
					}),
				});
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
