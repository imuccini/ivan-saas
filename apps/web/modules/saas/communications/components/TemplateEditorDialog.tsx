"use client";

import { EmailCommunicationEditor } from "@saas/shared/components/EmailCommunicationEditor";
import type { CommunicationType } from "@saas/shared/lib/communication-types";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

// Map event keys to communication types
const EVENT_KEY_TO_COMMUNICATION_TYPE: Record<string, CommunicationType> = {
	GUEST_SIGNUP: "guest-welcome",
	EMPLOYEE_SIGNUP: "byod-invite",
	EMPLOYEE_ACTIVE: "byod-onboarding",
	GUEST_SPONSOR_REQUEST: "sponsor-approval",
};

export function TemplateEditorDialog({
	template,
	trigger,
	open,
	onClose,
}: TemplateEditorDialogProps) {
	const queryClient = useQueryClient();

	const updateMutation = useMutation(
		orpc.communications.updateTemplate.mutationOptions(),
	);

	const handleSave = async (data: { subject: string; body: string }) => {
		try {
			await updateMutation.mutateAsync({
				id: template.id,
				subject: template.type === "EMAIL" ? data.subject : undefined,
				bodyContent: data.body,
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

	// Determine communication type from event key
	const communicationType =
		EVENT_KEY_TO_COMMUNICATION_TYPE[trigger.eventKey] || "guest-welcome";

	// Only show email editor for EMAIL templates
	if (template.type !== "EMAIL") {
		return null;
	}

	return (
		<EmailCommunicationEditor
			open={open}
			onOpenChange={onClose}
			communicationType={communicationType}
			initialSubject={template.subject || ""}
			initialBody={template.bodyContent}
			onSave={handleSave}
		/>
	);
}
