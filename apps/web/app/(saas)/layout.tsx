import { config } from "@repo/config";
import { SessionProvider } from "@saas/auth/components/SessionProvider";
import { sessionQueryKey } from "@saas/auth/lib/api";
import { getOrganizationList, getSession } from "@saas/auth/lib/server";
import { ActiveOrganizationProvider } from "@saas/organizations/components/ActiveOrganizationProvider";
import { organizationListQueryKey } from "@saas/organizations/lib/api";
import { ConfirmationAlertProvider } from "@saas/shared/components/ConfirmationAlertProvider";
import { Document } from "@shared/components/Document";
import { getServerQueryClient } from "@shared/lib/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { PropsWithChildren } from "react";

export default async function SaaSLayout({ children }: PropsWithChildren) {
	// Parallelize all async operations to eliminate waterfall
	const [locale, messages, session] = await Promise.all([
		getLocale(),
		getMessages(),
		getSession(),
	]);

	if (!session) {
		redirect("/auth/login");
	}

	const queryClient = getServerQueryClient();

	// Parallelize query prefetching
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: sessionQueryKey,
			queryFn: () => session,
		}),
		config.organizations.enable
			? queryClient.prefetchQuery({
					queryKey: organizationListQueryKey,
					queryFn: getOrganizationList,
				})
			: Promise.resolve(),
		// Removed user-level payments prefetch - will be handled at organization level
	]);

	return (
		<Document locale={locale}>
			<NextIntlClientProvider messages={messages}>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<SessionProvider>
						<ActiveOrganizationProvider>
							<ConfirmationAlertProvider>
								{children}
							</ConfirmationAlertProvider>
						</ActiveOrganizationProvider>
					</SessionProvider>
				</HydrationBoundary>
			</NextIntlClientProvider>
		</Document>
	);
}
