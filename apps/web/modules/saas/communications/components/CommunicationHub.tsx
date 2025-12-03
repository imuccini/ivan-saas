"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Skeleton } from "@ui/components/skeleton";
import { Switch } from "@ui/components/switch";
import { Edit, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { TemplateEditorDialog } from "./TemplateEditorDialog";

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
	workspaceId: string | null; // NULL = global, non-NULL = workspace-specific
}

interface NotificationTrigger {
	id: string;
	eventKey: string;
	name: string;
	description: string | null;
	supportedVariables: SupportedVariable[];
	templates: CommunicationTemplate[];
}

interface NotificationCategory {
	id: string;
	name: string;
	description: string | null;
	triggers: NotificationTrigger[];
}

type CommunicationHubProps = {};

export function CommunicationHub(_props: CommunicationHubProps = {}) {
	const [editingTemplate, setEditingTemplate] = useState<{
		template: CommunicationTemplate;
		trigger: NotificationTrigger;
	} | null>(null);

	// Get active workspace from context
	const { activeWorkspace } = useActiveWorkspace();

	const { data: categories, isLoading } = useQuery(
		orpc.communications.listCategories.queryOptions({
			input: {
				workspaceId: activeWorkspace?.id || "",
			},
		}),
	);

	const toggleMutation = useMutation(
		orpc.communications.toggleTemplate.mutationOptions(),
	);

	const handleToggle = async (templateId: string, isActive: boolean) => {
		try {
			await toggleMutation.mutateAsync({
				id: templateId,
				isActive,
			});
		} catch (error) {
			console.error("Failed to toggle template:", error);
		}
	};

	const [activeTab, setActiveTab] = useState<"all" | "guest" | "employee">(
		"all",
	);

	// Filter categories based on active tab
	const filteredCategories = categories?.filter((category) => {
		if (activeTab === "all") return true;
		if (activeTab === "guest")
			return category.slug === "guest-wifi-notifications";
		if (activeTab === "employee")
			return category.slug === "employee-notifications";
		return true;
	});

	// Flatten all triggers from filtered categories
	const allTriggers = filteredCategories?.flatMap(
		(category) => category.triggers,
	);

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Communication Manager</h1>
				<p className="text-muted-foreground mt-2">
					Manage transactional communications and notification
					templates
				</p>
			</div>

			{/* Filter Chips */}
			<div className="flex gap-2">
				<Badge
					variant={activeTab === "all" ? "default" : "outline"}
					className="cursor-pointer"
					onClick={() => setActiveTab("all")}
				>
					All
				</Badge>
				<Badge
					variant={activeTab === "guest" ? "default" : "outline"}
					className="cursor-pointer"
					onClick={() => setActiveTab("guest")}
				>
					Guest WiFi
				</Badge>
				<Badge
					variant={activeTab === "employee" ? "default" : "outline"}
					className="cursor-pointer"
					onClick={() => setActiveTab("employee")}
				>
					Employees
				</Badge>
			</div>

			{/* Plain list of triggers */}
			<div className="space-y-3">
				{allTriggers?.map((trigger) => (
					<div
						key={trigger.id}
						className="rounded-lg border p-4 space-y-3"
					>
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<h3 className="font-semibold">
									{trigger.name}
								</h3>
								{trigger.description && (
									<p className="text-sm text-muted-foreground mt-1">
										{trigger.description}
									</p>
								)}
								<div className="flex items-center gap-2 mt-2">
									<Badge
										variant="outline"
										className="text-xs"
									>
										{trigger.eventKey}
									</Badge>
									<span className="text-xs text-muted-foreground">
										{(trigger.supportedVariables as any)
											?.length || 0}{" "}
										variables
									</span>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							{trigger.templates.map((template) => (
								<div
									key={template.id}
									className="flex items-center justify-between rounded-md border p-3 bg-muted/30"
								>
									<div className="flex items-center gap-3">
										{template.type === "EMAIL" ? (
											<Mail className="h-4 w-4 text-muted-foreground" />
										) : (
											<MessageSquare className="h-4 w-4 text-muted-foreground" />
										)}
										<div>
											<p className="text-sm font-medium">
												{template.type === "EMAIL"
													? template.subject ||
														"Email Template"
													: "SMS Template"}
											</p>
											<p className="text-xs text-muted-foreground">
												{template.type}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<Switch
											checked={template.isActive}
											onCheckedChange={(checked) =>
												handleToggle(
													template.id,
													checked,
												)
											}
											disabled={toggleMutation.isPending}
										/>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												setEditingTemplate({
													template,
													trigger,
												})
											}
										>
											<Edit className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			{editingTemplate && (
				<TemplateEditorDialog
					template={editingTemplate.template}
					trigger={editingTemplate.trigger}
					open={!!editingTemplate}
					onClose={() => setEditingTemplate(null)}
				/>
			)}
		</div>
	);
}
