/**
 * Extract unique network tags from a list of networks
 * Used for tag-based network synchronization
 */

// biome-ignore lint/suspicious/noExplicitAny: Network structure varies by vendor
export function extractNetworkTags(networks: any[]): string[] {
	const tagSet = new Set<string>();

	for (const network of networks) {
		if (Array.isArray(network.tags)) {
			for (const tag of network.tags) {
				if (tag && typeof tag === "string") {
					tagSet.add(tag.trim());
				}
			}
		}
	}

	return Array.from(tagSet).sort();
}

/**
 * Filter networks by selected tags
 * Returns networks that have at least one of the selected tags
 */
// biome-ignore lint/suspicious/noExplicitAny: Network structure varies by vendor
export function filterNetworksByTags(
	networks: any[],
	selectedTags: string[],
): any[] {
	if (selectedTags.length === 0) {
		return [];
	}

	return networks.filter((network) => {
		if (!Array.isArray(network.tags)) {
			return false;
		}

		return selectedTags.some((selectedTag) =>
			network.tags.includes(selectedTag),
		);
	});
}
