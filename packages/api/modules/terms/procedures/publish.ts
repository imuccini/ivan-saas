import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Publish a draft term
 */
export const publish = protectedProcedure
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		const term = await db.term.update({
			where: { id: input.id },
			data: { status: "PUBLISHED" },
		});

		return term;
	});
