import { EmployeesPageContent } from "@saas/employees/components/EmployeesPageContent";

export default async function EmployeesPage({
	params,
}: {
	params: Promise<{ workspaceSlug: string }>;
}) {
	await params;
	return <EmployeesPageContent />;
}
