import { getSession } from "@saas/auth/lib/server";
import { SetPasswordForm } from "@saas/auth/components/SetPasswordForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
	return {
		title: "Set Password",
	};
}

export default async function SetPasswordPage() {
	const session = await getSession();

	// User must be authenticated to set password
	if (!session) {
		redirect("/auth/login");
	}

	return <SetPasswordForm />;
}
