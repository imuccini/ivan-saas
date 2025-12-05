import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const deleteSponsor = protectedProcedure
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		return await db.sponsor.delete({
			where: {
				id: input.id,
			},
		});
	});
