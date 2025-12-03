// Import configuration settings for the application
import { config } from "@repo/config";
// Import function to create a signed URL for file uploads
import { getSignedUploadUrl } from "@repo/storage";
// Import a protected procedure that requires user authentication
import { protectedProcedure } from "../../../orpc/procedures";

// Define a procedure to create a signed URL for uploading a user avatar
export const createAvatarUploadUrl = protectedProcedure
	// Define the route metadata for this procedure
	.route({
		method: "POST", // HTTP method for the endpoint
		path: "/users/avatar-upload-url", // URL path for the endpoint
		tags: ["Users"], // Tags for API documentation
		summary: "Create avatar upload URL", // A brief summary of the endpoint
		description:
			"Create a signed upload URL to upload an avatar image to the storage bucket", // A detailed description of the endpoint
	})
	// Define the handler function that executes when the endpoint is called
	.handler(async ({ context: { user } }) => {
		// Generate a signed upload URL for the user's avatar
		const signedUploadUrl = await getSignedUploadUrl(`${user.id}.png`, {
			bucket: config.storage.bucketNames.avatars, // Specify the storage bucket for avatars
		});

		// Return the signed upload URL to the client
		return { signedUploadUrl };
	});
