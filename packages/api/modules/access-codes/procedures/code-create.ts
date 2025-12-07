import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const createCode = protectedProcedure
	.input(
		z.object({
			groupId: z.string(),
			code: z.string().min(1),
			targetUserGroup: z.string().optional(),
		}),
	)
	.handler(async ({ input }) => {
		return await db.accessCode.create({
			data: {
				groupId: input.groupId,
				code: input.code,
				targetUserGroup: input.targetUserGroup,
			},
		});
	});
