import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";
import { ORPCError } from "@orpc/client";

export const deleteWorkspace = protectedProcedure
	.route({
		method: "DELETE",
		path: "/workspaces/{id}",
		tags: ["Workspaces"],
		summary: "Delete workspace",
		description: "Delete a workspace",
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input, context }) => {
		const { user } = context;

		const workspace = await db.workspace.findUnique({
			where: { id: input.id },
		});

		if (!workspace) {
			throw new ORPCError("NOT_FOUND", {
				message: "Workspace not found",
			});
		}

		// Verify user is ADMIN of organization
		const member = await db.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: workspace.organizationId,
					userId: user.id,
				},
			},
		});

		if (!member || (member.role !== "owner" && member.role !== "admin")) {
			throw new ORPCError("FORBIDDEN", {
				message: "You must be an admin or owner to delete a workspace",
			});
		}

		await db.workspace.delete({
			where: { id: input.id },
		});

		return { success: true };
	});
