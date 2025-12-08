/**
 * Aruba Central Region Configuration
 * Aruba Central is sharded by region - API URL changes based on customer's account location
 */

export interface ArubaRegion {
	id: string;
	name: string;
	baseUrl: string;
}

export const ARUBA_REGIONS: ArubaRegion[] = [
	{
		id: "us-1",
		name: "US-1",
		baseUrl: "https://app1-apigw.central.arubanetworks.com",
	},
	{
		id: "us-west-4",
		name: "US-West-4",
		baseUrl: "https://apigw-uswest4.central.arubanetworks.com",
	},
	{
		id: "canada-1",
		name: "Canada-1",
		baseUrl: "https://apigw-ca1.central.arubanetworks.com",
	},
	{
		id: "eu-1",
		name: "EU-1",
		baseUrl: "https://eu-apigw.central.arubanetworks.com",
	},
	{
		id: "apac-1",
		name: "APAC-1",
		baseUrl: "https://apigw-apac1.central.arubanetworks.com",
	},
	{
		id: "apac-east",
		name: "APAC-East",
		baseUrl: "https://apigw-apaceast.central.arubanetworks.com",
	},
];

/**
 * Get Aruba region by ID
 */
export function getArubaRegion(id: string): ArubaRegion | undefined {
	return ARUBA_REGIONS.find((region) => region.id === id);
}
