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
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Switch } from "@ui/components/switch";
import { Tabs, TabsList, TabsTrigger } from "@ui/components/tabs";
import {
	Bold,
	CodeIcon,
	Italic,
	List,
	ListOrdered,
	Underline,
} from "lucide-react";
import { useRef, useState } from "react";

interface WelcomeEmailEditorProps {
	open: boolean;
	onClose: () => void;
}

export function WelcomeEmailEditor({ open, onClose }: WelcomeEmailEditorProps) {
	const [isEnabled, setIsEnabled] = useState(true);
	const [subject, setSubject] = useState("Welcome to Our Guest WiFi Network");
	const [content, setContent] = useState(
		"<p>Dear Guest,</p><p>Welcome to our WiFi network! We're glad to have you connected.</p><p>If you need any assistance, please don't hesitate to contact our support team.</p><p>Best regards,<br/>The Team</p>",
	);
	const [viewMode, setViewMode] = useState<"visual" | "html">("visual");
	const editorRef = useRef<HTMLDivElement>(null);

	const handleSave = () => {
		// Handle save logic here
		console.log("Saving email configuration:", {
			enabled: isEnabled,
			subject,
			content,
		});
		onClose();
	};

	const execCommand = (command: string, value?: string) => {
		document.execCommand(command, false, value);
		if (editorRef.current) {
			setContent(editorRef.current.innerHTML);
		}
	};

	const handleContentChange = () => {
		if (editorRef.current) {
			setContent(editorRef.current.innerHTML);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Welcome Email Editor</DialogTitle>
					<DialogDescription>
						Configure the delivery and content of the welcome email
						sent to guests
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Enable/Disable Toggle */}
					<div className="flex items-center justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<Label htmlFor="enable-email" className="text-base">
								Send Welcome Email
							</Label>
							<p className="text-sm text-muted-foreground">
								Enable or disable the welcome email for new
								guests
							</p>
						</div>
						<Switch
							id="enable-email"
							checked={isEnabled}
							onCheckedChange={setIsEnabled}
						/>
					</div>

					{/* Email Subject */}
					<div className="space-y-2">
						<Label
							htmlFor="email-subject"
							className={
								!isEnabled ? "text-muted-foreground" : ""
							}
						>
							Email Subject
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
								Email Content
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
										__html: content,
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
								value={content}
								onChange={(e) => setContent(e.target.value)}
								disabled={!isEnabled}
								className={`min-h-[300px] w-full rounded-md border bg-background px-3 py-2 text-sm font-mono ${
									!isEnabled ? "opacity-50" : ""
								}`}
								placeholder="Enter HTML content"
							/>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
