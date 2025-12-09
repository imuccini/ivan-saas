import { db } from "@repo/database";
import type { CustomField, PortalConfig, Term } from "@repo/portal-shared";

// In-memory cache for development (replace with Redis in production)
const configCache = new Map<
	string,
	{ data: PortalConfig; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getPortalConfig(
	workspaceSlug: string,
	instanceName: string,
): Promise<PortalConfig | null> {
	const cacheKey = `${workspaceSlug}:${instanceName}`;

	// Check cache first
	const cached = configCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		return cached.data;
	}

	// Fetch from database
	const workspace = await db.workspace.findFirst({
		where: { slug: workspaceSlug },
		select: { id: true },
	});

	if (!workspace) {
		return null;
	}

	const config = await db.guestWifiConfig.findFirst({
		where: {
			workspaceId: workspace.id,
			name: instanceName,
			isActive: true,
		},
		include: {
			workspace: {
				select: {
					id: true,
					slug: true,
					name: true,
					customFields: true,
					sponsors: {
						select: {
							id: true,
							fullName: true,
							email: true,
						},
					},
					terms: {
						where: { status: "PUBLISHED" },
						select: {
							id: true,
							name: true,
							category: true,
							isMandatory: true,
							isPreChecked: true,
							translations: true,
						},
					},
				},
			},
		},
	});

	if (!config) {
		return null;
	}

	const portalConfig: PortalConfig = {
		id: config.id,
		workspaceId: config.workspaceId,
		workspaceName: config.workspace.name,
		workspaceSlug: config.workspace.slug,
		instanceName: config.name,
		config: config.config as Record<string, unknown>,
		customFields: config.workspace.customFields as unknown as CustomField[],
		sponsors: config.workspace.sponsors,
		terms: config.workspace.terms as unknown as Term[],
		updatedAt: config.updatedAt,
	};

	// Update cache
	configCache.set(cacheKey, { data: portalConfig, timestamp: Date.now() });

	return portalConfig;
}

// Call this from admin app webhook to invalidate cache
export function invalidatePortalCache(
	workspaceSlug: string,
	instanceName: string,
) {
	const cacheKey = `${workspaceSlug}:${instanceName}`;
	configCache.delete(cacheKey);
}
