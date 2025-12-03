// Import the Zod library for schema validation
import type { z } from "zod";
// Import the Prisma client instance
import { db } from "../client";
// Import the Zod schema for purchase data
import type { PurchaseSchema } from "../zod";

/**
 * Retrieves a purchase by its unique ID.
 * @param id - The ID of the purchase to retrieve.
 * @returns A promise that resolves to the purchase object or null if not found.
 */
export async function getPurchaseById(id: string) {
	return db.purchase.findUnique({
		where: { id },
	});
}

/**
 * Retrieves all purchases associated with a specific organization.
 * @param organizationId - The ID of the organization.
 * @returns A promise that resolves to an array of purchase objects.
 */
export async function getPurchasesByOrganizationId(organizationId: string) {
	return db.purchase.findMany({
		where: {
			organizationId,
		},
	});
}

/**
 * Retrieves all purchases made by a specific user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of purchase objects.
 */
export async function getPurchasesByUserId(userId: string) {
	return db.purchase.findMany({
		where: {
			userId,
		},
	});
}

/**
 * Retrieves a purchase by its subscription ID.
 * @param subscriptionId - The ID of the subscription.
 * @returns A promise that resolves to the purchase object or null if not found.
 */
export async function getPurchaseBySubscriptionId(subscriptionId: string) {
	return db.purchase.findFirst({
		where: {
			subscriptionId,
		},
	});
}

/**
 * Creates a new purchase record in the database.
 * @param purchase - The purchase data to be created, excluding id, createdAt, and updatedAt.
 * @returns A promise that resolves to the newly created purchase object.
 */
export async function createPurchase(
	purchase: Omit<
		z.infer<typeof PurchaseSchema>,
		"id" | "createdAt" | "updatedAt"
	>,
) {
	const created = await db.purchase.create({
		data: purchase,
	});

	return getPurchaseById(created.id);
}

/**
 * Updates an existing purchase record.
 * @param purchase - An object containing the purchase's ID and the fields to update.
 * @returns A promise that resolves to the updated purchase object.
 */
export async function updatePurchase(
	purchase: Partial<
		Omit<z.infer<typeof PurchaseSchema>, "createdAt" | "updatedAt">
	> & { id: string },
) {
	const updated = await db.purchase.update({
		where: {
			id: purchase.id,
		},
		data: purchase,
	});

	return getPurchaseById(updated.id);
}

/**
 * Deletes a purchase record by its subscription ID.
 * @param subscriptionId - The ID of the subscription associated with the purchase to be deleted.
 */
export async function deletePurchaseBySubscriptionId(subscriptionId: string) {
	await db.purchase.delete({
		where: {
			subscriptionId,
		},
	});
}
