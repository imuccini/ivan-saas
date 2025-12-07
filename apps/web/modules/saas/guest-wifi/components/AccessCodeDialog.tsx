"use client";

import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { useState } from "react";
import { toast } from "sonner";

interface AccessCodeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	groupId: string;
	workspaceId: string;
}

export function AccessCodeDialog({
	open,
	onOpenChange,
	groupId,
	workspaceId,
}: AccessCodeDialogProps) {
	const [code, setCode] = useState("");
	const [targetUserGroup, setTargetUserGroup] = useState("");
	const queryClient = useQueryClient();

	const createMutation = useMutation(
		orpc.accessCodes.createCode.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.accessCodes.listCodes.queryKey({
						input: { groupId },
					}),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.accessCodes.listGroups.queryKey({
						input: { workspaceId },
					}),
				});
				toast.success("Access code created successfully");
				setCode("");
				setTargetUserGroup("");
				onOpenChange(false);
			},
			onError: () => {
				toast.error("Failed to create access code");
			},
		}),
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!code.trim()) return;
		createMutation.mutate({
			groupId,
			code,
			targetUserGroup: targetUserGroup || undefined,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Access Code</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="code">Access Code</Label>
						<Input
							id="code"
							placeholder="e.g. biotechaccess"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="targetUserGroup">Target User Group</Label>
						<Select
							value={targetUserGroup}
							onValueChange={setTargetUserGroup}
						>
							<SelectTrigger id="targetUserGroup">
								<SelectValue placeholder="Select group" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Conference Standard">
									Conference Standard
								</SelectItem>
								<SelectItem value="Standard Attendees">
									Standard Attendees
								</SelectItem>
								<SelectItem value="VIP">VIP</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Discard
						</Button>
						<Button type="submit" disabled={createMutation.isPending}>
							{createMutation.isPending ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
