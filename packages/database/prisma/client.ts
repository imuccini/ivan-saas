// Import the PrismaClient constructor from the generated client library
import { PrismaClient } from "./generated/client";

/**
 * Creates and returns a new instance of the PrismaClient.
 * This function is used to ensure that only one instance of PrismaClient is created.
 * @returns A new PrismaClient instance.
 */
const prismaClientSingleton = () => {
	return new PrismaClient();
};

// Extend the global scope to include a 'prisma' property
declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// biome-ignore lint/suspicious/noRedeclare: This is a singleton pattern, so redeclaration is expected.
// Initialize the Prisma client, reusing the global instance if it exists, otherwise create a new one.
const prisma = globalThis.prisma ?? prismaClientSingleton();

// In non-production environments, store the Prisma client instance in the global scope.
// This prevents the creation of new connections on every hot reload.
if (process.env.NODE_ENV !== "production") {
	globalThis.prisma = prisma;
}

// Export the Prisma client instance as 'db' for use throughout the application
export { prisma as db };
