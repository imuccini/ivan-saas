import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * List all notification categories with their triggers and templates
 * Returns workspace-specific templates when available, falling back to global defaults
 */
export const listCategories = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		const categories = await db.notificationCategory.findMany({
			include: {
				triggers: {
					include: {
						templates: {
							where: {
								OR: [
									{ workspaceId: input.workspaceId }, // Workspace-specific
									{ workspaceId: null }, // Global defaults
								],
							},
							orderBy: { type: "asc" },
						},
					},
					orderBy: { name: "asc" },
				},
			},
			orderBy: { name: "asc" },
		});

		// For each trigger, prefer workspace templates over global ones
		const processedCategories = categories.map((category) => ({
			...category,
			triggers: category.triggers.map((trigger) => {
				// Group templates by type
				const templatesByType = new Map<
					string,
					(typeof trigger.templates)[0]
				>();

				for (const template of trigger.templates) {
					const key = template.type;
					const existing = templatesByType.get(key);

					// Prefer workspace-specific over global (workspace templates have workspaceId set)
					if (
						!existing ||
						(template.workspaceId && !existing.workspaceId)
					) {
						templatesByType.set(key, template);
					}
				}

				return {
					...trigger,
					templates: Array.from(templatesByType.values()),
				};
			}),
		}));

		return processedCategories;
	});
