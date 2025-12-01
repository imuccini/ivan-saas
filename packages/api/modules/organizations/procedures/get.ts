import { db } from "@repo/database";
import { ORPCError } from "@orpc/client";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const getOrganization = protectedProcedure
	.route({
		method: "GET",
		path: "/organizations/:slug",
		tags: ["Organizations"],
		summary: "Get organization details",
		description: "Get organization details by slug",
	})
	.input(
		z.object({
			slug: z.string().optional(),
			id: z.string().optional(),
		}).refine((data) => data.slug || data.id, {
			message: "Either slug or id must be provided",
		}),
	)
	.handler(async ({ input, context }) => {
		const { user } = context;
		const isSuperAdmin = user.role === "admin";

		const organization = await db.organization.findUnique({
			where: input.slug ? { slug: input.slug } : { id: input.id },
			include: {
				members: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true,
							},
						},
					},
				},
			},
		});

		if (!organization) {
			throw new ORPCError("NOT_FOUND", {
				message: "Organization not found",
			});
		}

		// Check if user is a member or superadmin
		const member = organization.members.find((m) => m.userId === user.id);

		if (!member && !isSuperAdmin) {
			throw new ORPCError("FORBIDDEN", {
				message: "You are not a member of this organization",
			});
		}

		return organization;
	});
