import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Delete a custom field
 */
export const deleteCustomField = protectedProcedure
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		await db.customField.delete({
			where: { id: input.id },
		});

		return { success: true };
	});
