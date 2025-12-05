import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const create = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
			fullName: z.string().min(1),
			email: z.string().email(),
		}),
	)
	.handler(async ({ input }) => {
		return await db.sponsor.create({
			data: {
				workspaceId: input.workspaceId,
				fullName: input.fullName,
				email: input.email,
			},
		});
	});
