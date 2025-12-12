import https from "node:https";

export interface UbiquitiSite {
	_id: string;
	name: string;
	desc: string;
	role: string;
	attr_hidden_id: string;
	attr_no_delete: boolean;
	ident: string;
}

export interface UbiquitiWLAN {
	_id: string;
	name: string;
	enabled: boolean;
	security: string;
	passphrase?: string;
	usergroup_id?: string;
	wlangroup_id?: string;
}

interface UbiquitiCredentials {
	controllerUrl: string;
	username: string;
	password: string;
	allowSelfSigned: boolean;
}

interface UbiquitiSession {
	cookie: string;
	csrfToken?: string;
}

export class UbiquitiAdapter {
	private async login(credentials: UbiquitiCredentials): Promise<UbiquitiSession> {
		const { controllerUrl, username, password, allowSelfSigned } = credentials;
		
		let baseUrl = controllerUrl;
		if (!baseUrl.startsWith("http")) {
			baseUrl = `https://${baseUrl}`;
		}
		baseUrl = baseUrl.replace(/\/$/, "");

		const agent = new https.Agent({
			rejectUnauthorized: !allowSelfSigned,
		});

		const loginPayload = { username, password };
		
		// Try standard login first
		let loginUrl = `${baseUrl}/api/login`;
		let response = await fetch(loginUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(loginPayload),
			// @ts-ignore
			agent,
		});

		// Fallback to UniFi OS login
		if (response.status === 404) {
			loginUrl = `${baseUrl}/api/auth/login`;
			response = await fetch(loginUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(loginPayload),
				// @ts-ignore
				agent,
			});
		}

		if (!response.ok) {
			throw new Error(`Ubiquiti login failed: ${response.status} ${response.statusText}`);
		}

		const setCookie = response.headers.get("set-cookie");
		if (!setCookie) {
			throw new Error("No session cookies received from Ubiquiti controller");
		}

		return {
			cookie: setCookie,
			csrfToken: response.headers.get("x-csrf-token") || undefined,
		};
	}

	async getSites(credentials: UbiquitiCredentials): Promise<UbiquitiSite[]> {
		const session = await this.login(credentials);
		
		let baseUrl = credentials.controllerUrl;
		if (!baseUrl.startsWith("http")) {
			baseUrl = `https://${baseUrl}`;
		}
		baseUrl = baseUrl.replace(/\/$/, "");

		const agent = new https.Agent({
			rejectUnauthorized: !credentials.allowSelfSigned,
		});

		const response = await fetch(`${baseUrl}/api/self/sites`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Cookie": session.cookie,
				...(session.csrfToken ? { "x-csrf-token": session.csrfToken } : {}),
			},
			// @ts-ignore
			agent,
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch sites: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data; // UniFi API typically wraps result in { data: [] }
	}

	async getWLANs(credentials: UbiquitiCredentials, siteName: string): Promise<UbiquitiWLAN[]> {
		const session = await this.login(credentials);
		
		let baseUrl = credentials.controllerUrl;
		if (!baseUrl.startsWith("http")) {
			baseUrl = `https://${baseUrl}`;
		}
		baseUrl = baseUrl.replace(/\/$/, "");

		const agent = new https.Agent({
			rejectUnauthorized: !credentials.allowSelfSigned,
		});

		// Ensure siteName is used correctly (Ubiquiti uses 'default' or site 'name' in URL)
		// Usually /api/s/{site}/rest/wlanconf
		const response = await fetch(`${baseUrl}/api/s/${siteName}/rest/wlanconf`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Cookie": session.cookie,
				...(session.csrfToken ? { "x-csrf-token": session.csrfToken } : {}),
			},
			// @ts-ignore
			agent,
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch WLANs: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data;
	}
}
