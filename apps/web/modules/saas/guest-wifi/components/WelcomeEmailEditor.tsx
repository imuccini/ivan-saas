"use client";

import { EmailCommunicationEditor } from "@saas/shared/components/EmailCommunicationEditor";

interface WelcomeEmailEditorProps {
	open: boolean;
	onClose: () => void;
}

export function WelcomeEmailEditor({ open, onClose }: WelcomeEmailEditorProps) {
	const handleSave = (data: { subject: string; body: string }) => {
		// Handle save logic here
		console.log("Saving email configuration:", data);
		// TODO: Integrate with backend API to save email configuration
	};

	return (
		<EmailCommunicationEditor
			open={open}
			onOpenChange={onClose}
			communicationType="guest-welcome"
			onSave={handleSave}
			showEnableToggle={true}
			initialEnabled={true}
		/>
	);
}
