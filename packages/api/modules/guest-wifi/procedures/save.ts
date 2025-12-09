import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";
import { guestWifiConfigDataSchema } from "../types";

/**
 * Invalidate portal cache after config update
 */
async function invalidatePortalCache(
	organizationSlug: string,
	workspaceSlug: string,
	instanceName: string,
) {
	const portalUrl = process.env.PORTAL_URL;
	const revalidateToken = process.env.REVALIDATE_TOKEN;

	if (!portalUrl || !revalidateToken) {
		console.warn(
			"Portal cache invalidation skipped: PORTAL_URL or REVALIDATE_TOKEN not configured",
		);
		return;
	}

	try {
		const response = await fetch(`${portalUrl}/api/revalidate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-revalidate-token": revalidateToken,
			},
			body: JSON.stringify({
				organization: organizationSlug,
				workspace: workspaceSlug,
				instance: instanceName,
			}),
		});

		if (!response.ok) {
			console.error(
				"Portal cache invalidation failed:",
				await response.text(),
			);
		}
	} catch (error) {
		console.error("Portal cache invalidation error:", error);
	}
}

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
			include: {
				workspace: {
					select: {
						slug: true,
						organization: {
							select: { slug: true },
						},
					},
				},
			},
		});

		// Invalidate portal cache (fire-and-forget, don't block response)
		// Only invalidate if organization has a slug
		if (savedConfig.workspace.organization.slug) {
			invalidatePortalCache(
				savedConfig.workspace.organization.slug,
				savedConfig.workspace.slug,
				savedConfig.name,
			).catch(() => {
				// Silently ignore - cache will expire naturally
			});
		}

		return {
			id: savedConfig.id,
			name: savedConfig.name,
			isActive: savedConfig.isActive,
		};
	});
