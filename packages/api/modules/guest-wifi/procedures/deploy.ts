import { ORPCError } from "@orpc/server";
import { db } from "@repo/database";
import { z } from "zod";
import { decrypt } from "../../../lib/encryption";
import { protectedProcedure } from "../../../orpc/procedures";
import { MerakiAdapter } from "../../networks/adapters/meraki-adapter";

export const deploy = protectedProcedure
	.route({
		method: "POST",
		path: "/guest-wifi/deploy",
		tags: ["Guest WiFi"],
		summary: "Deploy Guest WiFi to networks",
	})
	.input(
		z.object({
			workspaceId: z.string(),
			networkIds: z.array(z.string()),
		}),
	)
	.handler(async ({ input, context }) => {
		const { user } = context;

		// Verify workspace access
		const workspace = await db.workspace.findUnique({
			where: { id: input.workspaceId },
			include: { organization: true },
		});

		if (!workspace) {
			throw new ORPCError("NOT_FOUND", {
				message: "Workspace not found",
			});
		}

		const member = await db.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: workspace.organizationId,
					userId: user.id,
				},
			},
		});

		if (!member && user.role !== "admin") {
			throw new ORPCError("FORBIDDEN", {
				message: "You are not a member of this organization",
			});
		}

		const networks = await db.network.findMany({
			where: {
				id: { in: input.networkIds },
				workspaceId: input.workspaceId,
			},
			include: {
				integration: true,
			},
		});

		const merakiAdapter = new MerakiAdapter();
		let deployedCount = 0;
		const errors: { networkName: string; error: string }[] = [];

		for (const network of networks) {
			try {
				// biome-ignore lint/suspicious/noExplicitAny: JSON type
				const config = (network.config as any) || {};
				const ssidMapping = config.ssidMapping || {};
				const guestWifi = ssidMapping.guestWifi;

				if (
					!guestWifi ||
					typeof guestWifi !== "object" ||
					!("ssidNumber" in guestWifi)
				) {
					continue; // Skip if not mapped
				}

				if (!network.integration || !network.integration.credentials) {
					throw new Error("Integration credentials missing");
				}

				// biome-ignore lint/suspicious/noExplicitAny: JSON type
				const credentials = network.integration.credentials as any;
				const apiKey = decrypt(credentials.apiKey);
				const networkId = config.id || network.externalId;

				// Update Meraki SSID
				await merakiAdapter.updateNetworkSSID(
					apiKey,
					networkId,
					guestWifi.ssidNumber,
					{
						enabled: true,
						authMode: "open",
						splashPage: "Click-through splash page",
					},
				);

				// Update local DB status
				const updatedMapping = {
					...ssidMapping,
					guestWifi: {
						...guestWifi,
						enabled: true,
					},
				};

				await db.network.update({
					where: { id: network.id },
					data: {
						config: {
							...config,
							ssidMapping: updatedMapping,
						},
					},
				});

				deployedCount++;
			} catch (error) {
				console.error(
					`Failed to deploy to network ${network.name}:`,
					error,
				);
				errors.push({
					networkName: network.name,
					error:
						error instanceof Error
							? error.message
							: "Unknown error",
				});
			}
		}

		return {
			success: true,
			deployedCount,
			errors,
		};
	});
