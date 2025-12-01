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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
	Building2,
	Calendar,
	ChevronDown,
	GripVertical,
	Hash,
	Plus,
	Trash2,
	User,
	Users,
} from "lucide-react";
import { useState } from "react";
import { CustomFieldConfigModal } from "./custom-field-config-modal";

interface FormField {
	id: string;
	label: string;
	placeholder?: string;
	required: boolean;
	type: string;
	isCustom?: boolean;
	options?: string[];
}

interface ConfigureSignupFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialFields?: FormField[];
	onSave?: (fields: FormField[]) => void;
}

// Predefined field templates
const PREDEFINED_FIELDS = {
	company: {
		label: "Company",
		placeholder: "Enter your company name",
		type: "text",
		icon: Building2,
	},
	title: {
		label: "Job Title",
		placeholder: "Enter your job title",
		type: "text",
		icon: User,
	},
	gender: {
		label: "Gender",
		placeholder: "Select your gender",
		type: "select",
		options: ["Male", "Female", "Other", "Prefer not to say"],
		icon: Users,
	},
	age: {
		label: "Age",
		placeholder: "Enter your age",
		type: "number",
		icon: Hash,
	},
	birthday: {
		label: "Birthday",
		placeholder: "Select your birthday",
		type: "date",
		icon: Calendar,
	},
};

export function ConfigureSignupFormDialog({
	open,
	onOpenChange,
	initialFields = [
		{
			id: "1",
			label: "First Name",
			placeholder: "Enter your first name",
			required: false,
			type: "text",
		},
		{
			id: "2",
			label: "Last Name",
			placeholder: "Enter your last name",
			required: false,
			type: "text",
		},
		{
			id: "3",
			label: "Email",
			placeholder: "Enter your email address",
			required: true,
			type: "email",
		},
	],
	onSave,
}: ConfigureSignupFormDialogProps) {
	const [fields, setFields] = useState<FormField[]>(initialFields);
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const [customFieldModalOpen, setCustomFieldModalOpen] = useState(false);
	const [selectedCustomFieldType, setSelectedCustomFieldType] = useState<
		"text" | "select" | "boolean" | null
	>(null);

	const handleDragStart = (index: number) => {
		setDraggedIndex(index);
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		if (draggedIndex === null || draggedIndex === index) return;

		const newFields = [...fields];
		const draggedField = newFields[draggedIndex];
		newFields.splice(draggedIndex, 1);
		newFields.splice(index, 0, draggedField);
		setFields(newFields);
		setDraggedIndex(index);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
	};

	const toggleRequired = (id: string) => {
		setFields(
			fields.map((field) => {
				if (field.id === id) {
					return { ...field, required: !field.required };
				}
				return field;
			}),
		);
	};

	const deleteField = (id: string) => {
		setFields(fields.filter((field) => field.id !== id));
	};

	const addPredefinedField = (fieldKey: keyof typeof PREDEFINED_FIELDS) => {
		const template = PREDEFINED_FIELDS[fieldKey];
		const newField: FormField = {
			id: Date.now().toString(),
			label: template.label,
			placeholder: template.placeholder,
			required: false,
			type: template.type,
			options: template.options,
		};
		setFields([...fields, newField]);
	};

	const openCustomFieldModal = (type: "text" | "select" | "boolean") => {
		setSelectedCustomFieldType(type);
		setCustomFieldModalOpen(true);
	};

	const handleCustomFieldSave = (fieldConfig: {
		label: string;
		placeholder: string;
		type: string;
		options?: string[];
	}) => {
		const newField: FormField = {
			id: Date.now().toString(),
			label: fieldConfig.label,
			placeholder: fieldConfig.placeholder,
			required: false,
			type: fieldConfig.type,
			isCustom: true,
			options: fieldConfig.options,
		};
		setFields([...fields, newField]);
	};

	const handleSave = () => {
		onSave?.(fields);
		onOpenChange(false);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Customise registration form</DialogTitle>
						<DialogDescription>
							Control the fields users see during sign-up. Toggle, require, and
							drag to reorder.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-3 py-4">
						{fields.map((field, index) => (
							<div
								key={field.id}
								draggable
								onDragStart={() => handleDragStart(index)}
								onDragOver={(e) => handleDragOver(e, index)}
								onDragEnd={handleDragEnd}
								className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 cursor-move"
							>
								<GripVertical className="h-5 w-5 text-muted-foreground mt-8 flex-shrink-0" />

								<div className="flex-1 space-y-2">
									<Label className="text-sm font-medium">
										{field.label}
									</Label>
									<Input
										type={field.type}
										placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
										disabled
										className="bg-muted/50"
									/>
									{field.isCustom && (
										<p className="text-xs text-primary">Custom Field</p>
									)}
								</div>

								<div className="flex items-center gap-2 mt-6">
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											toggleRequired(field.id);
										}}
										className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
											field.required
												? "bg-foreground text-background"
												: "bg-muted text-muted-foreground hover:bg-muted/80"
										}`}
									>
										{field.required ? "Required" : "Optional"}
									</button>
									<Button
										variant="ghost"
										size="icon"
										onClick={(e) => {
											e.stopPropagation();
											deleteField(field.id);
										}}
										className="h-8 w-8"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}

						{/* Add Field Buttons */}
						<div className="flex gap-2">
							{/* Add Predefined Field */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="flex-1 gap-2"
										type="button"
									>
										<Plus className="h-4 w-4" />
										Add Field
										<ChevronDown className="h-4 w-4 ml-auto" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-56">
									<DropdownMenuItem
										onClick={() => addPredefinedField("company")}
									>
										<Building2 className="h-4 w-4 mr-2" />
										Company
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => addPredefinedField("title")}
									>
										<User className="h-4 w-4 mr-2" />
										Job Title
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => addPredefinedField("gender")}
									>
										<Users className="h-4 w-4 mr-2" />
										Gender
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => addPredefinedField("age")}>
										<Hash className="h-4 w-4 mr-2" />
										Age
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => addPredefinedField("birthday")}
									>
										<Calendar className="h-4 w-4 mr-2" />
										Birthday
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							{/* Add Custom Field */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="flex-1 gap-2"
										type="button"
									>
										<Plus className="h-4 w-4" />
										Add Custom Field
										<ChevronDown className="h-4 w-4 ml-auto" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuItem onClick={() => openCustomFieldModal("text")}>
										Text Field
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => openCustomFieldModal("select")}
									>
										Select Dropdown
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => openCustomFieldModal("boolean")}
									>
										Checkbox
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button onClick={handleSave}>Update</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Custom Field Configuration Modal */}
			<CustomFieldConfigModal
				open={customFieldModalOpen}
				onOpenChange={setCustomFieldModalOpen}
				fieldType={selectedCustomFieldType}
				onSave={handleCustomFieldSave}
			/>
		</>
	);
}
