import { config } from "@repo/config";
import { createPurchasesHelper } from "@repo/payments/lib/helper";
import { getOrganizationList, getSession } from "@saas/auth/lib/server";
import { orpcClient } from "@shared/lib/orpc-client";
import { attemptAsync } from "es-toolkit";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Layout({ children }: PropsWithChildren) {
	// Session and organizations are already fetched in parent layout
	// Access them via React cache - they will be deduplicated automatically
	const session = await getSession();

	if (!session) {
		redirect("/auth/login");
	}

	if (config.users.enableOnboarding && !session.user.onboardingComplete) {
		redirect("/auth/onboarding");
	}

	// This call is deduplicated via React cache() wrapper in server.ts
	const organizations = await getOrganizationList();

	if (
		config.organizations.enable &&
		config.organizations.requireOrganization
	) {
		const organization =
			organizations.find(
				(org) => org.id === session?.session.activeOrganizationId,
			) || organizations[0];

		if (!organization) {
			redirect("/new-organization");
		}
	}

	const hasFreePlan = Object.values(config.payments.plans).some(
		(plan) => "isFree" in plan,
	);

	// Only check user-level billing if enabled and no free plan exists
	// Organization-level billing will be checked in [organizationSlug]/layout.tsx
	if (
		config.users.enableBilling &&
		!config.organizations.enableBilling &&
		!hasFreePlan
	) {
		const [error, data] = await attemptAsync(() =>
			orpcClient.payments.listPurchases({
				organizationId: undefined, // User-level purchases only
			}),
		);

		if (error) {
			throw new Error("Failed to fetch purchases");
		}

		const purchases = data?.purchases ?? [];

		const { activePlan } = createPurchasesHelper(purchases);

		if (!activePlan) {
			redirect("/choose-plan");
		}
	}

	return children;
}
