import type { OrganizationMetadata } from "@repo/auth";
import { authClient } from "@repo/auth/client";
import { orpcClient } from "@shared/lib/orpc-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const organizationListQueryKey = ["user", "organizations"] as const;
export const useOrganizationListQuery = () => {
	return useQuery({
		queryKey: organizationListQueryKey,
		queryFn: async () => {
			const { data, error } = await authClient.organization.list();

			if (error) {
				throw new Error(
					error.message || "Failed to fetch organizations",
				);
			}

			return data;
		},
		// Organization list is relatively stable, cache for 5 minutes
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const activeOrganizationQueryKey = (slug: string) =>
	["user", "activeOrganization", slug] as const;
export const useActiveOrganizationQuery = (
	slug: string,
	options?: {
		enabled?: boolean;
	},
) => {
	return useQuery({
		queryKey: activeOrganizationQueryKey(slug),
		queryFn: async () => {
			const organization = await orpcClient.organizations.get({
				slug,
			});

			return organization;
		},
		enabled: options?.enabled,
		// Active organization data is stable, cache for 5 minutes
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const fullOrganizationQueryKey = (id: string) =>
	["fullOrganization", id] as const;
export const useFullOrganizationQuery = (id: string) => {
	return useQuery({
		queryKey: fullOrganizationQueryKey(id),
		queryFn: async () => {
			const organization = await orpcClient.organizations.get({
				id,
			});

			return organization;
		},
		// Full organization data (with members) is stable, cache for 3 minutes
		staleTime: 3 * 60 * 1000, // 3 minutes (shorter due to member changes)
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

/*
 * Create organization
 */
export const createOrganizationMutationKey = ["create-organization"] as const;
export const useCreateOrganizationMutation = () => {
	return useMutation({
		mutationKey: createOrganizationMutationKey,
		mutationFn: async ({
			name,
			metadata,
		}: {
			name: string;
			metadata?: OrganizationMetadata;
		}) => {
			const { slug } = await orpcClient.organizations.generateSlug({
				name,
			});

			const { error, data } = await authClient.organization.create({
				name,
				slug,
				metadata,
			});

			if (error) {
				throw error;
			}

			await orpcClient.workspaces.create({
				organizationId: data.id,
				name: "Default Workspace",
			});

			return data;
		},
	});
};

/*
 * Update organization
 */
export const updateOrganizationMutationKey = ["update-organization"] as const;
export const useUpdateOrganizationMutation = () => {
	return useMutation({
		mutationKey: updateOrganizationMutationKey,
		mutationFn: async ({
			id,
			name,
			metadata,
			updateSlug,
		}: {
			id: string;
			name: string;
			metadata?: OrganizationMetadata;
			updateSlug?: boolean;
		}) => {
			const slug = updateSlug
				? (
						await orpcClient.organizations.generateSlug({
							name,
						})
					).slug
				: undefined;

			const { error, data } = await authClient.organization.update({
				organizationId: id,
				data: {
					name,
					slug,
					metadata,
				},
			});

			if (error) {
				throw error;
			}

			return data;
		},
	});
};
