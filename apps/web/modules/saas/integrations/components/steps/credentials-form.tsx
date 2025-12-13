"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type IdpId } from "@saas/integrations/lib/identity-providers";
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
import { PasswordInput } from "@ui/components/password-input";
import { useForm } from "react-hook-form";
import { z } from "zod";

const entraCredentialsSchema = z.object({
	tenantId: z.string().min(1, "Tenant ID is required"),
	clientId: z.string().min(1, "Client ID is required"),
	clientSecret: z.string().min(1, "Client Secret is required"),
});

// Generic schema that can be extended
const credentialsSchema = z.record(z.string(), z.string());

interface CredentialsFormProps {
	vendorId: IdpId;
	defaultValues?: Record<string, string>;
	onSubmit: (data: Record<string, string>) => void;
	onBack: () => void;
}

export function CredentialsForm({
	vendorId,
	defaultValues,
	onSubmit,
	onBack,
}: CredentialsFormProps) {
	// Dynamically select schema based on vendor
	const form = useForm<
		z.infer<typeof entraCredentialsSchema> | Record<string, string>
	>({
		resolver: zodResolver(
			vendorId === "entra-id" ? entraCredentialsSchema : credentialsSchema,
		),
		defaultValues: defaultValues || {
			tenantId: "",
			clientId: "",
			clientSecret: "",
		},
	});

	if (vendorId !== "entra-id") {
		return (
			<div className="p-4 text-center">
				<p>Configuration for {vendorId} is not yet implemented.</p>
				<Button variant="outline" onClick={onBack} className="mt-4">
					Back
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Connect Microsoft Entra ID</h3>
				<p className="text-sm text-muted-foreground">
					Provide your Azure AD application credentials.
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<FormField
						control={form.control}
						name="tenantId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tenant ID</FormLabel>
								<FormControl>
									<Input
										placeholder="e.g. 00000000-0000-0000-0000-000000000000"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									The Directory (tenant) ID from your Azure App
									Registration
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="clientId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Client ID</FormLabel>
								<FormControl>
									<Input
										placeholder="e.g. 00000000-0000-0000-0000-000000000000"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									The Application (client) ID from your Azure App
									Registration
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="clientSecret"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Client Secret</FormLabel>
								<FormControl>
									<PasswordInput
										{...field}
									/>
								</FormControl>
								<FormDescription>
									A client secret generated for your app
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end gap-3 pt-4">
						<Button type="button" variant="outline" onClick={onBack}>
							Back
						</Button>
						<Button type="submit">Complete Setup</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
