import { auth } from "@repo/auth";
import { createUser, createUserAccount, getUserByEmail } from "@repo/database";
import { logger } from "@repo/logs";

async function main() {
	const email = "superadmin@cloud4wi.com";
	const password = "superadmin";
	const name = "Super Admin";

	logger.info(`Creating superadmin user: ${email}`);

	const authContext = await auth.$context;
	const hashedPassword = await authContext.password.hash(password);

	// check if user exists
	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		logger.error("User with this email already exists!");
		return;
	}

	const adminUser = await createUser({
		email,
		name,
		role: "admin", // Legacy superadmin role
		emailVerified: true,
		onboardingComplete: true,
	});

	if (!adminUser) {
		logger.error("Failed to create user!");
		return;
	}

	await createUserAccount({
		userId: adminUser.id,
		providerId: "credential",
		accountId: adminUser.id,
		hashedPassword,
	});

	logger.success("Superadmin user created successfully!");
	logger.info(`Email: ${email}`);
	logger.info(`Password: ${password}`);
}

main();
