import { streamAgent, type StreamEvent } from "@repo/ai";
import fs from "fs";
import path from "path";

// Allow streaming responses up to 60 seconds for multi-agent processing
export const maxDuration = 60;

/**
 * Setup Google credentials for Vertex AI
 * Handles both local development and production (Vercel) environments
 */
function setupGoogleCredentials() {
	// Set location env var programmatically if missing
	if (!process.env.GOOGLE_VERTEX_LOCATION) {
		process.env.GOOGLE_VERTEX_LOCATION = "us-central1";
	}

	// Ensure GOOGLE_CLOUD_PROJECT is set (Vertex SDK often looks for this)
	if (!process.env.GOOGLE_CLOUD_PROJECT && process.env.GOOGLE_VERTEX_PROJECT) {
		process.env.GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_VERTEX_PROJECT;
	}

	// 1. Check for local google-credentials.json (priority)
	const localCredsPath = path.join(process.cwd(), "google-credentials.json");
	if (fs.existsSync(localCredsPath)) {
		process.env.GOOGLE_APPLICATION_CREDENTIALS = localCredsPath;
		console.log("Using local google-credentials.json at", localCredsPath);
		return;
	}

	// 2. Fallback: Create from env vars if file is missing
	if (
		!process.env.GOOGLE_APPLICATION_CREDENTIALS &&
		process.env.GOOGLE_PRIVATE_KEY &&
		process.env.GOOGLE_CLIENT_EMAIL
	) {
		try {
			const credentials = {
				type: "service_account",
				project_id: process.env.GOOGLE_VERTEX_PROJECT,
				private_key_id: "unknown",
				private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
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
			const tempDir = fs.existsSync("/tmp")
				? "/tmp"
				: path.join(process.cwd(), ".tmp");
			if (!fs.existsSync(tempDir) && tempDir !== "/tmp") {
				fs.mkdirSync(tempDir, { recursive: true });
			}

			const tempPath = path.join(tempDir, "google-credentials.json");
			fs.writeFileSync(tempPath, JSON.stringify(credentials));
			process.env.GOOGLE_APPLICATION_CREDENTIALS = tempPath;
			console.log("Created temporary google-credentials.json at", tempPath);
		} catch (err) {
			console.error("Failed to create credential file:", err);
		}
	}
}

/**
 * Encode a StreamEvent as a Server-Sent Events (SSE) message
 */
function encodeSSE(event: StreamEvent): string {
	return `data: ${JSON.stringify(event)}\n\n`;
}

/**
 * POST /api/chat
 * Multi-agent chat endpoint using LangGraph
 */
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { messages, userId, organizationId, chatId } = body;

		// Get the last user message
		const lastMessage = messages[messages.length - 1];
		if (!lastMessage || lastMessage.role !== "user") {
			return new Response(
				JSON.stringify({ error: "No user message provided" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// Setup Google credentials
		setupGoogleCredentials();

		// Create a ReadableStream that streams events from the LangGraph agent
		const stream = new ReadableStream({
			async start(controller) {
				const encoder = new TextEncoder();

				try {
					// Stream events from the multi-agent graph
					for await (const event of streamAgent({
						message: lastMessage.content,
						userId,
						organizationId,
						chatId,
					})) {
						controller.enqueue(encoder.encode(encodeSSE(event)));
					}
				} catch (error) {
					console.error("Error in agent stream:", error);
					const errorEvent: StreamEvent = {
						type: "done",
						finalMessage: `I apologize, but I encountered an error processing your request. ${
							error instanceof Error ? error.message : "Please try again."
						}`,
					};
					controller.enqueue(encoder.encode(encodeSSE(errorEvent)));
				} finally {
					controller.close();
				}
			},
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		});
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
