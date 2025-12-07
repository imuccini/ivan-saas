import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const listGroups = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		const groups = await db.accessCodeGroup.findMany({
			where: {
				workspaceId: input.workspaceId,
			},
			include: {
				_count: {
					select: { codes: true },
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return groups.map((group) => ({
			...group,
			codeCount: group._count.codes,
		}));
	});
