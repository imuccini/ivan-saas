// Import the procedure for creating avatar upload URLs
import { createAvatarUploadUrl } from "./procedures/create-avatar-upload-url";

// Define the router for user-related endpoints
export const usersRouter = {
	// Assign the createAvatarUploadUrl procedure to the 'avatarUploadUrl' endpoint
	avatarUploadUrl: createAvatarUploadUrl,
};
