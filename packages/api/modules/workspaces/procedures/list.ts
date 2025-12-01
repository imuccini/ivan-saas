import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";
import { ORPCError } from "@orpc/client";

export const listWorkspaces = protectedProcedure
	.route({
		method: "GET",
		path: "/workspaces",
		tags: ["Workspaces"],
		summary: "List workspaces",
		description: "List all workspaces in an organization",
	})
	.input(
		z.object({
			organizationId: z.string(),
		}),
	)
	.handler(async ({ input, context }) => {
		const { user } = context;
		const isSuperAdmin = user.role === "admin";

		// Verify user is member of organization
		const member = await db.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: input.organizationId,
					userId: user.id,
				},
			},
		});

		if (!member && !isSuperAdmin) {
			throw new ORPCError("FORBIDDEN", {
				message: "You are not a member of this organization",
			});
		}

		const isOrgAdmin = isSuperAdmin || member?.role === "owner" || member?.role === "admin";

		const workspaces = await db.workspace.findMany({
			where: {
				organizationId: input.organizationId,
				...(isSuperAdmin || isOrgAdmin
					? {}
					: {
							workspaceMembers: {
								some: {
									userId: user.id,
								},
							},
						}),
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return workspaces;
	});
