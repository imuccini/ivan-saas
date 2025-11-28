import { db } from "@repo/database";
import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";
import { ORPCError } from "@orpc/client";

export const createWorkspace = protectedProcedure
	.route({
		method: "POST",
		path: "/workspaces",
		tags: ["Workspaces"],
		summary: "Create workspace",
		description: "Create a new workspace in an organization",
	})
	.input(
		z.object({
			name: z.string().min(1),
			slug: z.string().optional(),
			organizationId: z.string(),
		}),
	)
	.handler(async ({ input, context }) => {
		const { user } = context;

		// Verify user is member of organization
		const member = await db.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: input.organizationId,
					userId: user.id,
				},
			},
		});

		if (!member) {
			throw new ORPCError("FORBIDDEN", {
				message: "You are not a member of this organization",
			});
		}

		let slug = input.slug;
		if (!slug) {
			slug = slugify(input.name, { lowercase: true });
			// Check for uniqueness within organization
			let existing = await db.workspace.findUnique({
				where: {
					organizationId_slug: {
						organizationId: input.organizationId,
						slug,
					},
				},
			});
			
			if (existing) {
				slug = `${slug}-${nanoid(5)}`;
			}
		} else {
             // Check for uniqueness within organization
			const existing = await db.workspace.findUnique({
				where: {
					organizationId_slug: {
						organizationId: input.organizationId,
						slug,
					},
				},
			});
            if (existing) {
                throw new ORPCError("CONFLICT", {
                    message: "Workspace with this slug already exists in this organization",
                });
            }
        }

		const workspace = await db.workspace.create({
			data: {
				name: input.name,
				slug,
				organizationId: input.organizationId,
			},
		});

		return workspace;
	});
