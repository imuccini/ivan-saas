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
		const { organization, workspace, instance } = body as {
			organization: string;
			workspace: string;
			instance: string;
		};

		if (!organization || !workspace || !instance) {
			return NextResponse.json(
				{ error: "Missing organization, workspace, or instance" },
				{ status: 400 },
			);
		}

		// Revalidate the specific portal path
		revalidatePath(`/${organization}/${workspace}/${instance}`);

		// Also invalidate the in-memory cache if using one
		// In production, this would be Redis
		// invalidatePortalCache(organization, workspace, instance);

		return NextResponse.json({
			revalidated: true,
			path: `/${organization}/${workspace}/${instance}`,
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
