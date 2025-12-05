import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Create a new custom field
 */
export const create = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
			name: z.string().min(1),
			type: z.enum(["text", "select", "boolean"]),
			validationType: z.string().optional(),
			options: z.array(z.string()).optional(),
			translations: z.record(
				z.string(),
				z.object({
					label: z.string(),
					placeholder: z.string().optional(),
				}),
			),
			isRequired: z.boolean().default(false),
		}),
	)
	.handler(async ({ input }) => {
		const customField = await db.customField.create({
			data: {
				workspaceId: input.workspaceId,
				name: input.name,
				type: input.type,
				validationType: input.validationType,
				options: input.options,
				translations: input.translations,
				isRequired: input.isRequired,
			},
		});

		return customField;
	});
