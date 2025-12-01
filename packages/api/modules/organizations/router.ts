import { createLogoUploadUrl } from "./procedures/create-logo-upload-url";
import { generateOrganizationSlug } from "./procedures/generate-organization-slug";
import { getOrganization } from "./procedures/get";

export const organizationsRouter = {
	generateSlug: generateOrganizationSlug,
	createLogoUploadUrl,
	get: getOrganization,
};
