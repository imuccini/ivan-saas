"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Input } from "@ui/components/input";
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
import { MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AccessCodeGroupDialog } from "./AccessCodeGroupDialog";

export function AccessCodesPageContent() {
	const { activeWorkspace: workspace } = useActiveWorkspace();
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"ALL" | "CURRENT" | "UPCOMING" | "PAST">("ALL");
	const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
	const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
	const queryClient = useQueryClient();

	// Fetch groups
	const { data: groups = [], isLoading } = useQuery(
		orpc.accessCodes.listGroups.queryOptions({
			input: {
				workspaceId: workspace?.id || "",
			},
			enabled: !!workspace?.id,
		}),
	);

	// Delete mutation
	const deleteMutation = useMutation(
		orpc.accessCodes.deleteGroup.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.accessCodes.listGroups.queryKey({
						input: { workspaceId: workspace?.id || "" },
					}),
				});
				toast.success("Code group deleted successfully");
			},
			onError: () => {
				toast.error("Failed to delete code group");
			},
		}),
	);

	const filteredGroups = groups.filter((group) => {
		const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
		
		if (!matchesSearch) return false;

		if (statusFilter === "ALL") return true;

		const now = new Date();
		const validFrom = group.validFrom ? new Date(group.validFrom) : null;
		const validUntil = group.validUntil ? new Date(group.validUntil) : null;

		if (statusFilter === "CURRENT") {
			return (!validFrom || validFrom <= now) && (!validUntil || validUntil >= now);
		}
		if (statusFilter === "UPCOMING") {
			return validFrom && validFrom > now;
		}
		if (statusFilter === "PAST") {
			return validUntil && validUntil < now;
		}

		return true;
	});

	const handleEditGroup = (groupId: string) => {
		setSelectedGroup(groupId);
		setIsGroupDialogOpen(true);
	};

	const handleCreateGroup = () => {
		setSelectedGroup(null);
		setIsGroupDialogOpen(true);
	};

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
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold">Access Codes</h1>
					<p className="text-muted-foreground">
						Manage access code groups and generate codes for guest access.
					</p>
				</div>
				<Button onClick={handleCreateGroup}>
					<Plus className="mr-2 h-4 w-4" />
					New Access Code
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search groups..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
				<div className="w-full sm:w-[200px]">
					<Select
						value={statusFilter}
						onValueChange={(value: any) => setStatusFilter(value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">All Statuses</SelectItem>
							<SelectItem value="CURRENT">Current</SelectItem>
							<SelectItem value="UPCOMING">Upcoming</SelectItem>
							<SelectItem value="PAST">Past</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Code Group</TableHead>
							<TableHead>Access Start</TableHead>
							<TableHead>Access End</TableHead>
							<TableHead>Code(s)</TableHead>
							<TableHead className="w-[50px]">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredGroups.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-24 text-center text-muted-foreground"
								>
									No code groups found. Create a new one to get started.
								</TableCell>
							</TableRow>
						) : (
							filteredGroups.map((group) => (
								<TableRow key={group.id}>
									<TableCell className="font-medium">
										{group.name}
									</TableCell>
									<TableCell>
										{group.validFrom
											? new Date(group.validFrom).toLocaleString()
											: "-"}
									</TableCell>
									<TableCell>
										{group.validUntil
											? new Date(group.validUntil).toLocaleString()
											: "-"}
									</TableCell>
									<TableCell>{group.codeCount}</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => handleEditGroup(group.id)}>
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-destructive"
													onClick={() => deleteMutation.mutate({ id: group.id })}
												>
													<Trash2 className="mr-2 h-4 w-4" />
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

			{isGroupDialogOpen && (
				<AccessCodeGroupDialog
					open={isGroupDialogOpen}
					onOpenChange={setIsGroupDialogOpen}
					workspaceId={workspace?.id || ""}
					groupId={selectedGroup}
				/>
			)}
		</div>
	);
}
