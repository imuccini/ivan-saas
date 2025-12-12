import { ORPCError } from "@orpc/server";
import { db } from "@repo/database";
import { z } from "zod";
import { decrypt } from "../../../lib/encryption";
import { protectedProcedure } from "../../../orpc/procedures";
import { MerakiAdapter } from "../../networks/adapters/meraki-adapter";
import { guestWifiConfigDataSchema } from "../types";

export const updateName = protectedProcedure
	.route({
		method: "POST",
		path: "/guest-wifi/update-name",
		tags: ["Guest WiFi"],
		summary: "Update Guest WiFi SSID name across all networks",
	})
	.input(
		z.object({
			workspaceId: z.string(),
			ssidName: z.string(),
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

		// Update GuestWifiConfig
		const guestWifiConfig = await db.guestWifiConfig.findFirst({
			where: { workspaceId: input.workspaceId },
		});

		if (guestWifiConfig) {
			// biome-ignore lint/suspicious/noExplicitAny: JSON type
			const currentConfig = (guestWifiConfig.config as any) || {};
			const newConfig = {
				...currentConfig,
				ssidName: input.ssidName,
			};

			// Validate against schema
			const validatedConfig = guestWifiConfigDataSchema.parse(newConfig);

			await db.guestWifiConfig.update({
				where: { id: guestWifiConfig.id },
				data: {
					config: validatedConfig,
				},
			});
		}

		// Fetch all networks for the workspace
		const networks = await db.network.findMany({
			where: {
				workspaceId: input.workspaceId,
			},
			include: {
				integration: true,
			},
		});

		const merakiAdapter = new MerakiAdapter();
		let updatedCount = 0;
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

				// Update Meraki SSID Name
				await merakiAdapter.updateNetworkSSID(
					apiKey,
					networkId,
					guestWifi.ssidNumber,
					{
						name: input.ssidName,
					},
				);

				// Update local DB mapping
				const updatedMapping = {
					...ssidMapping,
					guestWifi: {
						...guestWifi,
						ssidName: input.ssidName,
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

				updatedCount++;
			} catch (error) {
				console.error(
					`Failed to update SSID name for network ${network.name}:`,
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
			updatedCount,
			errors,
		};
	});
