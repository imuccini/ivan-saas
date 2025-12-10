"use server";

import { getArubaRegion } from "@saas/networks/lib/aruba-regions";

interface ValidationCredentials {
	apiKey?: string;
	clientId?: string;
	clientSecret?: string;
	regionId?: string;
}

export async function validateIntegrationCredentials(
	vendor: string,
	credentials: ValidationCredentials,
) {
	try {
		if (vendor === "aruba") {
			// Aruba OAuth2 validation
			const region = getArubaRegion(credentials.regionId || "");
			if (!region) {
				throw new Error("Please select a region");
			}

			const response = await fetch(`${region.baseUrl}/oauth2/token`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					grant_type: "client_credentials",
					client_id: credentials.clientId,
					client_secret: credentials.clientSecret,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					response.status === 401 || response.status === 400
						? "Invalid Client ID or Secret"
						: `OAuth2 validation failed: ${errorText}`,
				);
			}

			const data = await response.json();
			return {
				success: true,
				data: {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					expiresIn: data.expires_in,
					expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString(),
				},
			};
		}

		// Meraki API key validation
		if (vendor === "meraki") {
			const response = await fetch(
				"https://api.meraki.com/api/v1/organizations",
				{
					headers: {
						"X-Cisco-Meraki-API-Key": credentials.apiKey || "",
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					response.status === 401
						? "Invalid API key"
						: `API validation failed: ${errorText}`,
				);
			}

			const data = await response.json();
			return {
				success: true,
				data: data,
			};
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Validation failed",
		};
	}
}
