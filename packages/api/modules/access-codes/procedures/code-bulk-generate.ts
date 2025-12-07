import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";
import { nanoid } from "nanoid";

export const bulkGenerateCodes = protectedProcedure
	.input(
		z.object({
			groupId: z.string(),
			count: z.number().min(1).max(1000),
			prefix: z.string().optional(),
			targetUserGroup: z.string().optional(),
		}),
	)
	.handler(async ({ input }) => {
		const codesToCreate = Array.from({ length: input.count }).map(() => {
			const randomPart = nanoid(8); // 8 char random string
			const code = input.prefix ? `${input.prefix}${randomPart}` : randomPart;
			return {
				groupId: input.groupId,
				code,
				targetUserGroup: input.targetUserGroup,
			};
		});

		// Use createMany for bulk insertion
		await db.accessCode.createMany({
			data: codesToCreate,
			skipDuplicates: true, // In case of collision (rare with nanoid)
		});

		// Return the generated codes so frontend can download them
		// We fetch them back because createMany doesn't return the created records
		// Ideally we would return `codesToCreate` but they lack IDs and timestamps.
		// For CSV download, code and targetUserGroup are enough.
		return codesToCreate;
	});
