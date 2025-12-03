"use client";
import { authClient } from "@repo/auth/client";
import { useRouter } from "@shared/hooks/router";
import { clearCache } from "@shared/lib/cache";
import { orpcClient } from "@shared/lib/orpc-client";
import { Progress } from "@ui/components/progress";
import { LoaderIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { withQuery } from "ufo";
import { OnboardingStep1 } from "./OnboardingStep1";

export function OnboardingForm() {
	const t = useTranslations();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isCompleting, setIsCompleting] = useState(false);

	const stepSearchParam = searchParams.get("step");
	const redirectTo = searchParams.get("redirectTo");
	const onboardingStep = stepSearchParam
		? Number.parseInt(stepSearchParam, 10)
		: 1;

	// biome-ignore lint/correctness/noUnusedVariables: Will be used with more steps
	const setStep = (step: number) => {
		router.replace(
			withQuery(window.location.search ?? "", {
				step,
			}),
		);
	};

	const onCompleted = useCallback(async (orgSlug?: string, workspaceSlug?: string) => {
		// Note: isCompleting is already set to true by OnboardingStep1
		// We don't reset it - let it persist until the new page loads

		try {
			// 1. Update user state
			const updateUserPromise = authClient.updateUser({
				onboardingComplete: true,
			});

			// 2. Clear cache
			const clearCachePromise = clearCache();

			// Run independent operations in parallel
			await Promise.all([updateUserPromise, clearCachePromise]);

			// 3. Navigate directly if we have the slugs (Performance Optimization)
			if (orgSlug && workspaceSlug) {
				router.replace(`/app/${orgSlug}/${workspaceSlug}`);
				return;
			}

			// Fallback: Fetch if we don't have slugs (e.g. if skipped or error)
			const { data: organizations } =
				await authClient.organization.list();

			if (organizations && organizations.length === 1) {
				const organization = organizations[0];
				const workspaces = await orpcClient.workspaces.list({
					organizationId: organization.id,
				});

				if (workspaces && workspaces.length > 0) {
					// Loading state persists during navigation
					router.replace(
						`/app/${organization.slug}/${workspaces[0].slug}`,
					);
					return;
				}

				router.replace(`/app/${organization.slug}/settings/workspaces`);
				return;
			}

			router.replace(redirectTo ?? "/app");
		} catch (e) {
			console.error(e);
			// Even on error, navigate away - the error will be handled by the destination page
			router.replace(redirectTo ?? "/app");
		}
	}, [router, redirectTo]);

	// Prefetch the dashboard on mount
	useEffect(() => {
		router.prefetch("/app");
	}, [router]);

	const steps = useMemo(() => [
		{
			component: (
				<OnboardingStep1
					onCompleted={onCompleted}
					setIsCompleting={setIsCompleting}
				/>
			),
		},
	], [onCompleted]);

	// Show loading state during workspace setup
	if (isCompleting) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<LoaderIcon className="size-8 animate-spin text-primary" />
				<div className="text-center">
					<h2 className="font-semibold text-lg">
						Setting up your workspace...
					</h2>
					<p className="text-muted-foreground text-sm mt-1">
						This will only take a moment
					</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h1 className="font-bold text-xl md:text-2xl">
				{t("onboarding.title")}
			</h1>
			<p className="mt-2 mb-6 text-foreground/60">
				{t("onboarding.message")}
			</p>

			{steps.length > 1 && (
				<div className="mb-6 flex items-center gap-3">
					<Progress
						value={(onboardingStep / steps.length) * 100}
						className="h-2"
					/>
					<span className="shrink-0 text-foreground/60 text-xs">
						{t("onboarding.step", {
							step: onboardingStep,
							total: steps.length,
						})}
					</span>
				</div>
			)}

			{steps[onboardingStep - 1].component}
		</div>
	);
}
