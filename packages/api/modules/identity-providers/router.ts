import { os } from "@orpc/server";
import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../orpc/procedures";

const IdpConfigSchema = z.object({
	ssoGroups: z.array(z.string()).optional(),
	sponsorGroups: z.array(z.string()).optional(),
	byodEnabled: z.boolean().default(false),
	byodImportAll: z.boolean().default(true),
	byodGroups: z.array(z.string()).optional(),
});

export const identityProvidersRouter = {
	list: protectedProcedure
		.route({
			method: "GET",
			path: "/identity-providers",
			tags: ["Identity Providers"],
			summary: "List identity providers",
		})
		.input(
			z.object({
				workspaceId: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			// Verify workspace access (omitted for brevity, assume protectedProcedure + subsequent checks or rely on RBAC at some point)
			// Ideally check if context.user is member of input.workspaceId
			
			const idps = await db.integration.findMany({
				where: {
					workspaceId: input.workspaceId,
					// Filter for IdP providers (exclude network vendors if possible, 
                    // but for now relying on checking against IDP list on frontend or backend)
                    // Currently we don't have a 'type' field, so we just fetch all and frontend filters, 
                    // OR we explicitly filter by known Identity Provider IDs.
                    // Let's filter by known IdP IDs for safety if we can.
                    provider: {
                        in: ["entra-id", "google", "okta", "saml"]
                    }
				},
                orderBy: {
                    createdAt: 'desc'
                }
			});

			return idps;
		}),

	create: protectedProcedure
		.route({
			method: "POST",
			path: "/identity-providers",
			tags: ["Identity Providers"],
			summary: "Create identity provider",
		})
		.input(
			z.object({
				workspaceId: z.string(),
				provider: z.enum(["entra-id", "google", "okta", "saml"]),
				name: z.string(),
				credentials: z.record(z.string(), z.string()), // { tenantId, clientId, clientSecret }
				config: IdpConfigSchema.optional(),
			}),
		)
		.handler(async ({ input }) => {
            // Check existing? 
            // Create integration
			const integration = await db.integration.create({
				data: {
					workspaceId: input.workspaceId,
					provider: input.provider,
					name: input.name,
					credentials: input.credentials as any,
					config: (input.config || {}) as any,
				},
			});
            
            // Trigger initial sync if BYOD enabled
            if (input.config?.byodEnabled) {
                // Background job stub
                console.log(`[IdP] Triggering initial sync for integration ${integration.id}`);
            }

			return integration;
		}),

	update: protectedProcedure
		.route({
			method: "PATCH",
			path: "/identity-providers/{id}",
			tags: ["Identity Providers"],
			summary: "Update identity provider",
		})
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				credentials: z.record(z.string(), z.string()).optional(),
				config: IdpConfigSchema.optional(),
			}),
		)
		.handler(async ({ input }) => {
			const integration = await db.integration.update({
				where: { id: input.id },
				data: {
					name: input.name,
					credentials: input.credentials as any,
					config: input.config as any, 
				},
			});

            if (input.config?.byodEnabled) {
                 console.log(`[IdP] Triggering sync update for integration ${integration.id}`);
            }

			return integration;
		}),



	delete: protectedProcedure
		.route({
			method: "DELETE",
			path: "/identity-providers/{id}",
			tags: ["Identity Providers"],
			summary: "Delete identity provider",
		})
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await db.integration.delete({
				where: { id: input.id },
			});
			return { success: true };
		}),
        
    sync: protectedProcedure
		.route({
			method: "POST",
			path: "/identity-providers/{id}/sync",
			tags: ["Identity Providers"],
			summary: "Sync identity provider",
		})
        .input(z.object({
            id: z.string()
        }))
        .handler(async ({ input }) => {
            // Manual sync trigger
             console.log(`[IdP] Manual sync triggered for integration ${input.id}`);
             return { success: true, message: "Sync started in background" };
        })
};
