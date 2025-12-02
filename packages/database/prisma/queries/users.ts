// Import the Zod library for schema validation
import type { z } from "zod";
// Import the Prisma client instance
import { db } from "../client";
// Import the Zod schema for user data
import type { UserSchema } from "../zod";

/**
 * Retrieves a paginated and optionally filtered list of users.
 * @param limit - The maximum number of users to return.
 * @param offset - The number of users to skip.
 * @param query - An optional search query to filter users by name.
 * @returns A promise that resolves to an array of user objects.
 */
export async function getUsers({
	limit,
	offset,
	query,
}: {
	limit: number;
	offset: number;
	query?: string;
}) {
	return await db.user.findMany({
		where: query
			? {
					name: {
						contains: query,
					},
				}
			: undefined,
		take: limit,
		skip: offset,
	});
}

/**
 * Counts the total number of users in the database.
 * @returns A promise that resolves to the total user count.
 */
export async function countAllUsers() {
	return await db.user.count();
}

/**
 * Retrieves a user by their unique ID.
 * @param id - The ID of the user to retrieve.
 * @returns A promise that resolves to the user object or null if not found.
 */
export async function getUserById(id: string) {
	return await db.user.findUnique({
		where: {
			id,
		},
	});
}

/**
 * Retrieves a user by their email address.
 * @param email - The email address of the user to retrieve.
 * @returns A promise that resolves to the user object or null if not found.
 */
export async function getUserByEmail(email: string) {
	return await db.user.findUnique({
		where: {
			email,
		},
	});
}

/**
 * Creates a new user in the database.
 * @param email - The user's email address.
 * @param name - The user's name.
 * @param role - The user's role ('admin' or 'user').
 * @param emailVerified - A boolean indicating if the user's email has been verified.
 * @param onboardingComplete - A boolean indicating if the user has completed the onboarding process.
 * @returns A promise that resolves to the newly created user object.
 */
export async function createUser({
	email,
	name,
	role,
	emailVerified,
	onboardingComplete,
}: {
	email: string;
	name: string;
	role: "admin" | "user";
	emailVerified: boolean;
	onboardingComplete: boolean;
}) {
	return await db.user.create({
		data: {
			email,
			name,
			role,
			emailVerified,
			onboardingComplete,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});
}

/**
 * Retrieves an account by its unique ID.
 * @param id - The ID of the account to retrieve.
 * @returns A promise that resolves to the account object or null if not found.
 */
export async function getAccountById(id: string) {
	return await db.account.findUnique({
		where: {
			id,
		},
	});
}

/**
 * Creates a new user account, linking a user to a provider.
 * @param userId - The ID of the user.
 * @param providerId - The ID of the authentication provider (e.g., 'google', 'github').
 * @param accountId - The user's unique ID from the provider.
 * @param hashedPassword - The user's hashed password (optional).
 * @returns A promise that resolves to the newly created account object.
 */
export async function createUserAccount({
	userId,
	providerId,
	accountId,
	hashedPassword,
}: {
	userId: string;
	providerId: string;
	accountId: string;
	hashedPassword?: string;
}) {
	return await db.account.create({
		data: {
			userId,
			accountId,
			providerId,
			password: hashedPassword,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});
}

/**
 * Updates a user's data in the database.
 * @param user - An object containing the user's ID and the fields to update.
 * @returns A promise that resolves to the updated user object.
 */
export async function updateUser(
	user: Partial<z.infer<typeof UserSchema>> & { id: string },
) {
	return await db.user.update({
		where: {
			id: user.id,
		},
		data: user,
	});
}
