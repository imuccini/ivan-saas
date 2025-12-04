"use client";

import { AuthWrapper } from "@saas/shared/components/AuthWrapper";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

export function AuthWrapperWithStep({ children }: PropsWithChildren) {
	const pathname = usePathname();

	let currentStep: number | undefined;
	if (pathname.includes("/signup")) {
		currentStep = 1;
	} else if (pathname.includes("/verify")) {
		currentStep = 2;
	} else if (pathname.includes("/set-password")) {
		currentStep = 3;
	}

	return <AuthWrapper currentStep={currentStep}>{children}</AuthWrapper>;
}
