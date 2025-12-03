"use client";

import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { useState } from "react";

interface TermPreviewProps {
	label: string;
	linkText: string;
	documentTitle: string;
	documentContent: string;
	isPreChecked: boolean;
}

export function TermPreview({
	label,
	linkText,
	documentTitle,
	documentContent,
	isPreChecked,
}: TermPreviewProps) {
	const [documentOpen, setDocumentOpen] = useState(false);

	return (
		<>
			<Card className="p-4">
				<div className="flex items-start gap-3">
					<input
						type="checkbox"
						defaultChecked={isPreChecked}
						className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<div className="flex-1">
						<span className="text-sm">{label} </span>
						<Button
							variant="link"
							className="h-auto p-0 text-sm text-primary underline"
							onClick={() => setDocumentOpen(true)}
						>
							{linkText}
						</Button>
					</div>
				</div>
			</Card>

			{/* Document Modal */}
			<Dialog open={documentOpen} onOpenChange={setDocumentOpen}>
				<DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{documentTitle}</DialogTitle>
					</DialogHeader>
					<div
						className="prose prose-sm max-w-none"
						dangerouslySetInnerHTML={{ __html: documentContent }}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
