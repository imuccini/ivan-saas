import { ORPCError } from "@orpc/server";
import { db } from "@repo/database";
import { z } from "zod";
import { encrypt } from "../../lib/encryption";
import { protectedProcedure } from "../../orpc/procedures";

const listIntegrations = protectedProcedure
	.route({
		method: "GET",
		path: "/integrations",
		tags: ["Integrations"],
		summary: "List integrations",
	})
	.input(
		z.object({
			workspaceId: z.string(),
			provider: z.string().optional(),
		}),
	)
	.handler(async ({ input, context }) => {
		const { user } = context;

		// Verify workspace access
		const workspace = await db.workspace.findUnique({
			where: { id: input.workspaceId },
			include: { organization: true },
		});

		if (!workspace) {
			throw new ORPCError("NOT_FOUND", {
				message: "Workspace not found",
			});
		}

		const member = await db.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: workspace.organizationId,
					userId: user.id,
				},
			},
		});

		if (!member && user.role !== "admin") {
			throw new ORPCError("FORBIDDEN", {
				message: "You are not a member of this organization",
			});
		}

		const integrations = await db.integration.findMany({
			where: {
				workspaceId: input.workspaceId,
				...(input.provider ? { provider: input.provider } : {}),
			},
			orderBy: {
				createdAt: "desc",
			},
			select: {
				id: true,
				name: true,
				provider: true,
				createdAt: true,
				credentials: true, // We need this to fetch AP counts from Meraki
				networks: {
					select: {
						id: true,
						externalId: true,
					},
				},
			},
		});

		// Enrich with network and AP counts
		const enrichedIntegrations = await Promise.all(
			integrations.map(async (integration) => {
				const networkCount = integration.networks.length;
				let accessPointCount = 0;

				// For Meraki integrations, fetch AP counts from the API
				if (
					integration.provider === "meraki" &&
					integration.credentials
				) {
					try {
						// Decrypt API key (you'll need to implement decrypt function)
						// const apiKey = decrypt(integration.credentials.apiKey);

						// For now, we'll use a placeholder
						// In production, you'd fetch from Meraki API for each network
						// const devices = await fetch(`https://api.meraki.com/api/v1/networks/${network.externalId}/devices`)

						// Placeholder: assume 0 APs for now
						// This should be replaced with actual Meraki API calls
						accessPointCount = 0;
					} catch (error) {
						console.error(
							`Failed to fetch AP count for integration ${integration.id}:`,
							error,
						);
					}
				}

				return {
					id: integration.id,
					name: integration.name,
					provider: integration.provider,
					createdAt: integration.createdAt,
					networkCount,
					accessPointCount,
				};
			}),
		);

		return enrichedIntegrations;
	});

const createIntegration = protectedProcedure
	.route({
		method: "POST",
		path: "/integrations",
		tags: ["Integrations"],
		summary: "Create integration",
	})
	.input(
		z.object({
			workspaceId: z.string(),
			provider: z.string(),
			name: z.string(),
			credentials: z.object({
				apiKey: z.string().optional(),
				clientId: z.string().optional(),
				clientSecret: z.string().optional(),
				username: z.string().optional(),
				password: z.string().optional(),
				controllerUrl: z.string().optional(),
				allowSelfSigned: z.boolean().optional(),
				regionId: z.string().optional(),
				regionUrl: z.string().optional(),
				accessToken: z.string().optional(),
				refreshToken: z.string().optional(),
				expiresAt: z.string().optional(),
			}),
		}),
	)
	.handler(async ({ input, context }) => {
		const { user } = context;

		// Verify workspace access
		const workspace = await db.workspace.findUnique({
			where: { id: input.workspaceId },
			include: { organization: true },
		});

		if (!workspace) {
			throw new ORPCError("NOT_FOUND", {
				message: "Workspace not found",
			});
		}

		const member = await db.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: workspace.organizationId,
					userId: user.id,
				},
			},
		});

		if (!member && user.role !== "admin") {
			throw new ORPCError("FORBIDDEN", {
				message: "You are not a member of this organization",
			});
		}

		// Encrypt sensitive fields
		const encryptedCredentials: any = { ...input.credentials };
		
		if (input.credentials.apiKey) {
			encryptedCredentials.apiKey = encrypt(input.credentials.apiKey);
		}
		if (input.credentials.clientSecret) {
			encryptedCredentials.clientSecret = encrypt(input.credentials.clientSecret);
		}
		if (input.credentials.password) {
			encryptedCredentials.password = encrypt(input.credentials.password);
		}
		if (input.credentials.accessToken) {
			encryptedCredentials.accessToken = encrypt(input.credentials.accessToken);
		}
		if (input.credentials.refreshToken) {
			encryptedCredentials.refreshToken = encrypt(input.credentials.refreshToken);
		}

		const integration = await db.integration.create({
			data: {
				workspaceId: input.workspaceId,
				provider: input.provider,
				name: input.name,
				credentials: encryptedCredentials,
			},
		});

		return {
			id: integration.id,
			name: integration.name,
			provider: integration.provider,
		};
	});

const deleteIntegration = protectedProcedure
	.route({
		method: "DELETE",
		path: "/integrations/{id}",
		tags: ["Integrations"],
		summary: "Delete integration",
	})
	.input(
		z.object({
			id: z.string(),
			workspaceId: z.string(),
		}),
	)
	.handler(async ({ input, context }) => {
		const { user } = context;

		// Verify workspace access
		const workspace = await db.workspace.findUnique({
			where: { id: input.workspaceId },
			include: { organization: true },
		});

		if (!workspace) {
			throw new ORPCError("NOT_FOUND", {
				message: "Workspace not found",
			});
		}

		const member = await db.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: workspace.organizationId,
					userId: user.id,
				},
			},
		});

		if (!member && user.role !== "admin") {
			throw new ORPCError("FORBIDDEN", {
				message: "You are not a member of this organization",
			});
		}

		await db.integration.delete({
			where: {
				id: input.id,
				workspaceId: input.workspaceId,
			},
		});

		return { success: true };
	});

export const integrationsRouter = {
	list: listIntegrations,
	create: createIntegration,
	delete: deleteIntegration,
};
