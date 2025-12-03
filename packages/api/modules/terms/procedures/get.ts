import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Get a single term by ID
 */
export const get = protectedProcedure
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		const term = await db.term.findUnique({
			where: { id: input.id },
			include: { workspace: true },
		});

		if (!term) {
			throw new Error("Term not found");
		}

		return term;
	});
