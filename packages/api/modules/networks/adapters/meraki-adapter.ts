export interface MerakiOrganization {
	id: string;
	name: string;
	url: string;
	api: {
		enabled: boolean;
	};
	licensing: {
		model: string;
	};
	cloud: {
		region: {
			name: string;
		};
	};
}

export interface MerakiNetwork {
	id: string;
	organizationId: string;
	productTypes: string[];
	name: string;
	timeZone: string;
	tags: string[];
	enrollmentString: string | null;
	url: string;
	notes: string;
	isBoundToConfigTemplate: boolean;
}

export interface MerakiSSID {
	number: number;
	name: string;
	enabled: boolean;
	splashPage?: string;
	ssidAdminAccessible?: boolean;
	authMode?: string;
	encryptionMode?: string;
	wpaEncryptionMode?: string;
	radiusServers?: any[];
	radiusAccountingServers?: any[];
	radiusAttributeForGroupPolicies?: string;
	ipAssignmentMode?: string;
	useVlanTagging?: boolean;
	concentratorNetworkId?: string;
	vlanId?: number;
	defaultVlanId?: number;
	apTagsAndVlanIds?: any[];
	walledGardenEnabled?: boolean;
	walledGardenRanges?: string[];
	minBitrate?: number;
	bandSelection?: string;
	perClientBandwidthLimitUp?: number;
	perClientBandwidthLimitDown?: number;
	perSsidBandwidthLimitUp?: number;
	perSsidBandwidthLimitDown?: number;
	lanIsolationEnabled?: boolean;
	visible?: boolean;
	availableOnAllAps?: boolean;
	availabilityTags?: string[];
}

export class MerakiAdapter {
	private baseUrl = "https://api.meraki.com/api/v1";

	async validateApiKey(apiKey: string): Promise<boolean> {
		try {
			const response = await fetch(`${this.baseUrl}/organizations`, {
				headers: {
					"X-Cisco-Meraki-API-Key": apiKey,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			return response.ok;
		} catch (error) {
			console.error("Meraki API validation error:", error);
			return false;
		}
	}

	async getNetworkSSIDs(
		apiKey: string,
		networkId: string,
	): Promise<MerakiSSID[]> {
		const response = await fetch(
			`${this.baseUrl}/networks/${networkId}/wireless/ssids`,
			{
				headers: {
					"X-Cisco-Meraki-API-Key": apiKey,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch SSIDs: ${response.statusText}`);
		}

		return response.json();
	}

	async getOrganizations(apiKey: string): Promise<MerakiOrganization[]> {
		const response = await fetch(`${this.baseUrl}/organizations`, {
			headers: {
				"X-Cisco-Meraki-API-Key": apiKey,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch organizations: ${response.statusText}`,
			);
		}

		return response.json();
	}

	async getNetworks(
		apiKey: string,
		organizationId: string,
	): Promise<MerakiNetwork[]> {
		const response = await fetch(
			`${this.baseUrl}/organizations/${organizationId}/networks?productTypes[]=wireless`,
			{
				headers: {
					"X-Cisco-Meraki-API-Key": apiKey,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch networks: ${response.statusText}`);
		}

		return response.json();
	}

	async getDeviceTags(
		apiKey: string,
		organizationId: string,
	): Promise<string[]> {
		const response = await fetch(
			`${this.baseUrl}/organizations/${organizationId}/devices`,
			{
				headers: {
					"X-Cisco-Meraki-API-Key": apiKey,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch devices: ${response.statusText}`);
		}

		const devices = await response.json();
		const tags = new Set<string>();

		// biome-ignore lint/suspicious/noExplicitAny: Meraki device object is complex
		devices.forEach((device: any) => {
			if (device.tags && Array.isArray(device.tags)) {
				device.tags.forEach((tag: string) => tags.add(tag));
			}
		});

		return Array.from(tags).sort();
	}
}
