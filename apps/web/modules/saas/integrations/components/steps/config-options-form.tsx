"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@ui/components/switch";
import { Textarea } from "@ui/components/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";

const configFormSchema = z.object({
	ssoGroups: z.string().default(""),
	sponsorGroups: z.string().default(""),
	byodEnabled: z.boolean().default(false),
	byodImportAll: z.boolean().default(true),
	byodGroups: z.string().default(""),
});

type ConfigFormValues = z.infer<typeof configFormSchema>;

interface ConfigOptionsFormProps {
	defaultValues?: Partial<ConfigFormValues>;
	onSubmit: (data: ConfigFormValues) => void;
	onBack: () => void;
	isLoading?: boolean;
}

export function ConfigOptionsForm({
	defaultValues,
	onSubmit,
	onBack,
	isLoading,
}: ConfigOptionsFormProps) {
	const form = useForm<ConfigFormValues>({
		resolver: zodResolver(configFormSchema) as any,
		defaultValues: {
			ssoGroups: defaultValues?.ssoGroups || "",
			sponsorGroups: defaultValues?.sponsorGroups || "",
			byodEnabled: defaultValues?.byodEnabled || false,
			byodImportAll: defaultValues?.byodImportAll !== false, // Default true
			byodGroups: defaultValues?.byodGroups || "",
		},
	});

	const byodEnabled = form.watch("byodEnabled");
	const byodImportAll = form.watch("byodImportAll");

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Integration Configuration</h3>
				<p className="text-sm text-muted-foreground">
					Configure access control and synchronization settings.
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<div className="space-y-4 rounded-lg border p-4">
						<h4 className="font-medium">Guest WiFi Access (SSO)</h4>
						<FormField
							control={form.control}
							name="ssoGroups"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Allowed Groups (Object IDs)</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter Group Object IDs separated by comma (e.g. uuid-1, uuid-2)"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Users in these groups will be allowed to login to
										Guest WiFi. Leave empty to allow all users in the
										tenant.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="space-y-4 rounded-lg border p-4">
						<h4 className="font-medium">Sponsor Sync</h4>
						<FormField
							control={form.control}
							name="sponsorGroups"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sponsor Groups (Object IDs)</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter Group Object IDs separated by comma"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Users in these groups will be imported as
										Sponsors.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="space-y-4 rounded-lg border p-4">
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium">BYOD Management</h4>
								<p className="text-sm text-muted-foreground">
									Sync users for BYOD access
								</p>
							</div>
							<FormField
								control={form.control}
								name="byodEnabled"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						{byodEnabled && (
							<div className="pl-4 border-l-2 border-muted space-y-4 mt-4">
								<FormField
									control={form.control}
									name="byodImportAll"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
											<div className="space-y-0.5">
												<FormLabel>Import All Users</FormLabel>
												<FormDescription>
													Sync all users from the tenant
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								{!byodImportAll && (
									<FormField
										control={form.control}
										name="byodGroups"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Filter by Groups (Object IDs)
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Enter Group Object IDs to filter import"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Only update users belonging to these
													groups.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</div>
						)}
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onBack}
							disabled={isLoading}
						>
							Back
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Saving..." : "Save Configuration"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
