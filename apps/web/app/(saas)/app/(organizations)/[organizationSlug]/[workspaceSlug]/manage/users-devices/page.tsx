import { UsersDevicesPageContent } from "@saas/users-devices/components/UsersDevicesPageContent";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: "Users & Devices",
	};
}

export default function UsersDevicesPage() {
	return <UsersDevicesPageContent />;
}
