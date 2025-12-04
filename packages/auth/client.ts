// Import client-side plugins for the authentication service
import {
	adminClient,
	inferAdditionalFields,
	magicLinkClient,
	organizationClient,
	passkeyClient,
	twoFactorClient,
	emailOTPClient,
} from "better-auth/client/plugins";
// Import the main client-side authentication library for React
import { createAuthClient } from "better-auth/react";
// Import the server-side authentication configuration to infer types
import type { auth } from ".";

// Create and configure the authentication client
export const authClient = createAuthClient({
	// Enable and configure various client-side authentication plugins
	plugins: [
		// Infers additional user fields from the server-side configuration
		inferAdditionalFields<typeof auth>(),
		// Enables magic link authentication on the client
		magicLinkClient(),
		// Enables organization management features on the client
		organizationClient(),
		// Enables admin-specific features on the client
		adminClient(),
		// Enables passkey (WebAuthn) authentication on the client
		passkeyClient(),
		// Enables two-factor authentication on the client
		twoFactorClient(),
		emailOTPClient(),
	],
});

// Define a TypeScript type for custom authentication client error codes
export type AuthClientErrorCodes = typeof authClient.$ERROR_CODES & {
	INVALID_INVITATION: string;
};
