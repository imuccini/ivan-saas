import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";

export function useOnboardingStatus(workspaceId?: string) {
	return useQuery(
		workspaceId
			? orpc.onboarding.getStatus.queryOptions({
					input: {
						workspaceId,
					},
				})
			: {
					queryKey: ["onboarding", "status", "disabled"],
					queryFn: () => Promise.resolve(null),
					enabled: false,
				},
	);
}
