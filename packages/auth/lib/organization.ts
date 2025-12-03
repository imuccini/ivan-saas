// Import a function to retrieve organization data, including purchases and member count
import { getOrganizationWithPurchasesAndMembersCount } from "@repo/database";
// Import the logger for logging errors and other information
import { logger } from "@repo/logs";
// Import a function to update the number of seats in a subscription
import { setSubscriptionSeats } from "@repo/payments";

/**
 * Updates the number of seats in an organization's subscription to match the current member count.
 * @param organizationId - The ID of the organization to update.
 */
export async function updateSeatsInOrganizationSubscription(
	organizationId: string,
) {
	// Retrieve the organization's details, including purchases and member count
	const organization =
		await getOrganizationWithPurchasesAndMembersCount(organizationId);

	// If the organization has no purchases, there's nothing to update
	if (!organization?.purchases.length) {
		return;
	}

	// Find the active subscription among the organization's purchases
	const activeSubscription = organization.purchases.find(
		(purchase) => purchase.type === "SUBSCRIPTION",
	);

	// If there's no active subscription with a subscription ID, exit the function
	if (!activeSubscription?.subscriptionId) {
		return;
	}

	try {
		// Update the subscription seats to match the organization's member count
		await setSubscriptionSeats({
			id: activeSubscription.subscriptionId,
			seats: organization.membersCount,
		});
	} catch (error) {
		// Log an error if the subscription seats could not be updated
		logger.error("Could not update seats in organization subscription", {
			organizationId,
			error,
		});
	}
}
