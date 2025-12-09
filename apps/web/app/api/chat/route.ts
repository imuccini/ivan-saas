import { vertex } from "@ai-sdk/google-vertex";
import { streamText } from "ai";
import fs from "fs";
import path from "path";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { messages } = await req.json();

		// Set location env var programmatically if missing
		if (!process.env.GOOGLE_VERTEX_LOCATION) {
			process.env.GOOGLE_VERTEX_LOCATION = "us-central1";
		}

		// Handle Google Credentials
		// 1. Check for local google-credentials.json (priority)
		const localCredsPath = path.join(
			process.cwd(),
			"google-credentials.json",
		);
		if (fs.existsSync(localCredsPath)) {
			process.env.GOOGLE_APPLICATION_CREDENTIALS = localCredsPath;
			console.log(
				"Using local google-credentials.json at",
				localCredsPath,
			);
		}
		// 2. Fallback: Create from env vars if file is missing
		else if (
			!process.env.GOOGLE_APPLICATION_CREDENTIALS &&
			process.env.GOOGLE_PRIVATE_KEY &&
			process.env.GOOGLE_CLIENT_EMAIL
		) {
			try {
				const credentials = {
					type: "service_account",
					project_id: process.env.GOOGLE_VERTEX_PROJECT,
					private_key_id: "unknown",
					private_key: process.env.GOOGLE_PRIVATE_KEY.replace(
						/\\n/g,
						"\n",
					),
					client_email: process.env.GOOGLE_CLIENT_EMAIL,
					client_id: "unknown",
					auth_uri: "https://accounts.google.com/o/oauth2/auth",
					token_uri: "https://oauth2.googleapis.com/token",
					auth_provider_x509_cert_url:
						"https://www.googleapis.com/oauth2/v1/certs",
					client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
						process.env.GOOGLE_CLIENT_EMAIL,
					)}`,
				};

				// Use /tmp for compatibility with read-only filesystems (like Vercel)
				// Fallback to local dir if /tmp doesn't exist (e.g. Windows)
				const tempDir = fs.existsSync("/tmp")
					? "/tmp"
					: path.join(process.cwd(), ".tmp");
				if (!fs.existsSync(tempDir) && tempDir !== "/tmp") {
					fs.mkdirSync(tempDir, { recursive: true });
				}

				const tempPath = path.join(tempDir, "google-credentials.json");
				fs.writeFileSync(tempPath, JSON.stringify(credentials));
				process.env.GOOGLE_APPLICATION_CREDENTIALS = tempPath;
				console.log(
					"Created temporary google-credentials.json at",
					tempPath,
				);
			} catch (err) {
				console.error("Failed to create credential file:", err);
			}
		}

		const result = streamText({
			model: vertex("gemini-2.5-flash"),
			messages,
			system: `You are a helpful "Routing Assistant" for the Antigravity SaaS platform.
    Your goal is to analyze the user's request and determine the best course of action.
    
    - If the user asks "How do I..." or for documentation, respond with: "[ROUTING: SEARCH_KNOWLEDGE_BASE] I will search the documentation for you." followed by a simulated search result.
    - If the user asks for help setting up a feature, respond with: "[ROUTING: GET_SETUP_STEPS] Here are the steps to set that up:" followed by simulated steps.
    - If the user wants to configure something, respond with: "[ROUTING: UPDATE_CONFIG] I can help you update that configuration." followed by a confirmation.
    - If the user just says hello or chat, respond naturally.
    
    Since I cannot execute real tools right now, just simulate the helpful response the user expects.`,
		});

		// Use toTextStreamResponse for compatibility
		return result.toTextStreamResponse();
	} catch (error) {
		console.error("Error in chat API:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to process chat request",
				details: error instanceof Error ? error.message : String(error),
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
