"use client";

import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Textarea } from "@ui/components/textarea";
import { useState } from "react";

interface SupportedVariable {
	key: string;
	description: string;
	example: string;
}

interface CommunicationTemplate {
	id: string;
	type: "EMAIL" | "SMS";
	subject: string | null;
	bodyContent: string;
	isActive: boolean;
}

interface NotificationTrigger {
	id: string;
	eventKey: string;
	name: string;
	description: string | null;
	supportedVariables: SupportedVariable[];
}

interface TemplateEditorDialogProps {
	template: CommunicationTemplate;
	trigger: NotificationTrigger;
	open: boolean;
	onClose: () => void;
}

export function TemplateEditorDialog({
	template,
	trigger,
	open,
	onClose,
}: TemplateEditorDialogProps) {
	const queryClient = useQueryClient();
	const [subject, setSubject] = useState(template.subject || "");
	const [bodyContent, setBodyContent] = useState(template.bodyContent);

	const updateMutation = useMutation(
		orpc.communications.updateTemplate.mutationOptions(),
	);

	const handleSave = async () => {
		try {
			await updateMutation.mutateAsync({
				id: template.id,
				subject: template.type === "EMAIL" ? subject : undefined,
				bodyContent,
			});

			// Invalidate and refetch categories
			await queryClient.invalidateQueries({
				queryKey: ["communications", "listCategories"],
			});

			onClose();
		} catch (error) {
			console.error("Failed to update template:", error);
		}
	};

	const insertVariable = (variableKey: string) => {
		const cursorPos =
			(document.activeElement as HTMLTextAreaElement)?.selectionStart ||
			bodyContent.length;
		const before = bodyContent.substring(0, cursorPos);
		const after = bodyContent.substring(cursorPos);
		setBodyContent(`;
$;
{
	before;
}
{
	$;
	variableKey;
}
$;
{
	after;
}
`);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit {template.type} Template</DialogTitle>
					<DialogDescription>
						{trigger.name} - {trigger.eventKey}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{template.type === "EMAIL" && (
						<div className="space-y-2">
							<Label htmlFor="subject">Subject</Label>
							<Input
								id="subject"
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								placeholder="Email subject..."
							/>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="body">Body Content</Label>
						<Textarea
							id="body"
							value={bodyContent}
							onChange={(e) => setBodyContent(e.target.value)}
							placeholder="Message content..."
							rows={12}
							className="font-mono text-sm"
						/>
					</div>

					<div className="space-y-2">
						<Label>Supported Variables</Label>
						<p className="text-xs text-muted-foreground mb-2">
							Click a variable to insert it at the cursor position
						</p>
						<div className="flex flex-wrap gap-2">
							{trigger.supportedVariables.map((variable) => (
								<Badge
									key={variable.key}
									variant="secondary"
									className="cursor-pointer hover:bg-secondary/80"
									onClick={() => insertVariable(variable.key)}
									title={`;
$;
{
	variable.description;
}
\nExample: $
{
	variable.example;
}
`}
								>
									{`;
{
	$;
	variable.key;
}
`}
								</Badge>
							))}
						</div>
						{trigger.supportedVariables.length === 0 && (
							<p className="text-sm text-muted-foreground">
								No variables available for this template
							</p>
						)}
					</div>

					{trigger.supportedVariables.length > 0 && (
						<div className="rounded-lg border p-3 bg-muted/30">
							<p className="text-xs font-medium mb-2">
								Variable Reference:
							</p>
							<div className="space-y-1">
								{trigger.supportedVariables.map((variable) => (
									<div key={variable.key} className="text-xs">
										<code className="font-mono">{`;
{
	$;
	variable.key;
}
`}</code>
										<span className="text-muted-foreground ml-2">
											- {variable.description}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={updateMutation.isPending}
					>
						{updateMutation.isPending
							? "Saving..."
							: "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
