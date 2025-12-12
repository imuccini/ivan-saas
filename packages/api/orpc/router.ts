import type { RouterClient } from "@orpc/server";
import { accessCodesRouter } from "../modules/access-codes/router";
import { adminRouter } from "../modules/admin/router";
import { aiRouter } from "../modules/ai/router";
import { communicationsRouter } from "../modules/communications/router";
import { contactRouter } from "../modules/contact/router";
import { customFieldsRouter } from "../modules/custom-fields/router";
import { guestWifiRouter } from "../modules/guest-wifi/router";
import { integrationsRouter } from "../modules/networks/integrations";
import { merakiProxyRouter } from "../modules/networks/meraki-proxy";
import { networkProvisioningRouter } from "../modules/networks/network-provisioning";
import { networksRouter } from "../modules/networks/networks";
import { newsletterRouter } from "../modules/newsletter/router";
import { onboardingRouter } from "../modules/onboarding/router";
import { organizationsRouter } from "../modules/organizations/router";
import { paymentsRouter } from "../modules/payments/router";
import { sponsorsRouter } from "../modules/sponsors/router";
import { termsRouter } from "../modules/terms/router";
import { usersRouter } from "../modules/users/router";
import { workspacesRouter } from "../modules/workspaces/router";
import { publicProcedure } from "./procedures";

export const router = publicProcedure
	// Prefix for openapi
	.prefix("/api")
	.router({
		admin: adminRouter,
		newsletter: newsletterRouter,
		contact: contactRouter,
		organizations: organizationsRouter,
		workspaces: workspacesRouter,
		users: usersRouter,
		payments: paymentsRouter,
		ai: aiRouter,
		communications: communicationsRouter,
		terms: termsRouter,
		customFields: customFieldsRouter,
		guestWifi: guestWifiRouter,
		sponsors: sponsorsRouter,
		accessCodes: accessCodesRouter,
		integrations: integrationsRouter,
		meraki: merakiProxyRouter,
		onboarding: onboardingRouter,
		networks: {
			...networksRouter,
			provision: networkProvisioningRouter.provision,
		},
	});

export type ApiRouterClient = RouterClient<typeof router>;

// Export type for inferring output types from the router
export type RouterOutputs = ApiRouterClient;
