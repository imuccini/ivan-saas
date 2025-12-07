"use client";

import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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

interface BulkGenerateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	groupId: string;
	workspaceId: string;
}

export function BulkGenerateDialog({
	open,
	onOpenChange,
	groupId,
	workspaceId,
}: BulkGenerateDialogProps) {
	const [count, setCount] = useState(10);
	const [prefix, setPrefix] = useState("");
	const [targetUserGroup, setTargetUserGroup] = useState("");
	const queryClient = useQueryClient();

	const generateMutation = useMutation(
		orpc.accessCodes.bulkGenerateCodes.mutationOptions({
			onSuccess: (data) => {
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
				toast.success(`${data.length} codes generated successfully`);
				
				// Download CSV
				const csvContent =
					"data:text/csv;charset=utf-8," +
					"Access Code,Target User Group\n" +
					data
						.map((row) => `${row.code},${row.targetUserGroup || ""}`)
						.join("\n");
				const encodedUri = encodeURI(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "access_codes.csv");
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				onOpenChange(false);
			},
			onError: () => {
				toast.error("Failed to generate codes");
			},
		}),
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		generateMutation.mutate({
			groupId,
			count: Number(count),
			prefix: prefix || undefined,
			targetUserGroup: targetUserGroup || undefined,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Bulk Generate Codes</DialogTitle>
					<DialogDescription>
						Generate multiple access codes at once and download them as CSV.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="count">Number of Codes</Label>
						<Input
							id="count"
							type="number"
							min={1}
							max={1000}
							value={count}
							onChange={(e) => setCount(Number(e.target.value))}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="prefix">Code Prefix (Optional)</Label>
						<Input
							id="prefix"
							placeholder="e.g. EVENT-"
							value={prefix}
							onChange={(e) => setPrefix(e.target.value)}
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
							Cancel
						</Button>
						<Button type="submit" disabled={generateMutation.isPending}>
							{generateMutation.isPending ? "Generating..." : "Generate & Download"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
