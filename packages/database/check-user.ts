// Import the Prisma client instance
import { db } from './prisma/client';

/**
 * This script checks for the existence of a specific user by email and deletes them if found.
 * It is intended for development and testing purposes to ensure a clean state for user sign-up.
 */
async function main() {
  const userEmail = 'muccini.ivan@gmail.com';

  // Attempt to find a user with the specified email
  const user = await db.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  // If the user is found, log their details and proceed with deletion
  if (user) {
    console.log('User found:', user);
    // Delete the user to allow for a fresh sign-up
    await db.user.delete({
        where: {
            email: userEmail,
        }
    });
    console.log('User deleted.');
  } else {
    // If the user is not found, log a message indicating so
    console.log('User not found.');
  }
}

// Execute the main function and handle potential errors
main()
  .catch((e) => {
    // Log any errors that occur during execution
    console.error(e);
    // Exit the process with an error code
    process.exit(1);
  })
  .finally(async () => {
    // Ensure the database connection is closed when the script finishes
    await db.$disconnect();
  });
