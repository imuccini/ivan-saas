"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Input } from "@ui/components/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ui/components/table";
import {
	ChevronDown,
	ChevronRight,
	MoreVertical,
	Plus,
	Search,
} from "lucide-react";
import { useState } from "react";
import { DeleteTermDialog } from "./DeleteTermDialog";
import { TermEditorDialog } from "./TermEditorDialog";

export function TermsPageContent() {
	const { activeWorkspace: workspace } = useActiveWorkspace();
	const [searchQuery, setSearchQuery] = useState("");
	const [editorOpen, setEditorOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedTerm, setSelectedTerm] = useState<any>(null);
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const queryClient = useQueryClient();

	// Fetch terms
	const { data: terms = [], isLoading } = useQuery(
		orpc.terms.list.queryOptions({
			input: {
				workspaceId: workspace?.id || "",
			},
		}),
	);

	// Delete mutation
	const deleteMutation = useMutation(
		orpc.terms.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.terms.list.queryKey({
						input: { workspaceId: workspace?.id || "" },
					}),
				});
				setDeleteDialogOpen(false);
				setSelectedTerm(null);
			},
		}),
	);

	// Publish mutation
	const publishMutation = useMutation(
		orpc.terms.publish.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.terms.list.queryKey({
						input: { workspaceId: workspace?.id || "" },
					}),
				});
			},
		}),
	);

	const handleEdit = (term: any) => {
		setSelectedTerm(term);
		setEditorOpen(true);
	};

	const handleDelete = (term: any) => {
		setSelectedTerm(term);
		setDeleteDialogOpen(true);
	};

	const handlePublish = (termId: string) => {
		publishMutation.mutate({ input: { id: termId } });
	};

	const toggleRow = (termId: string) => {
		const newExpanded = new Set(expandedRows);
		if (newExpanded.has(termId)) {
			newExpanded.delete(termId);
		} else {
			newExpanded.add(termId);
		}
		setExpandedRows(newExpanded);
	};

	const filteredTerms = terms.filter((term: any) =>
		term.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const getCategoryLabel = (category: string) => {
		const labels: Record<string, string> = {
			PRIVACY_POLICY: "Privacy Policy",
			TERMS_OF_USE: "Terms of Use",
			COOKIE_POLICY: "Cookie Policy",
			OTHER: "Other",
		};
		return labels[category] || category;
	};

	const getLanguages = (translations: Record<string, any>) => {
		return Object.keys(translations).join(", ").toUpperCase();
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">
						Terms management ({filteredTerms.length})
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Manage the terms documents that you include in your
						access journeys
					</p>
				</div>
				<Button
					className="gap-2"
					onClick={() => {
						setSelectedTerm(null);
						setEditorOpen(true);
					}}
				>
					<Plus className="h-4 w-4" />
					Create new term
				</Button>
			</div>

			{/* Search */}
			<div className="relative max-w-sm">
				<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Filter by name, type, etc..."
					className="pl-9"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			{/* Table */}
			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[40px]" />
							<TableHead>NAME</TableHead>
							<TableHead>TYPE</TableHead>
							<TableHead>LANGUAGES</TableHead>
							<TableHead>SCOPE</TableHead>
							<TableHead>STATUS</TableHead>
							<TableHead>VERSION</TableHead>
							<TableHead>LAST EDITED</TableHead>
							<TableHead className="w-[50px]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={9}
									className="text-center py-8"
								>
									Loading...
								</TableCell>
							</TableRow>
						) : filteredTerms.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={9}
									className="text-center py-8"
								>
									No terms found. Create your first term to
									get started.
								</TableCell>
							</TableRow>
						) : (
							filteredTerms.map((term: any) => (
								<TableRow key={term.id}>
									<TableCell>
										<button
											type="button"
											onClick={() => toggleRow(term.id)}
											className="hover:bg-muted rounded p-1"
										>
											{expandedRows.has(term.id) ? (
												<ChevronDown className="h-4 w-4" />
											) : (
												<ChevronRight className="h-4 w-4" />
											)}
										</button>
									</TableCell>
									<TableCell className="font-medium">
										{term.name}
									</TableCell>
									<TableCell>
										{getCategoryLabel(term.category)}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{getLanguages(term.translations)}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{workspace?.name || "Workspace"}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												term.status === "PUBLISHED"
													? "default"
													: "secondary"
											}
										>
											{term.status === "PUBLISHED"
												? "Published"
												: "Draft"}
										</Badge>
									</TableCell>
									<TableCell className="text-sm">
										{term.version}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{new Date(
											term.updatedAt,
										).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() =>
														handleEdit(term)
													}
												>
													Edit
												</DropdownMenuItem>
												{term.status === "DRAFT" && (
													<DropdownMenuItem
														onClick={() =>
															handlePublish(
																term.id,
															)
														}
													>
														Publish
													</DropdownMenuItem>
												)}
												<DropdownMenuItem
													onClick={() =>
														handleDelete(term)
													}
													className="text-destructive"
												>
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Dialogs */}
			<TermEditorDialog
				open={editorOpen}
				onClose={() => {
					setEditorOpen(false);
					setSelectedTerm(null);
				}}
				term={selectedTerm}
				workspaceId={workspace?.id || ""}
			/>

			<DeleteTermDialog
				open={deleteDialogOpen}
				onClose={() => {
					setDeleteDialogOpen(false);
					setSelectedTerm(null);
				}}
				onConfirm={() => {
					if (selectedTerm) {
						deleteMutation.mutate({
							input: { id: selectedTerm.id },
						});
					}
				}}
				termName={selectedTerm?.name}
			/>
		</div>
	);
}
