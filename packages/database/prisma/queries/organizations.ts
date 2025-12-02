// Import the Zod library for schema validation
import type { z } from "zod";
// Import the Prisma client instance
import { db } from "../client";
// Import the Zod schema for organization data
import type { OrganizationSchema } from "../zod";

/**
 * Retrieves a paginated and optionally filtered list of organizations.
 * @param limit - The maximum number of organizations to return.
 * @param offset - The number of organizations to skip.
 * @param query - An optional search query to filter organizations by name.
 * @returns A promise that resolves to an array of organizations with their member counts.
 */
export async function getOrganizations({
	limit,
	offset,
	query,
}: {
	limit: number;
	offset: number;
	query?: string;
}) {
	return db.organization
		.findMany({
			where: {
				name: { contains: query, mode: "insensitive" },
			},
			include: {
				_count: {
					select: {
						members: true,
					},
				},
			},
			take: limit,
			skip: offset,
		})
		.then((res) =>
			res.map((org) => ({
				...org,
				membersCount: org._count.members,
			})),
		);
}

/**
 * Counts the total number of organizations in the database.
 * @returns A promise that resolves to the total organization count.
 */
export async function countAllOrganizations() {
	return db.organization.count();
}

/**
 * Retrieves an organization by its unique ID, including its members and invitations.
 * @param id - The ID of the organization to retrieve.
 * @returns A promise that resolves to the organization object or null if not found.
 */
export async function getOrganizationById(id: string) {
	return db.organization.findUnique({
		where: { id },
		include: {
			members: true,
			invitations: true,
		},
	});
}

/**
 * Retrieves an invitation by its unique ID, including the associated organization.
 * @param id - The ID of the invitation to retrieve.
 * @returns A promise that resolves to the invitation object or null if not found.
 */
export async function getInvitationById(id: string) {
	return db.invitation.findUnique({
		where: { id },
		include: {
			organization: true,
		},
	});
}

/**
 * Retrieves an organization by its unique slug.
 * @param slug - The slug of the organization to retrieve.
 * @returns A promise that resolves to the organization object or null if not found.
 */
export async function getOrganizationBySlug(slug: string) {
	return db.organization.findUnique({
		where: { slug },
	});
}

/**
 * Retrieves a user's membership details for a specific organization.
 * @param organizationId - The ID of the organization.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to the member object or null if the user is not a member.
 */
export async function getOrganizationMembership(
	organizationId: string,
	userId: string,
) {
	return db.member.findUnique({
		where: {
			organizationId_userId: {
				organizationId,
				userId,
			},
		},
		include: {
			organization: true,
		},
	});
}

/**
 * Retrieves an organization along with its purchases and member count.
 * @param organizationId - The ID of the organization.
 * @returns A promise that resolves to the organization object with additional details, or null if not found.
 */
export async function getOrganizationWithPurchasesAndMembersCount(
	organizationId: string,
) {
	const organization = await db.organization.findUnique({
		where: {
			id: organizationId,
		},
		include: {
			purchases: true,
			_count: {
				select: {
					members: true,
				},
			},
		},
	});

	return organization
		? {
				...organization,
				membersCount: organization._count.members,
			}
		: null;
}

/**
 * Retrieves the first pending invitation for a given email address.
 * @param email - The email address to search for.
 * @returns A promise that resolves to the invitation object or null if no pending invitation is found.
 */
export async function getPendingInvitationByEmail(email: string) {
	return db.invitation.findFirst({
		where: {
			email,
			status: "pending",
		},
	});
}

/**
 * Updates an organization's data in the database.
 * @param organization - An object containing the organization's ID and the fields to update.
 * @returns A promise that resolves to the updated organization object.
 */
export async function updateOrganization(
	organization: Partial<z.infer<typeof OrganizationSchema>> & { id: string },
) {
	return db.organization.update({
		where: {
			id: organization.id,
		},
		data: organization,
	});
}
