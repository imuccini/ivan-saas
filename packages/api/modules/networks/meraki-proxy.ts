import { ORPCError } from "@orpc/server";
import { db } from "@repo/database";
import { z } from "zod";
import { decrypt } from "../../lib/encryption";
import { protectedProcedure } from "../../orpc/procedures";
import { MerakiAdapter } from "./adapters/meraki-adapter";

const merakiAdapter = new MerakiAdapter();

const getOrganizations = protectedProcedure
	.route({
		method: "GET",
		path: "/meraki/organizations",
		tags: ["Meraki"],
		summary: "Get Meraki organizations",
	})
	.input(z.object({ integrationId: z.string(), workspaceId: z.string() }))
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

		const integration = await db.integration.findUnique({
			where: { id: input.integrationId, workspaceId: input.workspaceId },
		});

		if (!integration || !integration.credentials) {
			throw new Error("Integration not found");
		}

		// biome-ignore lint/suspicious/noExplicitAny: JSON type
		const credentials = integration.credentials as any;
		const apiKey = decrypt(credentials.apiKey);

		return merakiAdapter.getOrganizations(apiKey);
	});

const getNetworks = protectedProcedure
	.route({
		method: "GET",
		path: "/meraki/networks",
		tags: ["Meraki"],
		summary: "Get Meraki networks",
	})
	.input(
		z.object({
			integrationId: z.string(),
			organizationId: z.string(),
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

		const integration = await db.integration.findUnique({
			where: { id: input.integrationId, workspaceId: input.workspaceId },
		});

		if (!integration || !integration.credentials) {
			throw new Error("Integration not found");
		}

		// biome-ignore lint/suspicious/noExplicitAny: JSON type
		const credentials = integration.credentials as any;
		const apiKey = decrypt(credentials.apiKey);

		return merakiAdapter.getNetworks(apiKey, input.organizationId);
	});

const getDeviceTags = protectedProcedure
	.route({
		method: "GET",
		path: "/meraki/device-tags",
		tags: ["Meraki"],
		summary: "Get Meraki device tags",
	})
	.input(
		z.object({
			integrationId: z.string(),
			organizationId: z.string(),
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

		const integration = await db.integration.findUnique({
			where: { id: input.integrationId, workspaceId: input.workspaceId },
		});

		if (!integration || !integration.credentials) {
			throw new Error("Integration not found");
		}

		// biome-ignore lint/suspicious/noExplicitAny: JSON type
		const credentials = integration.credentials as any;
		const apiKey = decrypt(credentials.apiKey);

		return merakiAdapter.getDeviceTags(apiKey, input.organizationId);
	});

const getNetworkSSIDs = protectedProcedure
	.route({
		method: "GET",
		path: "/meraki/network-ssids",
		tags: ["Meraki"],
		summary: "Get Meraki network SSIDs",
	})
	.input(
		z.object({
			integrationId: z.string(),
			networkId: z.string(),
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

		const integration = await db.integration.findUnique({
			where: { id: input.integrationId, workspaceId: input.workspaceId },
		});

		if (!integration || !integration.credentials) {
			throw new Error("Integration not found");
		}

		// biome-ignore lint/suspicious/noExplicitAny: JSON type
		const credentials = integration.credentials as any;
		const apiKey = decrypt(credentials.apiKey);

		return merakiAdapter.getNetworkSSIDs(apiKey, input.networkId);
	});

const getDeviceCount = protectedProcedure
	.route({
		method: "GET",
		path: "/meraki/device-count",
		tags: ["Meraki"],
		summary: "Get Meraki network device count",
	})
	.input(
		z.object({
			integrationId: z.string(),
			networkId: z.string(),
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

		const integration = await db.integration.findUnique({
			where: { id: input.integrationId, workspaceId: input.workspaceId },
		});

		if (!integration || !integration.credentials) {
			throw new Error("Integration not found");
		}

		// biome-ignore lint/suspicious/noExplicitAny: JSON type
		const credentials = integration.credentials as any;
		const apiKey = decrypt(credentials.apiKey);

		return merakiAdapter.getDeviceCount(apiKey, input.networkId);
	});

export const merakiProxyRouter = {
	getOrganizations,
	getNetworks,
	getDeviceTags,
	getNetworkSSIDs,
	getDeviceCount,
};
