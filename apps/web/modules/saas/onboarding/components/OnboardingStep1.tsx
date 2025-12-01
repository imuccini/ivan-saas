"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@repo/auth/client";
import { useSession } from "@saas/auth/hooks/use-session";
import { UserAvatarUpload } from "@saas/settings/components/UserAvatarUpload";
import { Button } from "@ui/components/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@shared/lib/orpc-query-utils";

const formSchema = z.object({
	name: z.string().min(1),
	companyName: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export function OnboardingStep1({ onCompleted }: { onCompleted: () => void }) {
	const t = useTranslations();
	const { user } = useSession();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user?.name ?? "",
			companyName: "",
		},
	});

	const createWorkspaceMutation = useMutation(
		orpc.workspaces.create.mutationOptions(),
	);

	useEffect(() => {
		if (user) {
			form.setValue("name", user.name ?? "");
		}
	}, [user]);

	const onSubmit: SubmitHandler<FormValues> = async ({ name, companyName }) => {
		form.clearErrors("root");

		try {
			await authClient.updateUser({
				name,
			});

			const { data: orgData, error: orgError } = await authClient.organization.create({
				name: companyName,
				slug: companyName.toLowerCase().replace(/\s+/g, "-"),
			});

			if (orgError) {
				throw new Error(orgError.message);
			}

			if (orgData) {
				await createWorkspaceMutation.mutateAsync({
					name: "Default Workspace",
					organizationId: orgData.id,
				});
				
				await authClient.organization.setActive({
					organizationId: orgData.id,
				});
			}

			onCompleted();
		} catch (e) {
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
					className="flex flex-col items-stretch gap-8"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t("onboarding.account.name")}
								</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="companyName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Company Name
								</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Acme Inc." />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormItem className="flex items-center justify-between gap-4">
						<div>
							<FormLabel>
								{t("onboarding.account.avatar")}
							</FormLabel>

							<FormDescription>
								{t("onboarding.account.avatarDescription")}
							</FormDescription>
						</div>
						<FormControl>
							<UserAvatarUpload
								onSuccess={() => {
									return;
								}}
								onError={() => {
									return;
								}}
							/>
						</FormControl>
					</FormItem>

					<Button type="submit" loading={form.formState.isSubmitting || createWorkspaceMutation.isPending}>
						{t("onboarding.continue")}
						<ArrowRightIcon className="ml-2 size-4" />
					</Button>
				</form>
			</Form>
		</div>
	);
}
