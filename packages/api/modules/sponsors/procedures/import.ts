import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const importSponsors = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
			sponsors: z.array(
				z.object({
					fullName: z.string().min(1),
					email: z.string().email(),
				}),
			),
		}),
	)
	.handler(async ({ input }) => {
		// Use transaction to ensure all or nothing
		return await db.$transaction(
			input.sponsors.map((sponsor) =>
				db.sponsor.upsert({
					where: {
						workspaceId_email: {
							workspaceId: input.workspaceId,
							email: sponsor.email,
						},
					},
					update: {
						fullName: sponsor.fullName,
					},
					create: {
						workspaceId: input.workspaceId,
						fullName: sponsor.fullName,
						email: sponsor.email,
					},
				}),
			),
		);
	});
