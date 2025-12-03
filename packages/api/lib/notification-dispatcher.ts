import { db } from "@repo/database";

interface NotificationPayload {
	[key: string]: string | number | boolean;
}

interface SupportedVariable {
	key: string;
	description: string;
	example: string;
}

/**
 * NotificationDispatcher - Core service for sending event-based notifications
 *
 * This service:
 * 1. Looks up notification triggers by event key
 * 2. Fetches active templates for the trigger
 * 3. Performs variable substitution
 * 4. Sends notifications via appropriate channels
 */
export class NotificationDispatcher {
	/**
	 * Main entry point for dispatching notifications
	 *
	 * @param eventKey - The unique event identifier (e.g., "GUEST_SIGNUP")
	 * @param payload - Data object containing variables for substitution
	 * @param recipientEmail - Email address of the recipient
	 */
	async dispatch(
		eventKey: string,
		payload: NotificationPayload,
		recipientEmail: string,
	): Promise<void> {
		console.log(
			`📨 Dispatching notification for event: ${eventKey} to ${recipientEmail}`,
		);

		// 1. Look up the trigger
		const trigger = await db.notificationTrigger.findUnique({
			where: { eventKey },
			include: {
				templates: {
					where: { isActive: true },
				},
			},
		});

		if (!trigger) {
			console.warn(`⚠️  No trigger found for event: ${eventKey}`);
			return;
		}

		if (trigger.templates.length === 0) {
			console.warn(
				`⚠️  No active templates found for trigger: ${trigger.name}`,
			);
			return;
		}

		// 2. Process each active template
		for (const template of trigger.templates) {
			try {
				const processedSubject = template.subject
					? this.processTemplate(template.subject, payload)
					: undefined;
				const processedBody = this.processTemplate(
					template.bodyContent,
					payload,
				);

				// 3. Send based on template type
				if (template.type === "EMAIL") {
					await this.sendEmail(
						recipientEmail,
						processedSubject || "Notification",
						processedBody,
					);
				} else if (template.type === "SMS") {
					await this.sendSMS(recipientEmail, processedBody);
				}

				console.log(
					`  ✓ Sent ${template.type} notification: ${processedSubject || "SMS"}`,
				);
			} catch (error) {
				console.error(
					`  ❌ Error sending ${template.type} notification:`,
					error,
				);
			}
		}
	}

	/**
	 * Process template by replacing variables with actual values
	 *
	 * Supports both {variable} and {{variable}} syntax
	 *
	 * @param template - Template string with placeholders
	 * @param variables - Object containing variable values
	 * @returns Processed template with substituted values
	 */
	processTemplate(template: string, variables: NotificationPayload): string {
		let processed = template;

		// Replace {variable} and {{variable}} patterns
		for (const [key, value] of Object.entries(variables)) {
			const regex1 = new RegExp(`\\{${key}\\}`, "g");
			const regex2 = new RegExp(`\\{\\{${key}\\}\\}`, "g");

			processed = processed.replace(regex1, String(value));
			processed = processed.replace(regex2, String(value));
		}

		return processed;
	}

	/**
	 * Mock email sender - logs to console
	 *
	 * In production, this would integrate with an email service
	 * like SendGrid, AWS SES, or Resend
	 *
	 * @param to - Recipient email address
	 * @param subject - Email subject
	 * @param body - Email body (HTML)
	 */
	private async sendEmail(
		to: string,
		subject: string,
		body: string,
	): Promise<void> {
		console.log("\n📧 ========== EMAIL ==========");
		console.log(`To: ${to}`);
		console.log(`Subject: ${subject}`);
		console.log("Body:");
		console.log(body);
		console.log("============================\n");

		// TODO: Integrate with actual email service
		// await emailService.send({ to, subject, html: body });
	}

	/**
	 * Mock SMS sender - logs to console
	 *
	 * In production, this would integrate with an SMS service
	 * like Twilio or AWS SNS
	 *
	 * @param to - Recipient phone number or email (for testing)
	 * @param message - SMS message content
	 */
	private async sendSMS(to: string, message: string): Promise<void> {
		console.log("\n📱 ========== SMS ==========");
		console.log(`To: ${to}`);
		console.log("Message:");
		console.log(message);
		console.log("===========================\n");

		// TODO: Integrate with actual SMS service
		// await smsService.send({ to, message });
	}
}

// Export singleton instance
export const notificationDispatcher = new NotificationDispatcher();
