import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Create a new term
 */
export const create = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
			name: z.string(),
			version: z.string(),
			category: z.enum([
				"PRIVACY_POLICY",
				"TERMS_OF_USE",
				"COOKIE_POLICY",
				"OTHER",
			]),
			isMandatory: z.boolean().default(false),
			isPreChecked: z.boolean().default(false),
			status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
			translations: z.record(
				z.string(),
				z.object({
					label: z.string(),
					linkText: z.string(),
					documentTitle: z.string(),
					documentContent: z.string(),
				}),
			),
		}),
	)
	.handler(async ({ input }) => {
		const term = await db.term.create({
			data: {
				workspaceId: input.workspaceId,
				name: input.name,
				version: input.version,
				category: input.category,
				isMandatory: input.isMandatory,
				isPreChecked: input.isPreChecked,
				status: input.status,
				translations: input.translations,
			},
		});

		return term;
	});
