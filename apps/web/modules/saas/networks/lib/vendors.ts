/**
 * Network Vendor Configuration
 * Centralized vendor definitions with logos and metadata
 */

export type VendorId =
	| "meraki"
	| "catalyst"
	| "aruba"
	| "ubiquiti"
	| "fortigate"
	| "fortiedge"
	| "omada"
	| "ruckus"
	| "mist";

export interface NetworkVendor {
	id: VendorId;
	name: string;
	logo: string; // SVG or PNG URL
	comingSoon?: boolean;
	description?: string;
}

/**
 * Official vendor logos (SVG/PNG with transparent backgrounds)
 * Using CDN URLs for vendor logos
 */
export const NETWORK_VENDORS: Record<VendorId, NetworkVendor> = {
	meraki: {
		id: "meraki",
		name: "Cisco Meraki",
		logo: "https://meraki.cisco.com/wp-content/uploads/2020/04/cisco-meraki-logo-1024x200.png",
		description: "Cloud-managed IT solutions",
	},
	catalyst: {
		id: "catalyst",
		name: "Cisco Catalyst",
		logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg",
		comingSoon: true,
		description: "Enterprise networking platform",
	},
	aruba: {
		id: "aruba",
		name: "Aruba Central",
		logo: "https://arubanetworking.hpe.com/techdocs/central/latest/content/common%20files/graphics/hpe_aruba_orange_pos_rgb.png",
		comingSoon: false, // Enabled for OAuth2 implementation
		description: "HPE Aruba cloud networking",
	},
	ubiquiti: {
		id: "ubiquiti",
		name: "Ubiquiti UniFi",
		logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Ubiquiti_Logo_2023.svg",
		comingSoon: true,
		description: "UniFi Network Controller",
	},
	fortigate: {
		id: "fortigate",
		name: "FortiGate",
		logo: "https://www.fortinet.com/content/dam/fortinet/images/general/fortinet-logo.svg",
		comingSoon: true,
		description: "Fortinet security platform",
	},
	fortiedge: {
		id: "fortiedge",
		name: "FortiEdge Cloud",
		logo: "https://www.fortinet.com/content/dam/fortinet/images/general/fortinet-logo.svg",
		comingSoon: true,
		description: "SD-WAN and SASE",
	},
	omada: {
		id: "omada",
		name: "TP-Link Omada",
		logo: "https://static.tp-link.com/assets/images/omada/logo.svg",
		comingSoon: true,
		description: "Software Defined Networking",
	},
	ruckus: {
		id: "ruckus",
		name: "Ruckus One",
		logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/CS-Ruckus-logo.png",
		comingSoon: true,
		description: "Cloud network management",
	},
	mist: {
		id: "mist",
		name: "Juniper Mist",
		logo: "https://www.mist.com/wp-content/uploads/logo.png",
		comingSoon: true,
		description: "AI-driven wireless",
	},
};

/**
 * Get vendor by ID
 */
export function getVendor(id: VendorId): NetworkVendor {
	return NETWORK_VENDORS[id];
}

/**
 * Get all vendors as array
 */
export function getAllVendors(): NetworkVendor[] {
	return Object.values(NETWORK_VENDORS);
}

/**
 * Get available (non-coming-soon) vendors
 */
export function getAvailableVendors(): NetworkVendor[] {
	return getAllVendors().filter((v) => !v.comingSoon);
}

/**
 * Vendor icon/emoji fallbacks for UI
 */
export const VENDOR_ICONS: Record<VendorId, string> = {
	meraki: "🔷",
	catalyst: "🔷",
	aruba: "🟠",
	ubiquiti: "⚡",
	fortigate: "🔴",
	fortiedge: "🔴",
	omada: "🟢",
	ruckus: "🟡",
	mist: "🔵",
};
