import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * List all custom fields for a workspace
 */
export const list = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		const customFields = await db.customField.findMany({
			where: {
				workspaceId: input.workspaceId,
			},
			orderBy: { createdAt: "desc" },
		});

		return customFields;
	});
