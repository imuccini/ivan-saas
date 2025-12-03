import { ORPCError } from "@orpc/client";
import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Copy a global template to create a workspace-specific override
 */
export const copyGlobalTemplate = protectedProcedure
	.input(
		z.object({
			templateId: z.string(),
			workspaceId: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		// Get the global template
		const globalTemplate = await db.communicationTemplate.findUnique({
			where: { id: input.templateId },
		});

		if (!globalTemplate) {
			throw new ORPCError("NOT_FOUND", {
				message: "Template not found",
			});
		}

		// Ensure it's a global template
		if (globalTemplate.workspaceId !== null) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Can only copy global templates",
			});
		}

		// Check if workspace override already exists
		const existing = await db.communicationTemplate.findFirst({
			where: {
				triggerId: globalTemplate.triggerId,
				type: globalTemplate.type,
				workspaceId: input.workspaceId,
			},
		});

		if (existing) {
			throw new ORPCError("CONFLICT", {
				message: "Workspace template already exists",
			});
		}

		// Create workspace-specific copy
		const workspaceTemplate = await db.communicationTemplate.create({
			data: {
				triggerId: globalTemplate.triggerId,
				workspaceId: input.workspaceId,
				type: globalTemplate.type,
				subject: globalTemplate.subject,
				bodyContent: globalTemplate.bodyContent,
				isActive: globalTemplate.isActive,
			},
			include: {
				trigger: true,
			},
		});

		return workspaceTemplate;
	});
