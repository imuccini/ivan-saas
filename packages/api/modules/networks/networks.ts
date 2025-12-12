import { ORPCError } from "@orpc/server";
import { db } from "@repo/database";
import { z } from "zod";
import { decrypt } from "../../lib/encryption";
import { protectedProcedure } from "../../orpc/procedures";
import { MerakiAdapter } from "./adapters/meraki-adapter";
import { UbiquitiAdapter } from "./adapters/ubiquiti-adapter";

const list = protectedProcedure
	.route({
		method: "GET",
		path: "/networks",
		tags: ["Networks"],
		summary: "List networks",
	})
	.input(
		z.object({
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

		const networks = await db.network.findMany({
			where: {
				workspaceId: input.workspaceId,
			},
			include: {
				integration: {
					select: {
						id: true,
						name: true,
						provider: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return networks;
	});

const updateSsidMapping = protectedProcedure
	.route({
		method: "PATCH",
		path: "/networks/{id}/ssid-mapping",
		tags: ["Networks"],
		summary: "Update network SSID mapping",
	})
	.input(
		z.object({
			id: z.string(),
			workspaceId: z.string(),
			ssidMapping: z.object({
				guestWifi: z
					.union([
						z.object({
							ssidNumber: z.number(),
							ssidName: z.string(),
						}),
						z.literal("auto"),
						z.literal("skip"),
					])
					.optional(),
				iot: z
					.union([
						z.object({
							ssidNumber: z.number(),
							ssidName: z.string(),
						}),
						z.literal("auto"),
						z.literal("skip"),
					])
					.optional(),
				employees: z
					.union([
						z.object({
							ssidNumber: z.number(),
							ssidName: z.string(),
						}),
						z.literal("auto"),
						z.literal("skip"),
					])
					.optional(),
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

		const network = await db.network.findUnique({
			where: { id: input.id },
		});

		if (!network) {
			throw new ORPCError("NOT_FOUND", {
				message: "Network not found",
			});
		}

		// Update network config with new SSID mapping
		// biome-ignore lint/suspicious/noExplicitAny: JSON type
		const currentConfig = (network.config as any) || {};
		const newConfig = {
			...currentConfig,
			ssidMapping: input.ssidMapping,
		};

		await db.network.update({
			where: { id: input.id },
			data: {
				config: newConfig,
			},
		});

		return { success: true };
	});

export const networksRouter = {
	list,
	updateSsidMapping,
	sync: protectedProcedure
		.route({
			method: "POST",
			path: "/networks/{id}/sync",
			tags: ["Networks"],
			summary: "Sync network data",
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

			// Get network with integration
			const network = await db.network.findUnique({
				where: { id: input.id },
				include: {
					integration: true,
				},
			});

			if (!network) {
				throw new ORPCError("NOT_FOUND", {
					message: "Network not found",
				});
			}

			if (!network.integration || !network.integration.credentials) {
				throw new ORPCError("PRECONDITION_FAILED", {
					message: "Integration credentials missing",
				});
			}

			// Fetch fresh data
			let ssids: { number: number; name: string; enabled: boolean }[] = [];
			let deviceCount = 0;

			if (network.integration.provider === "meraki") {
				const merakiAdapter = new MerakiAdapter();
				// biome-ignore lint/suspicious/noExplicitAny: JSON type
				const credentials = network.integration.credentials as any;
				const apiKey = decrypt(credentials.apiKey);
				// biome-ignore lint/suspicious/noExplicitAny: JSON type
				const networkId = (network.config as any)?.id || network.externalId;

				const [merakiSsids, count] = await Promise.all([
					merakiAdapter.getNetworkSSIDs(apiKey, networkId),
					merakiAdapter.getDeviceCount(apiKey, networkId),
				]);
				ssids = merakiSsids;
				deviceCount = count;
			} else if (network.integration.provider === "ubiquiti") {
				const ubiquitiAdapter = new UbiquitiAdapter();
				// biome-ignore lint/suspicious/noExplicitAny: JSON type
				const credentials = network.integration.credentials as any;
				const password = credentials.password ? decrypt(credentials.password) : "";

				const siteName = network.externalId;

				const wlans = await ubiquitiAdapter.getWLANs({
					controllerUrl: credentials.controllerUrl,
					username: credentials.username,
					password: password,
					allowSelfSigned: credentials.allowSelfSigned,
				}, siteName);

				ssids = wlans.map((w, i) => ({
					number: i,
					name: w.name,
					enabled: w.enabled,
				}));
			}

			// Update config
			// biome-ignore lint/suspicious/noExplicitAny: JSON type
			const currentConfig = (network.config as any) || {};
			const currentMapping = currentConfig.ssidMapping || {};

			// Update status of mapped SSIDs
			const updatedMapping = { ...currentMapping };
			for (const key of ["guestWifi", "iot", "employees"] as const) {
				const mapping = updatedMapping[key];
				if (
					mapping &&
					typeof mapping === "object" &&
					"ssidNumber" in mapping
				) {
					// Logic to find fresh SSID.
					// For Ubiquiti using index (number) is fragile if order changes.
					// But for now it consistent with proxy.
					const freshSsid = ssids.find(
						(s) => s.number === mapping.ssidNumber,
					);
					if (freshSsid) {
						updatedMapping[key] = {
							...mapping,
							ssidName: freshSsid.name,
							enabled: freshSsid.enabled,
						};
					}
				}
			}

			const newConfig = {
				...currentConfig,
				deviceCount,
				ssidMapping: updatedMapping,
				lastSyncedAt: new Date().toISOString(),
			};

			await db.network.update({
				where: { id: input.id },
				data: {
					config: newConfig,
				},
			});

			return { success: true };
		}),
	delete: protectedProcedure
		.route({
			method: "DELETE",
			path: "/networks/{id}",
			tags: ["Networks"],
			summary: "Delete network",
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

			// Check if network exists
			const network = await db.network.findUnique({
				where: { id: input.id },
			});

			if (!network) {
				throw new ORPCError("NOT_FOUND", {
					message: "Network not found",
				});
			}

			// Delete network
			await db.network.delete({
				where: { id: input.id },
			});

			return { success: true };
		}),
};
