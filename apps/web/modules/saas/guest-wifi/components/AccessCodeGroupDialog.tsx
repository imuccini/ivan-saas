"use client";

import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
import {
	Dialog,
	DialogContent,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ui/components/table";
import { MoreVertical, Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AccessCodeDialog } from "./AccessCodeDialog";
import { BulkGenerateDialog } from "./BulkGenerateDialog";

interface AccessCodeGroupDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	workspaceId: string;
	groupId: string | null;
}

export function AccessCodeGroupDialog({
	open,
	onOpenChange,
	workspaceId,
	groupId,
}: AccessCodeGroupDialogProps) {
	const isEdit = !!groupId;
	const queryClient = useQueryClient();

	// Form State
	const [name, setName] = useState("");
	const [validFrom, setValidFrom] = useState("");
	const [validUntil, setValidUntil] = useState("");
	const [rotateCode, setRotateCode] = useState("Never");
	const [timeAllowance, setTimeAllowance] = useState("1 day");
	const [bypassSponsorship, setBypassSponsorship] = useState(false);

	// Dialogs State
	const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
	const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

	// Fetch Group Data if Edit
	const { data: groups } = useQuery(
		orpc.accessCodes.listGroups.queryOptions({
			input: { workspaceId },
			enabled: !!workspaceId,
		}),
	);

	const group = groups?.find((g) => g.id === groupId);

	// Fetch Codes if Edit
	const { data: codes = [] } = useQuery(
		orpc.accessCodes.listCodes.queryOptions({
			input: { groupId: groupId || "" },
			enabled: !!groupId,
		}),
	);

	useEffect(() => {
		if (group) {
			setName(group.name);
			setValidFrom(
				group.validFrom
					? new Date(group.validFrom).toISOString().slice(0, 16)
					: "",
			);
			setValidUntil(
				group.validUntil
					? new Date(group.validUntil).toISOString().slice(0, 16)
					: "",
			);
			setRotateCode(group.rotateCode || "Never");
			setTimeAllowance(group.timeAllowance || "1 day");
			setBypassSponsorship(group.bypassSponsorship);
		} else {
			setName("");
			setValidFrom("");
			setValidUntil("");
			setRotateCode("Never");
			setTimeAllowance("1 day");
			setBypassSponsorship(false);
		}
	}, [group]);

	// Mutations
	const createMutation = useMutation(
		orpc.accessCodes.createGroup.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.accessCodes.listGroups.queryKey({
						input: { workspaceId },
					}),
				});
				toast.success("Code group created successfully");
				onOpenChange(false);
			},
		}),
	);

	const updateMutation = useMutation(
		orpc.accessCodes.updateGroup.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.accessCodes.listGroups.queryKey({
						input: { workspaceId },
					}),
				});
				toast.success("Code group updated successfully");
				onOpenChange(false);
			},
		}),
	);

	const deleteCodeMutation = useMutation(
		orpc.accessCodes.deleteCode.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.accessCodes.listCodes.queryKey({
						input: { groupId: groupId || "" },
					}),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.accessCodes.listGroups.queryKey({
						input: { workspaceId },
					}),
				});
				toast.success("Code deleted successfully");
			},
		}),
	);

	const handleSave = () => {
		if (!name.trim()) return;

		const data = {
			name,
			validFrom: validFrom ? new Date(validFrom) : undefined,
			validUntil: validUntil ? new Date(validUntil) : undefined,
			rotateCode,
			timeAllowance,
			bypassSponsorship,
		};

		if (isEdit && groupId) {
			updateMutation.mutate({ id: groupId, ...data });
		} else {
			createMutation.mutate({ workspaceId, ...data });
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? "Edit Code Group" : "New Code Group"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Settings Section */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g. Biotech Systems Event"
								required
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="validFrom">Valid From (optional)</Label>
								<Input
									id="validFrom"
									type="datetime-local"
									value={validFrom}
									onChange={(e) => setValidFrom(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="validUntil">Valid Until (optional)</Label>
								<Input
									id="validUntil"
									type="datetime-local"
									value={validUntil}
									onChange={(e) => setValidUntil(e.target.value)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="rotateCode">Rotate Code (optional)</Label>
								<Select value={rotateCode} onValueChange={setRotateCode}>
									<SelectTrigger id="rotateCode">
										<SelectValue placeholder="Select rotation" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Never">Never</SelectItem>
										<SelectItem value="Daily">Daily</SelectItem>
										<SelectItem value="Weekly">Weekly</SelectItem>
										<SelectItem value="Monthly">Monthly</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="timeAllowance">
									Assign Time Allowance (optional)
								</Label>
								<Select
									value={timeAllowance}
									onValueChange={setTimeAllowance}
								>
									<SelectTrigger id="timeAllowance">
										<SelectValue placeholder="Select allowance" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1 day">1 day</SelectItem>
										<SelectItem value="2 days">2 days</SelectItem>
										<SelectItem value="1 week">1 week</SelectItem>
										<SelectItem value="1 month">1 month</SelectItem>
										<SelectItem value="Unlimited">Unlimited</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="bypass"
								checked={bypassSponsorship}
								onCheckedChange={(checked) =>
									setBypassSponsorship(checked as boolean)
								}
							/>
							<Label htmlFor="bypass">Bypass Sponsorship approval</Label>
						</div>
					</div>

					{/* Access Codes Section - Only visible in Edit mode */}
					{isEdit && (
						<div className="space-y-4 pt-4 border-t">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold">ACCESS CODES</h3>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="icon"
										onClick={() => setIsBulkDialogOpen(true)}
										title="Bulk Generate"
									>
										<Settings className="h-4 w-4" />
									</Button>
									<Button onClick={() => setIsCodeDialogOpen(true)}>
										New Code
									</Button>
								</div>
							</div>

							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Access Code</TableHead>
											<TableHead>Target User Group</TableHead>
											<TableHead className="w-[50px]">Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{codes.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={3}
													className="h-24 text-center text-muted-foreground"
												>
													No codes generated yet.
												</TableCell>
											</TableRow>
										) : (
											codes.map((code) => (
												<TableRow key={code.id}>
													<TableCell className="font-medium">
														{code.code}
													</TableCell>
													<TableCell>
														{code.targetUserGroup || "-"}
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
																		deleteCodeMutation.mutate({
																			id: code.id,
																		})
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
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={createMutation.isPending || updateMutation.isPending}
					>
						{createMutation.isPending || updateMutation.isPending
							? "Saving..."
							: "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>

			{groupId && (
				<>
					<AccessCodeDialog
						open={isCodeDialogOpen}
						onOpenChange={setIsCodeDialogOpen}
						groupId={groupId}
						workspaceId={workspaceId}
					/>
					<BulkGenerateDialog
						open={isBulkDialogOpen}
						onOpenChange={setIsBulkDialogOpen}
						groupId={groupId}
						workspaceId={workspaceId}
					/>
				</>
			)}
		</Dialog>
	);
}
