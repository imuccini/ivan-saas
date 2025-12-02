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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { ExternalLink, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

// Represents a term definition from the Terms Management section
interface TermDefinition {
	id: string;
	title: string;
	label: string;
}

// Represents a term selected for this configuration
interface SelectedTerm {
	id: string;
	termDefinitionId: string;
	required: boolean;
}

interface ConfigureTermsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialTerms?: SelectedTerm[];
	onSave?: (terms: SelectedTerm[]) => void;
}

// Mock available terms - in production, these would come from the Terms Management section
const AVAILABLE_TERMS: TermDefinition[] = [
	{
		id: "term-1",
		title: "Privacy Policy",
		label: "I accept the Privacy Policy",
	},
	{
		id: "term-2",
		title: "Marketing Opt-In",
		label: "I agree to receive marketing communications",
	},
	{
		id: "term-3",
		title: "Terms of Service",
		label: "I agree to the Terms of Service",
	},
	{
		id: "term-4",
		title: "Cookie Policy",
		label: "I accept the use of cookies",
	},
];

export function ConfigureTermsDialog({
	open,
	onOpenChange,
	initialTerms = [
		{
			id: "1",
			termDefinitionId: "term-1",
			required: true,
		},
		{
			id: "2",
			termDefinitionId: "term-2",
			required: false,
		},
	],
	onSave,
}: ConfigureTermsDialogProps) {
	const [selectedTerms, setSelectedTerms] =
		useState<SelectedTerm[]>(initialTerms);
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

	const handleDragStart = (index: number) => {
		setDraggedIndex(index);
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		if (draggedIndex === null || draggedIndex === index) {
			return;
		}

		const newTerms = [...selectedTerms];
		const draggedTerm = newTerms[draggedIndex];
		newTerms.splice(draggedIndex, 1);
		newTerms.splice(index, 0, draggedTerm);
		setSelectedTerms(newTerms);
		setDraggedIndex(index);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
	};

	const toggleRequired = (id: string) => {
		setSelectedTerms(
			selectedTerms.map((term) => {
				if (term.id === id) {
					return { ...term, required: !term.required };
				}
				return term;
			}),
		);
	};

	const deleteTerm = (id: string) => {
		setSelectedTerms(selectedTerms.filter((term) => term.id !== id));
	};

	const addTerm = (termDefinitionId: string) => {
		// Check if term is already added
		if (
			selectedTerms.some((t) => t.termDefinitionId === termDefinitionId)
		) {
			return;
		}

		const newTerm: SelectedTerm = {
			id: Date.now().toString(),
			termDefinitionId,
			required: false,
		};
		setSelectedTerms([...selectedTerms, newTerm]);
	};

	const getTermDefinition = (termDefinitionId: string) => {
		return AVAILABLE_TERMS.find((t) => t.id === termDefinitionId);
	};

	const getAvailableTermsToAdd = () => {
		const selectedIds = selectedTerms.map((t) => t.termDefinitionId);
		return AVAILABLE_TERMS.filter((t) => !selectedIds.includes(t.id));
	};

	const handleSave = () => {
		onSave?.(selectedTerms);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Customise consent</DialogTitle>
					<DialogDescription>
						Control the fields users see during sign-up. Toggle,
						require, and drag to reorder.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3 py-4">
					{selectedTerms.map((term, index) => {
						const definition = getTermDefinition(
							term.termDefinitionId,
						);
						if (!definition) return null;

						return (
							<div
								key={term.id}
								role="button"
								tabIndex={0}
								draggable
								onDragStart={() => handleDragStart(index)}
								onDragOver={(e) => handleDragOver(e, index)}
								onDragEnd={handleDragEnd}
								className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 cursor-move"
							>
								<GripVertical className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />

								<div className="flex-1 space-y-1">
									<div className="font-medium">
										{definition.title}
									</div>
									<div className="text-sm text-muted-foreground">
										{definition.label}
									</div>
								</div>

								<div className="flex items-center gap-2 mt-0">
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											toggleRequired(term.id);
										}}
										className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
											term.required
												? "bg-foreground text-background"
												: "bg-muted text-muted-foreground hover:bg-muted/80"
										}`}
									>
										{term.required
											? "Required"
											: "Optional"}
									</button>
									<Button
										variant="ghost"
										size="icon"
										onClick={(e) => {
											e.stopPropagation();
											deleteTerm(term.id);
										}}
										className="h-8 w-8"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						);
					})}

					{/* Add Term and Terms Management Row */}
					<div className="flex items-center gap-3">
						<Select onValueChange={addTerm}>
							<SelectTrigger className="flex-1">
								<div className="flex items-center gap-2">
									<Plus className="h-4 w-4" />
									<SelectValue placeholder="Add term" />
								</div>
							</SelectTrigger>
							<SelectContent>
								{getAvailableTermsToAdd().length === 0 ? (
									<div className="px-2 py-1.5 text-sm text-muted-foreground">
										All terms added
									</div>
								) : (
									getAvailableTermsToAdd().map((term) => (
										<SelectItem
											key={term.id}
											value={term.id}
										>
											{term.title}
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>

						<Button
							variant="ghost"
							size="sm"
							className="gap-2 text-muted-foreground hover:text-foreground"
							type="button"
						>
							Terms management
							<ExternalLink className="h-4 w-4" />
						</Button>
					</div>
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
