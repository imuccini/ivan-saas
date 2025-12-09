import { db } from "@repo/database";
import type { CustomField, PortalConfig, Term } from "@repo/portal-shared";

// In-memory cache for development (replace with Redis in production)
const configCache = new Map<
	string,
	{ data: PortalConfig; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getPortalConfig(
	organizationSlug: string,
	workspaceSlug: string,
	instanceName: string,
): Promise<PortalConfig | null> {
	const cacheKey = `${organizationSlug}:${workspaceSlug}:${instanceName}`;

	// Check cache first
	const cached = configCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		return cached.data;
	}

	// Fetch from database - need to join through organization
	const organization = await db.organization.findFirst({
		where: { slug: organizationSlug },
		select: { id: true, slug: true },
	});

	if (!organization) {
		console.error(`[Portal] Organization not found: ${organizationSlug}`);
		return null;
	}

	const workspace = await db.workspace.findFirst({
		where: {
			organizationId: organization.id,
			slug: workspaceSlug,
		},
		select: { id: true, slug: true },
	});

	if (!workspace) {
		console.error(
			`[Portal] Workspace not found: ${workspaceSlug} in organization ${organizationSlug}`,
		);
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
		console.error(
			`[Portal] GuestWifiConfig not found: instance="${instanceName}" in workspace ${workspaceSlug} (${workspace.id})`,
		);
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

// New function: Get portal config by IDs (stable URLs)
export async function getPortalConfigById(
	organizationId: string,
	workspaceId: string,
	instanceId: string,
): Promise<PortalConfig | null> {
	const cacheKey = `id:${organizationId}:${workspaceId}:${instanceId}`;

	// Check cache first
	const cached = configCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		return cached.data;
	}

	// Fetch directly by IDs
	const config = await db.guestWifiConfig.findFirst({
		where: {
			id: instanceId,
			workspaceId: workspaceId,
			workspace: {
				organizationId: organizationId,
			},
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
		console.error(
			`[Portal] GuestWifiConfig not found by ID: instanceId="${instanceId}" workspaceId="${workspaceId}" orgId="${organizationId}"`,
		);
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
	organizationSlug: string,
	workspaceSlug: string,
	instanceName: string,
) {
	const cacheKey = `${organizationSlug}:${workspaceSlug}:${instanceName}`;
	configCache.delete(cacheKey);
}

// Invalidate cache by IDs
export function invalidatePortalCacheById(
	organizationId: string,
	workspaceId: string,
	instanceId: string,
) {
	const cacheKey = `id:${organizationId}:${workspaceId}:${instanceId}`;
	configCache.delete(cacheKey);
}
