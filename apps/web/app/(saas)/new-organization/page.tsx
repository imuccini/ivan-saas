import { config } from "@repo/config";
import { getOrganizationList, getSession } from "@saas/auth/lib/server";
import { CreateOrganizationForm } from "@saas/organizations/components/CreateOrganizationForm";
import { AuthWrapper } from "@saas/shared/components/AuthWrapper";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewOrganizationPage() {
	const organizations = await getOrganizationList();

	const session = await getSession();
	const isSuperAdmin = session?.user.role === "admin";

	if (
		!config.organizations.enable ||
		(!config.organizations.enableUsersToCreateOrganizations &&
			!isSuperAdmin &&
			(!config.organizations.requireOrganization ||
				organizations.length > 0))
	) {
		redirect("/app");
	}

	return (
		<AuthWrapper>
			<CreateOrganizationForm />
		</AuthWrapper>
	);
}
