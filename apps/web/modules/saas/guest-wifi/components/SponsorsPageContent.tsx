"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Skeleton } from "@ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ui/components/table";
import { Textarea } from "@ui/components/textarea";
import {
	Download,
	MoreVertical,
	Plus,
	RefreshCw,
	Search,
	Trash2,
	Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SponsorsPageContent() {
	const { activeWorkspace: workspace } = useActiveWorkspace();
	const [searchQuery, setSearchQuery] = useState("");
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [importDialogOpen, setImportDialogOpen] = useState(false);
	const queryClient = useQueryClient();

	// Fetch sponsors
	const { data: sponsors = [], isLoading } = useQuery(
		orpc.sponsors.list.queryOptions({
			input: {
				workspaceId: workspace?.id || "",
			},
			enabled: !!workspace?.id,
		}),
	);

	// Delete mutation
	const deleteMutation = useMutation(
		orpc.sponsors.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.sponsors.list.queryKey({
						input: { workspaceId: workspace?.id || "" },
					}),
				});
				toast.success("Sponsor deleted successfully");
			},
			onError: () => {
				toast.error("Failed to delete sponsor");
			},
		}),
	);

	// Sync mutation (placeholder)
	const syncMutation = useMutation(
		orpc.sponsors.sync.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.sponsors.list.queryKey({
						input: { workspaceId: workspace?.id || "" },
					}),
				});
				toast.success("Synced with IdP successfully");
			},
			onError: () => {
				toast.error("Failed to sync with IdP");
			},
		}),
	);

	const filteredSponsors = sponsors.filter(
		(sponsor) =>
			sponsor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			sponsor.email.toLowerCase().includes(searchQuery.toLowerCase()),
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
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold">Sponsors</h1>
					<p className="text-muted-foreground">
						Manage users who can approve guest access requests.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => syncMutation.mutate({ workspaceId: workspace?.id || "" })}
						disabled={syncMutation.isPending}
					>
						<RefreshCw
							className={`mr-2 h-4 w-4 ${syncMutation.isPending ? "animate-spin" : ""}`}
						/>
						Sync IdP
					</Button>
					<Button
						variant="outline"
						onClick={() => setImportDialogOpen(true)}
					>
						<Upload className="mr-2 h-4 w-4" />
						Import
					</Button>
					<Button onClick={() => setAddDialogOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Add Sponsor
					</Button>
				</div>
			</div>

			{/* Search */}
			<div className="flex items-center gap-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search sponsors..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Full Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Added</TableHead>
							<TableHead className="w-[50px]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredSponsors.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="h-24 text-center text-muted-foreground"
								>
									No sponsors found. Add one manually or import a list.
								</TableCell>
							</TableRow>
						) : (
							filteredSponsors.map((sponsor) => (
								<TableRow key={sponsor.id}>
									<TableCell className="font-medium">
										{sponsor.fullName}
									</TableCell>
									<TableCell>{sponsor.email}</TableCell>
									<TableCell>
										{new Date(sponsor.createdAt).toLocaleDateString()}
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
													className="text-destructive"
													onClick={() =>
														deleteMutation.mutate({ id: sponsor.id })
													}
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

			<AddSponsorDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				workspaceId={workspace?.id || ""}
			/>

			<ImportSponsorsDialog
				open={importDialogOpen}
				onOpenChange={setImportDialogOpen}
				workspaceId={workspace?.id || ""}
			/>
		</div>
	);
}

function AddSponsorDialog({
	open,
	onOpenChange,
	workspaceId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	workspaceId: string;
}) {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const queryClient = useQueryClient();

	const createMutation = useMutation(
		orpc.sponsors.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.sponsors.list.queryKey({
						input: { workspaceId },
					}),
				});
				toast.success("Sponsor added successfully");
				setFullName("");
				setEmail("");
				onOpenChange(false);
			},
			onError: () => {
				toast.error("Failed to add sponsor");
			},
		}),
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!fullName.trim() || !email.trim()) return;
		createMutation.mutate({ workspaceId, fullName, email });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Sponsor</DialogTitle>
					<DialogDescription>
						Add a new sponsor who can approve guest access requests.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="fullName">Full Name</Label>
						<Input
							id="fullName"
							placeholder="John Doe"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="john@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={createMutation.isPending}>
							{createMutation.isPending ? "Adding..." : "Add Sponsor"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function ImportSponsorsDialog({
	open,
	onOpenChange,
	workspaceId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	workspaceId: string;
}) {
	const [csvContent, setCsvContent] = useState("");
	const queryClient = useQueryClient();

	const importMutation = useMutation(
		orpc.sponsors.import.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.sponsors.list.queryKey({
						input: { workspaceId },
					}),
				});
				toast.success("Sponsors imported successfully");
				setCsvContent("");
				onOpenChange(false);
			},
			onError: () => {
				toast.error("Failed to import sponsors");
			},
		}),
	);

	const handleImport = () => {
		if (!csvContent.trim()) return;

		// Simple CSV parsing: Name, Email
		const lines = csvContent.split("\n");
		const sponsors = lines
			.map((line) => {
				const [fullName, email] = line.split(",").map((s) => s.trim());
				if (fullName && email && email.includes("@")) {
					return { fullName, email };
				}
				return null;
			})
			.filter((s): s is { fullName: string; email: string } => s !== null);

		if (sponsors.length === 0) {
			toast.error("No valid sponsors found in CSV");
			return;
		}

		importMutation.mutate({ workspaceId, sponsors });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Import Sponsors</DialogTitle>
					<DialogDescription>
						Paste a CSV list of sponsors (Format: Name, Email). One per line.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="csv">CSV Data</Label>
						<Textarea
							id="csv"
							placeholder="John Doe, john@example.com&#10;Jane Smith, jane@example.com"
							value={csvContent}
							onChange={(e) => setCsvContent(e.target.value)}
							className="h-40 font-mono text-sm"
						/>
						<p className="text-xs text-muted-foreground">
							Format: Full Name, Email Address
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button onClick={handleImport} disabled={importMutation.isPending}>
						{importMutation.isPending ? "Importing..." : "Import Sponsors"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
