import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const createGroup = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
			name: z.string().min(1),
			validFrom: z.date().optional(),
			validUntil: z.date().optional(),
			rotateCode: z.string().optional(),
			timeAllowance: z.string().optional(),
			bypassSponsorship: z.boolean().default(false),
		}),
	)
	.handler(async ({ input }) => {
		return await db.accessCodeGroup.create({
			data: {
				workspaceId: input.workspaceId,
				name: input.name,
				validFrom: input.validFrom,
				validUntil: input.validUntil,
				rotateCode: input.rotateCode,
				timeAllowance: input.timeAllowance,
				bypassSponsorship: input.bypassSponsorship,
			},
		});
	});
