// Import the type definition for an active organization
import type { ActiveOrganization } from "../auth";

/**
 * Checks if a user has an admin role within a specific organization or a global admin role.
 * @param organization - The organization object to check against. Can be null or undefined.
 * @param user - The user object containing the user's ID and role. Can be null or undefined.
 * @returns - True if the user is an admin of the organization or a global admin, false otherwise.
 */
export function isOrganizationAdmin(
	organization?: ActiveOrganization | null,
	user?: {
		id: string;
		role?: string | null;
	} | null,
) {
	// Find the user's role within the organization's members
	const userOrganizationRole = organization?.members.find(
		(member) => member.userId === user?.id,
	)?.role;

	// Check if the user's role is 'owner' or 'admin' in the organization,
	// or if the user has a global 'admin' role.
	return (
		["owner", "admin"].includes(userOrganizationRole ?? "") ||
		user?.role === "admin"
	);
}
