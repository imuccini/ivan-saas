import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const list = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		return await db.sponsor.findMany({
			where: {
				workspaceId: input.workspaceId,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	});
