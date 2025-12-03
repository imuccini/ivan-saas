import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Delete a term
 */
export const deleteTerm = protectedProcedure
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		await db.term.delete({
			where: { id: input.id },
		});

		return { success: true };
	});
