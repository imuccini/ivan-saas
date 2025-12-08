"use client";

import { Button } from "@ui/components/button";
import { useState } from "react";
import { ConfigureTermsDialog } from "../../configure-terms-dialog";
import { useWizard } from "../../wizard-context";

export function TermsSection() {
	const { terms, setTerms } = useWizard();
	const [termsDialogOpen, setTermsDialogOpen] = useState(false);

	return (
		<div className="rounded-lg border bg-card p-4 space-y-3">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<div className="font-semibold">Terms and agreements</div>
					<p className="text-sm text-muted-foreground">
						Define terms and consents to collect from users joining
						the service, for all registration and identification
						methods.
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setTermsDialogOpen(true)}
					type="button"
				>
					Configure Terms
				</Button>
			</div>

			<ConfigureTermsDialog
				open={termsDialogOpen}
				onOpenChange={setTermsDialogOpen}
				initialTerms={terms}
				onSave={setTerms}
			/>
		</div>
	);
}
