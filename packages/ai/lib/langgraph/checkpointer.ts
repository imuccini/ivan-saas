import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

let checkpointerInstance: PostgresSaver | null = null;

/**
 * Get or create the Postgres checkpointer instance
 * Uses connection pooling for serverless compatibility
 */
export async function getCheckpointer(): Promise<PostgresSaver> {
	if (checkpointerInstance) {
		return checkpointerInstance;
	}

	const connectionString = process.env.DATABASE_URL;

	if (!connectionString) {
		throw new Error("DATABASE_URL environment variable is not set");
	}

	// Create the PostgresSaver with connection pooling settings
	checkpointerInstance = PostgresSaver.fromConnString(connectionString);

	// Initialize the checkpointer tables if they don't exist
	await checkpointerInstance.setup();

	return checkpointerInstance;
}

/**
 * Generate a thread ID for a conversation
 * This ensures conversation state persists across page reloads
 */
export function generateThreadId(
	userId?: string,
	organizationId?: string,
	chatId?: string,
): string {
	if (chatId) {
		return `chat_${chatId}`;
	}
	if (organizationId && userId) {
		return `org_${organizationId}_user_${userId}`;
	}
	if (userId) {
		return `user_${userId}`;
	}
	return `anonymous_${Date.now()}`;
}
