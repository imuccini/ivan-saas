import { ORPCError } from "@orpc/server";
import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../orpc/procedures";

const provision = protectedProcedure
	.route({
		method: "POST",
		path: "/networks/provision",
		tags: ["Networks"],
		summary: "Provision networks",
	})
	.input(
		z.object({
			workspaceId: z.string(),
			integrationId: z.string(),
			organizationId: z.string(),
			networks: z.array(
				z.object({
					id: z.string(),
					name: z.string(),
					// biome-ignore lint/suspicious/noExplicitAny: Store full network object
					config: z.any(),
				}),
			),
			tags: z.array(z.string()),
			ssidMapping: z
				.object({
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
				})
				.optional(),
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

		// Create Network records
		const networks = await Promise.all(
			input.networks.map(async (network) => {
				// Merge SSID mapping into network config
				const configWithMapping = {
					...network.config,
					...(input.ssidMapping && {
						ssidMapping: input.ssidMapping,
					}),
				};

				// Check if network already exists to avoid unique constraint error
				const existing = await db.network.findUnique({
					where: {
						integrationId_externalId: {
							integrationId: input.integrationId,
							externalId: network.id,
						},
					},
				});

				if (existing) {
					// Update existing network
					return db.network.update({
						where: { id: existing.id },
						data: {
							name: network.name,
							config: configWithMapping,
							tags: input.tags,
							provisioningStatus: "active",
						},
					});
				}

				return db.network.create({
					data: {
						workspaceId: input.workspaceId,
						integrationId: input.integrationId,
						externalId: network.id,
						name: network.name,
						config: configWithMapping,
						tags: input.tags,
						provisioningStatus: "active",
					},
				});
			}),
		);

		return { success: true, count: networks.length };
	});

export const networkProvisioningRouter = {
	provision,
};
