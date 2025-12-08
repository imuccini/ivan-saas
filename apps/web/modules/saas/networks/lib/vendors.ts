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
		logo: "https://www.cisco.com/c/dam/en_us/about/ac50/ac47/catalyst-center.svg",
		comingSoon: true,
		description: "Enterprise networking platform",
	},
	aruba: {
		id: "aruba",
		name: "Aruba Central",
		logo: "https://www.arubanetworks.com/assets/img/logo-aruba.svg",
		comingSoon: true,
		description: "HPE Aruba cloud networking",
	},
	ubiquiti: {
		id: "ubiquiti",
		name: "Ubiquiti UniFi",
		logo: "https://cdn.brandfolder.io/YUHW9ZNP/at/8q4xkqbrx4pnv9gmwjjwfmm/UniFi_Logo.svg",
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
		logo: "https://static.tp-link.com/res/images/logo/logo-omada.svg",
		comingSoon: true,
		description: "Software Defined Networking",
	},
	ruckus: {
		id: "ruckus",
		name: "Ruckus One",
		logo: "https://res.cloudinary.com/ruckus-wireless/image/upload/ar_1,c_fill,g_auto,w_200/v1/Ruckus/Logo/logo-ruckus-wireless.svg",
		comingSoon: true,
		description: "Cloud network management",
	},
	mist: {
		id: "mist",
		name: "Juniper Mist",
		logo: "https://www.juniper.net/content/dam/juniper/images/logos/juniper-mist-logo.svg",
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
