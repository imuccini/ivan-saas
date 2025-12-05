import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Update an existing custom field
 */
export const update = protectedProcedure
	.input(
		z.object({
			id: z.string(),
			name: z.string().min(1).optional(),
			type: z.enum(["text", "select", "boolean"]).optional(),
			validationType: z.string().optional(),
			options: z.array(z.string()).optional(),
			translations: z
				.record(
					z.string(),
					z.object({
						label: z.string(),
						placeholder: z.string().optional(),
					}),
				)
				.optional(),
			isRequired: z.boolean().optional(),
		}),
	)
	.handler(async ({ input }) => {
		const { id, ...data } = input;

		const customField = await db.customField.update({
			where: { id },
			data,
		});

		return customField;
	});
