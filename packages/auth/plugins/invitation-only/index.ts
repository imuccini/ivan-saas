// Import application configuration settings
import { config } from "@repo/config";
// Import a database function to retrieve pending invitations by email
import { getPendingInvitationByEmail } from "@repo/database";
// Import the type definition for a BetterAuth plugin
import type { BetterAuthPlugin } from "better-auth";
// Import the APIError class for handling API-specific errors
import { APIError } from "better-auth/api";
// Import a utility to create authentication middleware
import { createAuthMiddleware } from "better-auth/plugins";

/**
 * A BetterAuth plugin that restricts user sign-ups to only those with a pending invitation.
 * This plugin is active only when `config.auth.enableSignup` is false.
 */
export const invitationOnlyPlugin = () =>
	({
		// A unique identifier for the plugin
		id: "invitationOnlyPlugin",
		// Hooks that run at different stages of the authentication process
		hooks: {
			// A hook that runs before the sign-up process
			before: [
				{
					// A matcher function to determine if this hook should run for the current request
					matcher: (context) =>
						context.path.startsWith("/sign-up/email"),
					// The handler function that contains the logic for the hook
					handler: createAuthMiddleware(async (ctx) => {
						// If sign-ups are enabled in the configuration, do nothing
						if (config.auth.enableSignup) {
							return;
						}

						// Extract the email from the request body
						const { email } = ctx.body;

						// Check if there is a pending invitation for the provided email
						const hasInvitation =
							await getPendingInvitationByEmail(email);

						// If no invitation is found, throw an error
						if (!hasInvitation) {
							throw new APIError("BAD_REQUEST", {
								code: "INVALID_INVITATION",
								message: "No invitation found for this email",
							});
						}
					}),
				},
			],
		},
		// Custom error codes defined by this plugin
		$ERROR_CODES: {
			INVALID_INVITATION: "No invitation found for this email",
		},
	}) satisfies BetterAuthPlugin;
