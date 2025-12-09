"use client";

import {
	type CommunicationType,
	DEFAULT_COMMUNICATIONS,
} from "@saas/shared/lib/communication-types";
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
import { Tabs, TabsList, TabsTrigger } from "@ui/components/tabs";
import {
	Bold,
	CodeIcon,
	Italic,
	List,
	ListOrdered,
	Underline,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface EmailCommunicationEditorProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	communicationType: CommunicationType;
	initialSubject?: string;
	initialBody?: string;
	onSave: (data: { subject: string; body: string }) => void;
	showEnableToggle?: boolean;
	initialEnabled?: boolean;
}

export function EmailCommunicationEditor({
	open,
	onOpenChange,
	communicationType,
	initialSubject,
	initialBody,
	onSave,
	showEnableToggle = false,
	initialEnabled = true,
}: EmailCommunicationEditorProps) {
	const communication = DEFAULT_COMMUNICATIONS[communicationType];
	const [subject, setSubject] = useState(
		initialSubject || communication.defaultSubject,
	);
	const [body, setBody] = useState(initialBody || communication.defaultBody);
	const [viewMode, setViewMode] = useState<"visual" | "html">("visual");
	const [isEnabled, setIsEnabled] = useState(initialEnabled);
	const editorRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Update state when props change
	useEffect(() => {
		setSubject(initialSubject || communication.defaultSubject);
		setBody(initialBody || communication.defaultBody);
		setIsEnabled(initialEnabled);
	}, [
		initialSubject,
		initialBody,
		initialEnabled,
		communication.defaultSubject,
		communication.defaultBody,
	]);

	const handleSave = () => {
		onSave({ subject, body });
		onOpenChange(false);
	};

	const execCommand = (command: string, value?: string) => {
		document.execCommand(command, false, value);
		if (editorRef.current) {
			setBody(editorRef.current.innerHTML);
		}
	};

	const handleContentChange = () => {
		if (editorRef.current) {
			setBody(editorRef.current.innerHTML);
		}
	};

	const insertVariable = (variableKey: string) => {
		const variableText = `{$; ${variableKey}}`;

		if (viewMode === "visual" && editorRef.current) {
			// Insert at cursor in contentEditable
			document.execCommand("insertText", false, variableText);
			setBody(editorRef.current.innerHTML);
		} else if (textareaRef.current) {
			// Insert at cursor in textarea
			const textarea = textareaRef.current;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const newBody =
				body.substring(0, start) + variableText + body.substring(end);
			setBody(newBody);

			// Set cursor position after inserted text
			setTimeout(() => {
				textarea.selectionStart = textarea.selectionEnd =
					start + variableText.length;
				textarea.focus();
			}, 0);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{communication.name}</DialogTitle>
					<DialogDescription>
						<span className="font-medium">Trigger:</span>{" "}
						{communication.trigger}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Enable/Disable Toggle (optional) */}
					{showEnableToggle && (
						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<Label
									htmlFor="enable-email"
									className="text-base"
								>
									Send {communication.name}
								</Label>
								<p className="text-sm text-muted-foreground">
									Enable or disable this email communication
								</p>
							</div>
							<input
								type="checkbox"
								id="enable-email"
								checked={isEnabled}
								onChange={(e) => setIsEnabled(e.target.checked)}
								className="h-5 w-5"
							/>
						</div>
					)}

					{/* Email Subject */}
					<div className="space-y-2">
						<Label
							htmlFor="email-subject"
							className={
								!isEnabled ? "text-muted-foreground" : ""
							}
						>
							Subject
						</Label>
						<Input
							id="email-subject"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							placeholder="Enter email subject"
							disabled={!isEnabled}
							className={!isEnabled ? "opacity-50" : ""}
						/>
					</div>

					{/* Email Content */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label
								htmlFor="email-content"
								className={
									!isEnabled ? "text-muted-foreground" : ""
								}
							>
								Body Content
							</Label>
							<Tabs
								value={viewMode}
								onValueChange={(v) => {
									setViewMode(v as "visual" | "html");
								}}
								className="w-auto"
							>
								<TabsList className="h-8">
									<TabsTrigger
										value="visual"
										className="text-xs"
										disabled={!isEnabled}
									>
										Visual
									</TabsTrigger>
									<TabsTrigger
										value="html"
										className="text-xs"
										disabled={!isEnabled}
									>
										<CodeIcon className="mr-1 size-3" />
										HTML
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>

						{viewMode === "visual" ? (
							<div className="space-y-2">
								{/* Toolbar */}
								<div
									className={`flex flex-wrap gap-1 rounded-md border p-2 ${!isEnabled ? "opacity-50 pointer-events-none" : ""}`}
								>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0"
										onClick={() => execCommand("bold")}
										disabled={!isEnabled}
									>
										<Bold className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0"
										onClick={() => execCommand("italic")}
										disabled={!isEnabled}
									>
										<Italic className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0"
										onClick={() => execCommand("underline")}
										disabled={!isEnabled}
									>
										<Underline className="h-4 w-4" />
									</Button>
									<div className="w-px h-8 bg-border mx-1" />
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0"
										onClick={() =>
											execCommand("insertUnorderedList")
										}
										disabled={!isEnabled}
									>
										<List className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0"
										onClick={() =>
											execCommand("insertOrderedList")
										}
										disabled={!isEnabled}
									>
										<ListOrdered className="h-4 w-4" />
									</Button>
								</div>

								{/* Editor */}
								<div
									ref={editorRef}
									contentEditable={isEnabled}
									onInput={handleContentChange}
									dangerouslySetInnerHTML={{
										__html: body,
									}}
									className={`min-h-[300px] w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
										!isEnabled
											? "opacity-50 pointer-events-none"
											: ""
									}`}
									style={{
										whiteSpace: "pre-wrap",
										wordWrap: "break-word",
									}}
								/>
							</div>
						) : (
							<textarea
								ref={textareaRef}
								value={body}
								onChange={(e) => setBody(e.target.value)}
								disabled={!isEnabled}
								className={`min-h-[300px] w-full rounded-md border bg-background px-3 py-2 text-sm font-mono ${
									!isEnabled ? "opacity-50" : ""
								}`}
								placeholder="Enter HTML content"
							/>
						)}
					</div>

					{/* Supported Variables */}
					<div className="space-y-2">
						<Label>Supported Variables</Label>
						<p className="text-xs text-muted-foreground mb-2">
							Click a variable to insert it at the cursor position
						</p>
						<div className="flex flex-wrap gap-2">
							{communication.variables.map((variable) => (
								<Badge
									key={variable.key}
									variant="secondary"
									className="cursor-pointer hover:bg-secondary/80"
									onClick={() => insertVariable(variable.key)}
									title={`${variable.description}\nExample: ${variable.example}`}
								>
									{`{$; ${variable.key}}`}
								</Badge>
							))}
						</div>

						{/* Variable Reference */}
						{communication.variables.length > 0 && (
							<div className="rounded-lg border p-3 bg-muted/30 mt-3">
								<p className="text-xs font-medium mb-2">
									Variable Reference:
								</p>
								<div className="space-y-1">
									{communication.variables.map((variable) => (
										<div
											key={variable.key}
											className="text-xs"
										>
											<code className="font-mono">{`{$; ${variable.key}}`}</code>
											<span className="text-muted-foreground ml-2">
												- {variable.label}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
