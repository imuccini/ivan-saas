import { ORPCError } from "@orpc/server";
import { db } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../orpc/procedures";
import { UbiquitiAdapter } from "./adapters/ubiquiti-adapter";

const ubiquitiAdapter = new UbiquitiAdapter();

const getSites = protectedProcedure
	.route({
		method: "GET",
		path: "/ubiquiti/sites",
		tags: ["Ubiquiti"],
		summary: "Get Ubiquiti sites",
	})
	.input(z.object({ integrationId: z.string(), workspaceId: z.string() }))
	.handler(async ({ input, context }) => {
		const { user } = context;

		const workspace = await db.workspace.findUnique({
			where: { id: input.workspaceId },
			include: { organization: true },
		});

		if (!workspace) {
			throw new ORPCError("NOT_FOUND", { message: "Workspace not found" });
		}

		const integration = await db.integration.findUnique({
			where: { id: input.integrationId, workspaceId: input.workspaceId },
		});

		if (!integration || !integration.credentials) {
			throw new Error("Integration not found");
		}

		// biome-ignore lint/suspicious/noExplicitAny: JSON type
		const credentials = integration.credentials as any;

		const sites = await ubiquitiAdapter.getSites({
			controllerUrl: credentials.controllerUrl,
			username: credentials.username,
			password: credentials.password,
			allowSelfSigned: credentials.allowSelfSigned,
		});

		// Map to a standard format if needed, or return raw.
		// Front-end expects id and name usually.
		return sites.map(site => ({
			id: site.name, // Ubiquiti uses 'name' (e.g. 'default') as the identifier in API calls mostly
			// But 'name' is often the internal code. 'desc' is the display name.
			// Let's return both or map them.
			name: site.desc,
			code: site.name, // keep original name as code
			_id: site._id
		}));
	});

const getWLANs = protectedProcedure
	.route({
		method: "GET",
		path: "/ubiquiti/wlans",
		tags: ["Ubiquiti"],
		summary: "Get Ubiquiti WLANs",
	})
	.input(
		z.object({
			integrationId: z.string(),
			siteName: z.string(), // Corresponds to site.name (code)
			workspaceId: z.string(),
		}),
	)
	.handler(async ({ input, context }) => {
		const { user } = context;

		const workspace = await db.workspace.findUnique({
			where: { id: input.workspaceId },
		});

		if (!workspace) throw new ORPCError("NOT_FOUND", { message: "Workspace not found" });

		const integration = await db.integration.findUnique({
			where: { id: input.integrationId, workspaceId: input.workspaceId },
		});

		if (!integration || !integration.credentials) {
			throw new Error("Integration not found");
		}

		// biome-ignore lint/suspicious/noExplicitAny: JSON type
		const credentials = integration.credentials as any;

		const wlans = await ubiquitiAdapter.getWLANs(
			{
				controllerUrl: credentials.controllerUrl,
				username: credentials.username,
				password: credentials.password,
				allowSelfSigned: credentials.allowSelfSigned,
			},
			input.siteName
		);

		// Map to common structure used in SSIDs (number/id, name, enabled)
		// Meraki uses `number`. Ubiquiti uses `_id`.
		// The SSIDs selector checks `number`. We might need to map `number` to a hash or just use string if frontend allows.
		// Looking at ssid-mapping-editor, it expects `number` (number).
		// We might need to map Ubiquiti _id to a temporary number or update frontend to accept string IDs.
		// For now, let's see if we can just pass specific properties.
		// Actually, `ssid-mapping-editor` expects: { number: number, name: string, enabled: boolean }
		
		// Ubiquiti doesn't strictly have "ssid number" like Meraki (0-14).
		// We can generate a fake number based on index or just return the object and handle strict types later.
		// Let's map it.
		return wlans.map((wlan, index) => ({
			number: index, // Fake index for compatibility
			id: wlan._id, // Real ID
			name: wlan.name, // SSID Name
			enabled: wlan.enabled,
		}));
	});

export const ubiquitiProxyRouter = {
	getSites,
	getWLANs,
};
