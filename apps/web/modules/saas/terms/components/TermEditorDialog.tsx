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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Switch } from "@ui/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { Textarea } from "@ui/components/textarea";
import { useEffect, useState } from "react";
import { TermPreview } from "./TermPreview";

interface TermEditorDialogProps {
	open: boolean;
	onClose: () => void;
	term?: any;
	workspaceId: string;
}

export function TermEditorDialog({
	open,
	onClose,
	term,
	workspaceId,
}: TermEditorDialogProps) {
	const queryClient = useQueryClient();
	const isEdit = !!term;

	// Form state
	const [name, setName] = useState("");
	const [version, setVersion] = useState("1.0");
	const [category, setCategory] = useState<string>("PRIVACY_POLICY");
	const [isMandatory, setIsMandatory] = useState(false);
	const [isPreChecked, setIsPreChecked] = useState(false);
	const [activeLanguage, setActiveLanguage] = useState("en");
	const [translations, setTranslations] = useState<Record<string, any>>({
		en: {
			label: "I agree to the",
			linkText: "Privacy Policy",
			documentTitle: "Privacy Policy",
			documentContent: "<p>Enter your legal text here...</p>",
		},
	});

	// Reset form when term changes
	useEffect(() => {
		if (term) {
			setName(term.name);
			setVersion(term.version);
			setCategory(term.category);
			setIsMandatory(term.isMandatory);
			setIsPreChecked(term.isPreChecked);
			setTranslations(term.translations);
		} else {
			setName("");
			setVersion("1.0");
			setCategory("PRIVACY_POLICY");
			setIsMandatory(false);
			setIsPreChecked(false);
			setTranslations({
				en: {
					label: "I agree to the",
					linkText: "Privacy Policy",
					documentTitle: "Privacy Policy",
					documentContent: "<p>Enter your legal text here...</p>",
				},
			});
		}
	}, [term]);

	// Create mutation
	const createMutation = useMutation(
		orpc.terms.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.terms.list.queryKey({
						input: { workspaceId },
					}),
				});
				onClose();
			},
		}),
	);

	// Update mutation
	const updateMutation = useMutation(
		orpc.terms.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.terms.list.queryKey({
						input: { workspaceId },
					}),
				});
				onClose();
			},
		}),
	);

	const handleSave = (status: "DRAFT" | "PUBLISHED") => {
		const data = {
			workspaceId,
			name,
			version,
			category: category as any,
			isMandatory,
			isPreChecked,
			status,
			translations,
		};

		if (isEdit) {
			updateMutation.mutate({
				id: term.id,
				...data,
			});
		} else {
			createMutation.mutate(data);
		}
	};

	const updateTranslation = (field: string, value: string) => {
		setTranslations({
			...translations,
			[activeLanguage]: {
				...translations[activeLanguage],
				[field]: value,
			},
		});
	};

	const currentTranslation = translations[activeLanguage] || {
		label: "",
		linkText: "",
		documentTitle: "",
		documentContent: "",
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? "Edit Term" : "Create New Term"}
					</DialogTitle>
					<DialogDescription>
						Configure the term settings and content for multiple
						languages.
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="general" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="general">
							General Settings
						</TabsTrigger>
						<TabsTrigger value="content">
							Content Configuration
						</TabsTrigger>
					</TabsList>

					{/* General Settings Tab */}
					<TabsContent value="general" className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Internal Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g., Privacy Policy"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="version">Version</Label>
							<Input
								id="version"
								value={version}
								onChange={(e) => setVersion(e.target.value)}
								placeholder="e.g., 1.0"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="category">Category</Label>
							<Select
								value={category}
								onValueChange={setCategory}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="PRIVACY_POLICY">
										Privacy Policy
									</SelectItem>
									<SelectItem value="TERMS_OF_USE">
										Terms of Use
									</SelectItem>
									<SelectItem value="COOKIE_POLICY">
										Cookie Policy
									</SelectItem>
									<SelectItem value="OTHER">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<Label htmlFor="mandatory">Mandatory</Label>
								<p className="text-sm text-muted-foreground">
									Users must accept this term to proceed
								</p>
							</div>
							<Switch
								id="mandatory"
								checked={isMandatory}
								onCheckedChange={setIsMandatory}
							/>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<Label htmlFor="prechecked">Pre-checked</Label>
								<p className="text-sm text-muted-foreground">
									Checkbox is checked by default
								</p>
							</div>
							<Switch
								id="prechecked"
								checked={isPreChecked}
								onCheckedChange={setIsPreChecked}
							/>
						</div>
					</TabsContent>

					{/* Content Configuration Tab */}
					<TabsContent value="content" className="space-y-4">
						{/* Language Selector */}
						<div className="flex items-center gap-2">
							<Label>Language:</Label>
							<div className="flex gap-2">
								{Object.keys(translations).map((lang) => (
									<Badge
										key={lang}
										variant={
											activeLanguage === lang
												? "default"
												: "outline"
										}
										className="cursor-pointer"
										onClick={() => setActiveLanguage(lang)}
									>
										{lang.toUpperCase()}
									</Badge>
								))}
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										const newLang = prompt(
											"Enter language code (e.g., es, fr):",
										);
										if (newLang && !translations[newLang]) {
											setTranslations({
												...translations,
												[newLang]: {
													label: "",
													linkText: "",
													documentTitle: "",
													documentContent: "",
												},
											});
											setActiveLanguage(newLang);
										}
									}}
								>
									+ Add Language
								</Button>
							</div>
						</div>

						{/* Translation Fields */}
						<div className="space-y-2">
							<Label htmlFor="label">Checkbox Label</Label>
							<Input
								id="label"
								value={currentTranslation.label}
								onChange={(e) =>
									updateTranslation("label", e.target.value)
								}
								placeholder="e.g., I agree to the"
							/>
							<p className="text-xs text-muted-foreground">
								Text displayed next to the checkbox
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="linkText">Link Text</Label>
							<Input
								id="linkText"
								value={currentTranslation.linkText}
								onChange={(e) =>
									updateTranslation(
										"linkText",
										e.target.value,
									)
								}
								placeholder="e.g., Privacy Policy"
							/>
							<p className="text-xs text-muted-foreground">
								Clickable text that opens the document
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="documentTitle">
								Document Title
							</Label>
							<Input
								id="documentTitle"
								value={currentTranslation.documentTitle}
								onChange={(e) =>
									updateTranslation(
										"documentTitle",
										e.target.value,
									)
								}
								placeholder="e.g., Privacy Policy"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="documentContent">
								Document Content
							</Label>
							<Textarea
								id="documentContent"
								value={currentTranslation.documentContent}
								onChange={(e) =>
									updateTranslation(
										"documentContent",
										e.target.value,
									)
								}
								placeholder="Enter the full legal text here..."
								rows={8}
								className="font-mono text-sm"
							/>
							<p className="text-xs text-muted-foreground">
								HTML content is supported
							</p>
						</div>

						{/* Preview */}
						<div className="space-y-2">
							<Label>Preview</Label>
							<TermPreview
								label={currentTranslation.label}
								linkText={currentTranslation.linkText}
								documentTitle={currentTranslation.documentTitle}
								documentContent={
									currentTranslation.documentContent
								}
								isPreChecked={isPreChecked}
							/>
						</div>
					</TabsContent>
				</Tabs>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="secondary"
						onClick={() => handleSave("DRAFT")}
					>
						Save as Draft
					</Button>
					<Button onClick={() => handleSave("PUBLISHED")}>
						{isEdit ? "Update & Publish" : "Create & Publish"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
