"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@repo/auth/client";
import { useSession } from "@saas/auth/hooks/use-session";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@ui/components/alert";
import { Button } from "@ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { ArrowRightIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { z } from "zod";

const formSchema = z.object({
	companyName: z.string().min(1, "Company name is required"),
	website: z.string().url("Invalid website URL").optional().or(z.literal("")),
	industry: z.string().optional(),
	country: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function OnboardingStep1({
	onCompleted,
	setIsCompleting,
}: {
	onCompleted: (orgSlug?: string, workspaceSlug?: string) => void;
	setIsCompleting: (value: boolean) => void;
}) {
	const t = useTranslations();
	const { user } = useSession();
	const [isLoadingCompany, setIsLoadingCompany] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			companyName: "",
			website: "",
			industry: "",
			country: "",
		},
	});

	const createWorkspaceMutation = useMutation(
		orpc.workspaces.create.mutationOptions(),
	);

	// Fetch company data when component mounts
	useEffect(() => {
		if (user?.email) {
			setIsLoadingCompany(true);
			fetch(
				`/api/companies/by-email?email=${encodeURIComponent(user.email)}`,
			)
				.then((response) => {
					if (response.ok) {
						return response.json();
					}
					throw new Error("Failed to fetch");
				})
				.then((companyData) => {
					if (companyData.name) {
						form.setValue("companyName", companyData.name);
					}
					if (companyData.website) {
						form.setValue("website", companyData.website);
					}
					if (companyData.industry) {
						form.setValue("industry", companyData.industry);
					}
					if (companyData.country) {
						form.setValue("country", companyData.country);
					}
				})
				.catch(() => {
					// Silently fail if company data fetch fails
				})
				.finally(() => {
					setIsLoadingCompany(false);
				});
		}
	}, [user?.email]);

	const onSubmit: SubmitHandler<FormValues> = async ({
		companyName,
		website,
		industry,
		country,
	}) => {
		form.clearErrors("root");

		// Set loading state IMMEDIATELY before any async operations
		setIsCompleting(true);

		try {
			let orgData = null;
			let orgError = null;
			const slug = slugify(companyName, { lower: true, strict: true });
			
			if (!slug) {
				throw new Error("Invalid company name. Please try a different name.");
			}

			let attempt = 0;

			while (attempt < 5) {
				const currentSlug = attempt === 0 
					? slug 
					: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

				const result = await authClient.organization.create({
					name: companyName,
					slug: currentSlug,
				});

				if (!result.error) {
					orgData = result.data;
					break;
				}

				console.error("Organization creation failed (attempt " + attempt + "):", result.error);
				orgError = result.error;
				attempt++;
			}

			if (orgError && !orgData) {
				throw new Error(orgError.message);
			}

			if (orgData) {
				// Run independent operations in parallel for performance
				const [workspace] = await Promise.all([
					createWorkspaceMutation.mutateAsync({
						name: "Default Workspace",
						organizationId: orgData.id,
					}),
					authClient.organization.setActive({
						organizationId: orgData.id,
					}),
				]);

				// Pass slugs to onCompleted to avoid re-fetching
				onCompleted(orgData.slug, workspace.slug);
			} else {
				onCompleted();
			}
		} catch (e) {
			// Reset loading state on error
			setIsCompleting(false);
			form.setError("root", {
				type: "server",
				message: t("onboarding.notifications.accountSetupFailed"),
			});
		}
	};

	return (
		<div>
			<Form {...form}>
				<form
					className="flex flex-col items-stretch gap-6"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					{isLoadingCompany && (
						<Alert>
							<LoaderIcon className="size-4 animate-spin" />
							<AlertDescription>
								Loading company information...
							</AlertDescription>
						</Alert>
					)}

					<FormField
						control={form.control}
						name="companyName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Name</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Phoenix" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="website"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Website</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="url"
										placeholder="https://example.com"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="industry"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Industry</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button
						type="submit"
						loading={
							form.formState.isSubmitting ||
							createWorkspaceMutation.isPending
						}
					>
						{t("onboarding.continue")}
						<ArrowRightIcon className="ml-2 size-4" />
					</Button>
				</form>
			</Form>
		</div>
	);
}
