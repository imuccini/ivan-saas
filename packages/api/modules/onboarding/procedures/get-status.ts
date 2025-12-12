import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Get onboarding status for a workspace
 * Checks completion of 3 key tasks:
 * 1. Network setup - any Network exists
 * 2. WiFi personalized - GuestWifiConfig has been updated
 * 3. Service deployed - Network with provisioningStatus = 'active'
 */
export const getStatus = protectedProcedure
	.input(
		z.object({
			workspaceId: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		const [networkCount, guestWifiConfig, activeNetwork] =
			await Promise.all([
				db.network.count({ where: { workspaceId: input.workspaceId } }),
				db.guestWifiConfig.findFirst({
					where: { workspaceId: input.workspaceId },
				}),
				db.network.findFirst({
					where: {
						workspaceId: input.workspaceId,
						provisioningStatus: "active",
					},
				}),
			]);

		const networkSetup = networkCount > 0;
		const wifiPersonalized = guestWifiConfig
			? guestWifiConfig.updatedAt > guestWifiConfig.createdAt
			: false;
		const serviceDeployed = !!activeNetwork;

		const completedTasks = [
			networkSetup,
			wifiPersonalized,
			serviceDeployed,
		].filter(Boolean);

		return {
			networkSetup,
			wifiPersonalized,
			serviceDeployed,
			completedCount: completedTasks.length,
			totalCount: 3,
			isComplete: completedTasks.length === 3,
		};
	});
