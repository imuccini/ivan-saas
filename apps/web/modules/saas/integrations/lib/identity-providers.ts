/**
 * Identity Provider Vendor Configuration
 * Centralized vendor definitions with logos and metadata
 */

export type IdpId = "entra-id" | "google" | "okta" | "saml";

export interface IdentityProviderVendor {
	id: IdpId;
	name: string;
	logo: string; // SVG or PNG URL
	comingSoon?: boolean;
	description?: string;
	requiresTenantId?: boolean;
}

/**
 * Official vendor logos
 */
export const IDENTITY_PROVIDERS: Record<IdpId, IdentityProviderVendor> = {
	"entra-id": {
		id: "entra-id",
		name: "Microsoft Entra ID",
		logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
		description: "Azure Active Directory",
		requiresTenantId: true,
	},
	google: {
		id: "google",
		name: "Google Workspace",
		logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
		comingSoon: true,
		description: "Google Cloud Identity",
	},
	okta: {
		id: "okta",
		name: "Okta",
		logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Okta_logo.svg/2560px-Okta_logo.svg.png",
		comingSoon: true,
		description: "Identity Cloud",
	},
	saml: {
		id: "saml",
		name: "Generic SAML 2.0",
		logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Saml_logo.svg/1200px-Saml_logo.svg.png",
		comingSoon: true,
		description: "SAML 2.0 Identity Provider",
	},
};

/**
 * Get vendor by ID
 */
export function getIdpVendor(id: IdpId): IdentityProviderVendor {
	return IDENTITY_PROVIDERS[id];
}

/**
 * Get all vendors as array
 */
export function getAllIdpVendors(): IdentityProviderVendor[] {
	return Object.values(IDENTITY_PROVIDERS);
}

/**
 * Get available (non-coming-soon) vendors
 */
export function getAvailableIdpVendors(): IdentityProviderVendor[] {
	return getAllIdpVendors().filter((v) => !v.comingSoon);
}
