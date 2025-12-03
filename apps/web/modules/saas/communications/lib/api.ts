import { orpcClient } from "@shared/lib/orpc-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const communicationCategoriesQueryKey = (workspaceId: string) =>
	["communications", "categories", workspaceId] as const;

export const useCommunicationCategoriesQuery = (workspaceId: string) => {
	return useQuery({
		queryKey: communicationCategoriesQueryKey(workspaceId),
		queryFn: async () => {
			const categories = await orpcClient.communications.listCategories({
				workspaceId,
			});
			return categories;
		},
		enabled: !!workspaceId,
	});
};

export const toggleTemplateMutationKey = ["toggle-template"] as const;

export const useToggleTemplateMutation = () => {
	return useMutation({
		mutationKey: toggleTemplateMutationKey,
		mutationFn: async ({
			id,
			isActive,
		}: {
			id: string;
			isActive: boolean;
		}) => {
			const template = await orpcClient.communications.toggleTemplate({
				id,
				isActive,
			});
			return template;
		},
	});
};

export const updateTemplateMutationKey = ["update-template"] as const;

export const useUpdateTemplateMutation = () => {
	return useMutation({
		mutationKey: updateTemplateMutationKey,
		mutationFn: async ({
			id,
			subject,
			bodyContent,
		}: {
			id: string;
			subject?: string;
			bodyContent: string;
		}) => {
			const template = await orpcClient.communications.updateTemplate({
				id,
				subject,
				bodyContent,
			});
			return template;
		},
	});
};
