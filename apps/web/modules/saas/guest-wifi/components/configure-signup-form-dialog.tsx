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
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface FormField {
	id: string;
	label: string;
	required: boolean;
	type: string;
}

interface ConfigureSignupFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialFields?: FormField[];
	onSave?: (fields: FormField[]) => void;
}

export function ConfigureSignupFormDialog({
	open,
	onOpenChange,
	initialFields = [
		{ id: "1", label: "First Name", required: false, type: "text" },
		{ id: "2", label: "Last Name", required: false, type: "text" },
		{ id: "3", label: "Email", required: true, type: "email" },
	],
	onSave,
}: ConfigureSignupFormDialogProps) {
	const [fields, setFields] = useState<FormField[]>(initialFields);
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

	const addField = () => {
		const newField: FormField = {
			id: Date.now().toString(),
			label: "New Field",
			required: false,
			type: "text",
		};
		setFields([...fields, newField]);
	};

	const handleSave = () => {
		onSave?.(fields);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Customise registration form</DialogTitle>
					<DialogDescription>
						Control the fields users see during sign-up. Toggle,
						require, and drag to reorder.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3 py-4">
					{fields.map((field, index) => (
						<button
							key={field.id}
							type="button"
							draggable
							onDragStart={() => handleDragStart(index)}
							onDragOver={(e) => handleDragOver(e, index)}
							onDragEnd={handleDragEnd}
							className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 cursor-move w-full text-left"
						>
							<GripVertical className="h-5 w-5 text-muted-foreground" />
							<span className="flex-1 font-medium">
								{field.label}
							</span>
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
						</button>
					))}

					<Button
						variant="outline"
						onClick={addField}
						className="w-full gap-2"
						type="button"
					>
						<Plus className="h-4 w-4" />
						Add field
					</Button>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button onClick={handleSave}>Update</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
