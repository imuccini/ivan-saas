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

interface DeleteTermDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	termName?: string;
}

export function DeleteTermDialog({
	open,
	onClose,
	onConfirm,
	termName,
}: DeleteTermDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Term</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete "{termName}"? This
						action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
