import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

// Revalidation endpoint for cache invalidation from admin app
export async function POST(request: NextRequest) {
	// Verify the request is from our admin app
	const token = request.headers.get("x-revalidate-token");
	const expectedToken = process.env.REVALIDATE_TOKEN;

	if (!expectedToken || token !== expectedToken) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { workspace, instance } = body as {
			workspace: string;
			instance: string;
		};

		if (!workspace || !instance) {
			return NextResponse.json(
				{ error: "Missing workspace or instance" },
				{ status: 400 },
			);
		}

		// Revalidate the specific portal path
		revalidatePath(`/${workspace}/${instance}`);

		// Also invalidate the in-memory cache if using one
		// In production, this would be Redis
		// invalidatePortalCache(workspace, instance);

		return NextResponse.json({
			revalidated: true,
			path: `/${workspace}/${instance}`,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to revalidate", details: String(error) },
			{ status: 500 },
		);
	}
}

// Health check
export async function GET() {
	return NextResponse.json({
		status: "ok",
		service: "portal-revalidation",
	});
}
