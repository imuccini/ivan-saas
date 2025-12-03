import { ORPCError } from "@orpc/client";
import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Toggle a communication template's active status
 */
export const toggleTemplate = protectedProcedure
	.input(
		z.object({
			id: z.string(),
			isActive: z.boolean(),
		}),
	)
	.handler(async ({ input }) => {
		const template = await db.communicationTemplate.findUnique({
			where: { id: input.id },
		});

		if (!template) {
			throw new ORPCError("NOT_FOUND", {
				message: "Template not found",
			});
		}

		const updated = await db.communicationTemplate.update({
			where: { id: input.id },
			data: {
				isActive: input.isActive,
			},
		});

		return updated;
	});
