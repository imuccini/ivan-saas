import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const listCodes = protectedProcedure
	.input(
		z.object({
			groupId: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		return await db.accessCode.findMany({
			where: {
				groupId: input.groupId,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	});
