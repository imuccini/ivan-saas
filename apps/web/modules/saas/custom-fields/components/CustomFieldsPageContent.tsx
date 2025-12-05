"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
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
import { Skeleton } from "@ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ui/components/table";
import { MoreVertical, Plus, Search } from "lucide-react";
import { useState } from "react";
import { CustomFieldEditorDialog } from "./CustomFieldEditorDialog";

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

	const handleEdit = (field: (typeof customFields)[number]) => {
		setSelectedField(field as unknown as CustomField);
		setEditorOpen(true);
	};

	const handleDelete = (field: (typeof customFields)[number]) => {
		setSelectedField(field as unknown as CustomField);
		setDeleteDialogOpen(true);
	};

	const handleCreate = () => {
		setSelectedField(null);
		setEditorOpen(true);
	};

	const filteredFields = customFields.filter(
		(field) =>
			field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			Object.values(
				field.translations as unknown as Record<
					string,
					CustomFieldTranslation
				>,
			).some(
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
						{filteredFields.map((field) => (
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
										{Object.keys(
											field.translations as unknown as Record<
												string,
												CustomFieldTranslation
											>,
										).map((lang) => (
											<Badge
												key={lang}
												variant="outline"
												className="text-xs"
											>
												{lang.toUpperCase()}
											</Badge>
										))}
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


