"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { SSIDMapping } from "./step-4-ssid-mapping";

interface Step5Props {
	integrationId: string;
	organizationId: string;
	// biome-ignore lint/suspicious/noExplicitAny: Network object structure varies
	networks: any[];
	tags: string[];
	ssidMapping?: SSIDMapping;
}

export function Step5Provisioning({
	integrationId,
	organizationId,
	networks,
	tags,
	ssidMapping,
}: Step5Props) {
	const router = useRouter();
	const params = useParams();
	const { activeWorkspace } = useActiveWorkspace();

	const provisionMutation = useMutation(
		orpc.networks.provision.mutationOptions({
			onSuccess: () => {
				toast.success("Provisioning started successfully");
			},
			onError: () => {
				toast.error("Failed to start provisioning");
			},
		}),
	);

	const handleProvision = () => {
		if (!activeWorkspace?.id) return;
		provisionMutation.mutate({
			workspaceId: activeWorkspace.id,
			integrationId,
			organizationId,
			networks: networks.map((n) => ({
				id: n.id,
				name: n.name,
				config: n,
			})),
			tags,
		});
	};

	const handleFinish = () => {
		const orgSlug = params.organizationSlug as string;
		const workspaceSlug = params.workspaceSlug as string;

		if (orgSlug && workspaceSlug) {
			router.push(`/app/${orgSlug}/${workspaceSlug}/manage/networks`);
		} else {
			// Fallback: just reload the current page which should show the networks
			window.location.href = window.location.pathname.replace(
				/\/[^/]*$/,
				"/networks",
			);
		}
	};

	if (provisionMutation.isSuccess) {
		return (
			<div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
				<div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
					<CheckCircle className="h-8 w-8" />
				</div>
				<div>
					<h2 className="text-2xl font-bold">Provisioning Started</h2>
					<p className="text-muted-foreground max-w-md mx-auto mt-2">
						We are configuring your networks in the background. This
						may take a few minutes. You can check the status in the
						Networks dashboard.
					</p>
				</div>
				<Button onClick={handleFinish} type="button">
					Go to Networks Dashboard
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold">Confirm Provisioning</h2>
				<p className="text-muted-foreground">
					Review your selection and start the provisioning process.
				</p>
			</div>

			<div className="bg-muted/50 rounded-lg p-6 space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<span className="text-sm text-muted-foreground block">
							Integration ID
						</span>
						<span className="font-medium">{integrationId}</span>
					</div>
					<div>
						<span className="text-sm text-muted-foreground block">
							Organization ID
						</span>
						<span className="font-medium">{organizationId}</span>
					</div>
					<div>
						<span className="text-sm text-muted-foreground block">
							Selected Networks
						</span>
						<span className="font-medium">
							{networks.length} networks
						</span>
					</div>
					<div>
						<span className="text-sm text-muted-foreground block">
							Device Tags
						</span>
						<span className="font-medium">
							{tags.length > 0 ? tags.join(", ") : "None"}
						</span>
					</div>
				</div>

				<div className="border-t pt-4">
					<h4 className="font-medium mb-2">
						Networks to be configured:
					</h4>
					<ul className="list-disc list-inside text-sm text-muted-foreground max-h-40 overflow-y-auto">
						{networks.map((n) => (
							<li key={n.id}>{n.name}</li>
						))}
					</ul>
				</div>
			</div>

			<div className="flex justify-end pt-4">
				<Button
					onClick={handleProvision}
					disabled={provisionMutation.isPending}
				>
					{provisionMutation.isPending && (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					)}
					Confirm & Provision
				</Button>
			</div>
		</div>
	);
}
