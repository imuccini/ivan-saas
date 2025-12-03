import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * List all terms for a workspace
 */
export const list = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
			status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
		}),
	)
	.handler(async ({ input }) => {
		const terms = await db.term.findMany({
			where: {
				workspaceId: input.workspaceId,
				...(input.status ? { status: input.status } : {}),
			},
			orderBy: [{ status: "desc" }, { updatedAt: "desc" }],
		});

		return terms;
	});
