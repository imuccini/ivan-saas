import { ORPCError } from "@orpc/client";
import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Update a communication template
 */
export const updateTemplate = protectedProcedure
	.input(
		z.object({
			id: z.string(),
			subject: z.string().optional(),
			bodyContent: z.string(),
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
				subject: input.subject,
				bodyContent: input.bodyContent,
			},
			include: {
				trigger: true,
			},
		});

		return updated;
	});
