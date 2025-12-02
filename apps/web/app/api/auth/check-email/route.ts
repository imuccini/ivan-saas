import { db } from "@repo/database";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const email = searchParams.get("email");

	if (!email) {
		return NextResponse.json(
			{ error: "Email parameter is required" },
			{ status: 400 },
		);
	}

	try {
		// Check if user exists with this email
		const existingUser = await db.user.findUnique({
			where: {
				email: email.toLowerCase(),
			},
			select: {
				id: true,
			},
		});

		return NextResponse.json({
			exists: !!existingUser,
		});
	} catch (error) {
		console.error("Error checking email:", error);
		return NextResponse.json(
			{ error: "Failed to check email" },
			{ status: 500 },
		);
	}
}
