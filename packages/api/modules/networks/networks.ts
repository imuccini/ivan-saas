import { ORPCError } from "@orpc/server";
import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../orpc/procedures";

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

export const networksRouter = {
	list,
};
