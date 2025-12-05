import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";
import { guestWifiConfigDataSchema } from "../types";

/**
 * Save (create or update) guest WiFi config for a workspace
 */
export const save = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
			name: z.string().default("Default"),
			config: guestWifiConfigDataSchema,
		}),
	)
	.handler(async ({ input }) => {
		// Upsert the config
		const savedConfig = await db.guestWifiConfig.upsert({
			where: {
				workspaceId_name: {
					workspaceId: input.workspaceId,
					name: input.name,
				},
			},
			create: {
				workspaceId: input.workspaceId,
				name: input.name,
				isActive: true,
				config: input.config,
			},
			update: {
				config: input.config,
				updatedAt: new Date(),
			},
		});

		return {
			id: savedConfig.id,
			name: savedConfig.name,
			isActive: savedConfig.isActive,
		};
	});
