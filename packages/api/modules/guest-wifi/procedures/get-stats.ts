import { ORPCError } from "@orpc/server";
import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const getStats = protectedProcedure
	.route({
		method: "GET",
		path: "/guest-wifi/stats",
		tags: ["Guest WiFi"],
		summary: "Get Guest WiFi statistics",
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

		// Fetch all networks for the workspace
		const networks = await db.network.findMany({
			where: {
				workspaceId: input.workspaceId,
			},
		});

		let activeNetworksCount = 0;

		for (const network of networks) {
			// biome-ignore lint/suspicious/noExplicitAny: JSON type
			const config = (network.config as any) || {};
			const ssidMapping = config.ssidMapping || {};
			const guestWifi = ssidMapping.guestWifi;

			if (
				guestWifi &&
				typeof guestWifi === "object" &&
				"enabled" in guestWifi &&
				guestWifi.enabled === true
			) {
				activeNetworksCount++;
			}
		}

		return {
			activeNetworksCount,
		};
	});
