import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";
import { defaultGuestWifiConfig } from "../types";

/**
 * Get the active guest WiFi config for a workspace
 */
export const get = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		const config = await db.guestWifiConfig.findFirst({
			where: {
				workspaceId: input.workspaceId,
				isActive: true,
			},
		});

		if (!config) {
			// Return default config if none exists
			return {
				id: null,
				name: "Default",
				isActive: true,
				config: defaultGuestWifiConfig,
			};
		}

		return {
			id: config.id,
			name: config.name,
			isActive: config.isActive,
			config: config.config as typeof defaultGuestWifiConfig,
		};
	});
