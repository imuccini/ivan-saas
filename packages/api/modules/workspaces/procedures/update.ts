import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";
import { ORPCError } from "@orpc/client";

export const updateWorkspace = protectedProcedure
	.route({
		method: "PATCH",
		path: "/workspaces/{id}",
		tags: ["Workspaces"],
		summary: "Update workspace",
		description: "Update a workspace",
	})
	.input(
		z.object({
			id: z.string(),
			name: z.string().min(1).optional(),
			slug: z.string().optional(),
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

		// Verify user is member of organization
		const member = await db.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: workspace.organizationId,
					userId: user.id,
				},
			},
		});

		if (!member) {
			throw new ORPCError("FORBIDDEN", {
				message: "You are not a member of this organization",
			});
		}

		// Check slug uniqueness if updating slug
		if (input.slug && input.slug !== workspace.slug) {
			const existing = await db.workspace.findUnique({
				where: {
					organizationId_slug: {
						organizationId: workspace.organizationId,
						slug: input.slug,
					},
				},
			});

			if (existing) {
				throw new ORPCError("CONFLICT", {
					message: "Workspace with this slug already exists in this organization",
				});
			}
		}

		const updatedWorkspace = await db.workspace.update({
			where: { id: input.id },
			data: {
				name: input.name,
				slug: input.slug,
			},
		});

		return updatedWorkspace;
	});
