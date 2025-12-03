// Import the Prisma client instance
import { db } from "../client";

/**
 * Retrieves a paginated list of AI chats for a specific user.
 * @param limit - The maximum number of chats to return.
 * @param offset - The number of chats to skip from the beginning of the list.
 * @param userId - The ID of the user whose chats are to be retrieved.
 * @returns A promise that resolves to an array of AI chats.
 */
export async function getAiChatsByUserId({
	limit,
	offset,
	userId,
}: {
	limit: number;
	offset: number;
	userId: string;
}) {
	return await db.aiChat.findMany({
		where: {
			userId,
		},
		take: limit,
		skip: offset,
	});
}

/**
 * Retrieves a paginated list of AI chats for a specific organization.
 * @param limit - The maximum number of chats to return.
 * @param offset - The number of chats to skip from the beginning of the list.
 * @param organizationId - The ID of the organization whose chats are to be retrieved.
 * @returns A promise that resolves to an array of AI chats.
 */
export async function getAiChatsByOrganizationId({
	limit,
	offset,
	organizationId,
}: {
	limit: number;
	offset: number;
	organizationId: string;
}) {
	return await db.aiChat.findMany({
		where: {
			organizationId,
		},
		take: limit,
		skip: offset,
	});
}

/**
 * Retrieves a single AI chat by its unique ID.
 * @param id - The ID of the chat to retrieve.
 * @returns A promise that resolves to the AI chat object or null if not found.
 */
export async function getAiChatById(id: string) {
	return await db.aiChat.findUnique({
		where: {
			id,
		},
	});
}

/**
 * Creates a new AI chat.
 * @param organizationId - The ID of the organization this chat belongs to (optional).
 * @param userId - The ID of the user who created the chat.
 * @param title - The title of the chat (optional).
 * @returns A promise that resolves to the newly created AI chat object.
 */
export async function createAiChat({
	organizationId,
	userId,
	title,
}: {
	organizationId?: string;
	userId: string;
	title?: string;
}) {
	return await db.aiChat.create({
		data: {
			organizationId,
			userId,
			title,
		},
	});
}

/**
 * Updates an existing AI chat.
 * @param id - The ID of the chat to update.
 * @param title - The new title for the chat (optional).
 * @param messages - The new array of messages for the chat (optional).
 * @returns A promise that resolves to the updated AI chat object.
 */
export async function updateAiChat({
	id,
	title,
	messages,
}: {
	id: string;
	title?: string;
	messages?: Array<object>;
}) {
	return await db.aiChat.update({
		where: {
			id,
		},
		data: {
			title,
			messages,
		},
	});
}

/**
 * Deletes an AI chat by its unique ID.
 * @param id - The ID of the chat to delete.
 * @returns A promise that resolves when the chat has been deleted.
 */
export async function deleteAiChat(id: string) {
	return await db.aiChat.delete({
		where: {
			id,
		},
	});
}
