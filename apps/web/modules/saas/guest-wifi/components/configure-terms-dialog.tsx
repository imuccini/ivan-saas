"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";
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
import { Skeleton } from "@ui/components/skeleton";
import { ExternalLink, GripVertical, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TermEditorDialog } from "../../terms/components/TermEditorDialog";

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
	const { activeWorkspace: workspace } = useActiveWorkspace();
	const [selectedTerms, setSelectedTerms] =
		useState<SelectedTerm[]>(initialTerms);
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

	// Fetch available terms from the workspace
	const { data: termsData = [], isLoading: isLoadingTerms } = useQuery(
		orpc.terms.list.queryOptions({
			input: {
				workspaceId: workspace?.id || "",
				status: "PUBLISHED", // Only show published terms
			},
		}),
	);

	// Map terms to the format expected by the dialog
	const availableTerms: TermDefinition[] = termsData.map((term: any) => ({
		id: term.id,
		title: term.name,
		label: term.translations?.en?.label || term.name,
	}));

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
		return availableTerms.find((t) => t.id === termDefinitionId);
	};

	const getAvailableTermsToAdd = () => {
		const selectedIds = selectedTerms.map((t) => t.termDefinitionId);
		return availableTerms.filter((t) => !selectedIds.includes(t.id));
	};

	const handleSave = () => {
		onSave?.(selectedTerms);
		onOpenChange(false);
	};

	const [isTermEditorOpen, setIsTermEditorOpen] = useState(false);

	const handleTermCreated = (newTerm: any) => {
		// Add the new term to the selected terms
		const newSelectedTerm: SelectedTerm = {
			id: Date.now().toString(),
			termDefinitionId: newTerm.id,
			required: newTerm.isMandatory || false,
		};
		setSelectedTerms([...selectedTerms, newSelectedTerm]);
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
					{isLoadingTerms ? (
						<div className="space-y-3">
							<Skeleton className="h-20 w-full" />
							<Skeleton className="h-20 w-full" />
						</div>
					) : (
						selectedTerms.map((term, index) => {
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
						})
					)}

					{/* Add Term and Terms Management Row */}
					<div className="flex items-center gap-3">
						<Select onValueChange={addTerm} disabled={isLoadingTerms}>
							<SelectTrigger className="flex-1">
								<div className="flex items-center gap-2">
									<Plus className="h-4 w-4" />
									<SelectValue placeholder="Add term" />
								</div>
							</SelectTrigger>
							<SelectContent>
								<div className="p-1">
									<Button
										variant="ghost"
										className="w-full justify-start text-sm font-medium"
										onClick={(e) => {
											e.preventDefault();
											setIsTermEditorOpen(true);
										}}
									>
										<Plus className="mr-2 h-4 w-4" />
										Create new term
									</Button>
								</div>
								{getAvailableTermsToAdd().length > 0 && (
									<div className="h-px bg-border my-1" />
								)}
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
							asChild
						>
							<Link
								href={`/app/${workspace?.slug}/manage/terms`}
							>
								Terms management
								<ExternalLink className="h-4 w-4" />
							</Link>
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

			{isTermEditorOpen && workspace && (
				<TermEditorDialog
					open={isTermEditorOpen}
					onClose={() => setIsTermEditorOpen(false)}
					workspaceId={workspace.id}
					onSuccess={handleTermCreated}
				/>
			)}
		</Dialog>
	);
}
