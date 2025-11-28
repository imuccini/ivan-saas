import { orpcClient } from "@shared/lib/orpc-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const workspaceListQueryKey = (organizationId: string) => ["workspaces", "list", organizationId] as const;
export const useWorkspaceListQuery = (organizationId: string) => {
	return useQuery({
		queryKey: workspaceListQueryKey(organizationId),
		queryFn: async () => {
			const workspaces = await orpcClient.workspaces.list({
				organizationId,
			});
			return workspaces;
		},
        enabled: !!organizationId,
	});
};

export const createWorkspaceMutationKey = ["create-workspace"] as const;
export const useCreateWorkspaceMutation = () => {
	return useMutation({
		mutationKey: createWorkspaceMutationKey,
		mutationFn: async ({
			name,
			slug,
			organizationId,
		}: {
			name: string;
			slug?: string;
			organizationId: string;
		}) => {
			const workspace = await orpcClient.workspaces.create({
				name,
				slug,
				organizationId,
			});
			return workspace;
		},
	});
};

export const updateWorkspaceMutationKey = ["update-workspace"] as const;
export const useUpdateWorkspaceMutation = () => {
	return useMutation({
		mutationKey: updateWorkspaceMutationKey,
		mutationFn: async ({
			id,
			name,
			slug,
		}: {
			id: string;
			name?: string;
			slug?: string;
		}) => {
			const workspace = await orpcClient.workspaces.update({
				id,
				name,
				slug,
			});
			return workspace;
		},
	});
};

export const deleteWorkspaceMutationKey = ["delete-workspace"] as const;
export const useDeleteWorkspaceMutation = () => {
	return useMutation({
		mutationKey: deleteWorkspaceMutationKey,
		mutationFn: async ({ id }: { id: string }) => {
			await orpcClient.workspaces.delete({ id });
		},
	});
};
