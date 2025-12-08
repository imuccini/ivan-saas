"use client";

import { Switch } from "@ui/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { useWizard } from "../wizard-context";
import { AccessControlSection } from "./auth/access-control-section";
import { GuestRegistrationSection } from "./auth/guest-registration-section";
import { IdentityProvidersSection } from "./auth/identity-providers-section";
import { TermsSection } from "./auth/terms-section";

export function StepAuthentication() {
	const { accessCodesEnabled, setAccessCodesEnabled } = useWizard();

	return (
		<div className="h-full p-6">
			<Tabs defaultValue="signup" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="signup">Sign Up / Sign In</TabsTrigger>
					<TabsTrigger value="access">Access Control</TabsTrigger>
				</TabsList>

				{/* Sign Up / Sign In Tab */}
				<TabsContent value="signup" className="space-y-4 mt-6">
					<GuestRegistrationSection />
					<IdentityProvidersSection />
					<TermsSection />

					{/* 4. Access Codes Card */}
					<div className="rounded-lg border bg-card p-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<div className="font-semibold">
									Access Codes
								</div>
								<p className="text-sm text-muted-foreground">
									Allow users to enter access codes
								</p>
							</div>
							<Switch
								checked={accessCodesEnabled}
								onCheckedChange={setAccessCodesEnabled}
							/>
						</div>
					</div>
				</TabsContent>

				{/* Access Control Tab */}
				<TabsContent value="access">
					<AccessControlSection />
				</TabsContent>
			</Tabs>
		</div>
	);
}
