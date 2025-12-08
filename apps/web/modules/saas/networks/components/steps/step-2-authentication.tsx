"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Label } from "@ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Loader2, PlusIcon } from "lucide-react";
import { useState } from "react";
import { IntegrationAuthDialog } from "../integration-auth-dialog";

interface Step2Props {
	vendor: string;
	onComplete: (integrationId: string) => void;
}

export function Step2Authentication({ vendor, onComplete }: Step2Props) {
	const { activeWorkspace } = useActiveWorkspace();
	const queryClient = useQueryClient();
	const [selectedIntegration, setSelectedIntegration] = useState<string>("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { data: integrations, isLoading } = useQuery(
		orpc.integrations.list.queryOptions({
			input: {
				workspaceId: activeWorkspace?.id || "",
				provider: vendor,
			},
			enabled: !!activeWorkspace?.id,
		}),
	);

	const handleIntegrationCreated = (integrationId: string) => {
		setIsDialogOpen(false);
		queryClient.invalidateQueries({
			queryKey: orpc.integrations.list.queryKey({
				input: {
					workspaceId: activeWorkspace?.id || "",
					provider: vendor,
				},
			}),
		});
		onComplete(integrationId);
	};

	const handleUseExisting = () => {
		if (selectedIntegration) {
			onComplete(selectedIntegration);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const hasExistingIntegrations = integrations && integrations.length > 0;

	return (
		<div className="space-y-6">
			{hasExistingIntegrations ? (
				<>
					{/* Use Existing Integration */}
					<Card>
						<CardHeader>
							<CardTitle>Use Existing Integration</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="integration">
									Select Integration
								</Label>
								<Select
									value={selectedIntegration}
									onValueChange={setSelectedIntegration}
								>
									<SelectTrigger id="integration">
										<SelectValue placeholder="Choose an integration" />
									</SelectTrigger>
									<SelectContent>
										{integrations.map((integration) => (
											<SelectItem
												key={integration.id}
												value={integration.id}
											>
												{integration.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Button
								onClick={handleUseExisting}
								disabled={!selectedIntegration}
								className="w-full"
							>
								Continue with Selected Integration
							</Button>
						</CardContent>
					</Card>

					{/* Or Create New */}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or
							</span>
						</div>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Create New Integration</CardTitle>
						</CardHeader>
						<CardContent>
							<Button
								variant="outline"
								onClick={() => setIsDialogOpen(true)}
								className="w-full"
							>
								<PlusIcon className="mr-2 h-4 w-4" />
								Add New Integration
							</Button>
						</CardContent>
					</Card>
				</>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Create Integration</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-muted-foreground">
							No existing integrations found. Create a new one to
							continue.
						</p>
						<Button
							onClick={() => setIsDialogOpen(true)}
							className="w-full"
						>
							<PlusIcon className="mr-2 h-4 w-4" />
							Create Integration
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Shared Integration Dialog */}
			<IntegrationAuthDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onSuccess={handleIntegrationCreated}
				preselectedVendor={vendor}
			/>
		</div>
	);
}
