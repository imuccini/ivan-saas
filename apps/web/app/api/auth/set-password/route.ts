import { auth } from "@repo/auth";
import { db } from "@repo/database";
import { randomBytes, scrypt } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16).toString("hex");
	const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
	return `${salt}:${derivedKey.toString("hex")}`;
}

export async function POST(request: Request) {
	try {
		// Get the current session
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized - No active session" },
				{ status: 401 },
			);
		}

		const body = await request.json();
		const { password } = body;

		if (!password || typeof password !== "string") {
			return NextResponse.json(
				{ error: "Password is required" },
				{ status: 400 },
			);
		}

		// Validate password requirements
		if (password.length < 8) {
			return NextResponse.json(
				{ error: "Password must be at least 8 characters" },
				{ status: 400 },
			);
		}

		if (!/[A-Z]/.test(password)) {
			return NextResponse.json(
				{ error: "Password must include an uppercase letter" },
				{ status: 400 },
			);
		}

		if (!/[0-9]/.test(password)) {
			return NextResponse.json(
				{ error: "Password must include a number" },
				{ status: 400 },
			);
		}

		// Get the full user record from the database to ensure we have the email
		const user = await db.user.findUnique({
			where: { id: session.user.id },
		});

		if (!user || !user.email) {
			return NextResponse.json(
				{ error: "User email not found" },
				{ status: 400 },
			);
		}

		// Hash the password using scrypt (same as better-auth)
		const hashedPassword = await hashPassword(password);

		// Find or create the credential account for this user
		const existingAccount = await db.account.findFirst({
			where: {
				userId: session.user.id,
				providerId: "credential",
			},
		});

		if (existingAccount) {
			// Update existing account
			await db.account.update({
				where: { id: existingAccount.id },
				data: { password: hashedPassword },
			});
		} else {
			// Create new credential account
			await db.account.create({
				data: {
					userId: session.user.id,
					accountId: user.email, // Use email as accountId for credential provider
					providerId: "credential",
					password: hashedPassword,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			});
		}

		// Mark email as verified
		await db.user.update({
			where: { id: session.user.id },
			data: { emailVerified: true },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error setting password:", error);
		return NextResponse.json(
			{ error: "Failed to set password" },
			{ status: 500 },
		);
	}
}
