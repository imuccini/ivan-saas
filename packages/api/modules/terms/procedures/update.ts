import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Update an existing term
 */
export const update = protectedProcedure
	.input(
		z.object({
			id: z.string(),
			name: z.string().optional(),
			version: z.string().optional(),
			category: z
				.enum([
					"PRIVACY_POLICY",
					"TERMS_OF_USE",
					"COOKIE_POLICY",
					"OTHER",
				])
				.optional(),
			isMandatory: z.boolean().optional(),
			isPreChecked: z.boolean().optional(),
			status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
			translations: z
				.record(
					z.string(),
					z.object({
						label: z.string(),
						linkText: z.string(),
						documentTitle: z.string(),
						documentContent: z.string(),
					}),
				)
				.optional(),
		}),
	)
	.handler(async ({ input }) => {
		const { id, ...data } = input;

		const term = await db.term.update({
			where: { id },
			data,
		});

		return term;
	});
