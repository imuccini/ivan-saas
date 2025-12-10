import { auth } from "@repo/auth";
import { db } from "@repo/database";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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

	
		// Set the password using better-auth's API to ensure correct hashing
		await auth.api.setPassword({
			headers: await headers(),
			body: {
				newPassword: password,
			},
		});

		// Explicitly mark email as verified since the user successfully set a password (proving ownership/access via OTP flow)
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
