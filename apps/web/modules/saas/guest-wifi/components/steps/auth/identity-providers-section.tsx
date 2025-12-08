"use client";

import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Label } from "@ui/components/label";
import { Switch } from "@ui/components/switch";
import { ChevronDown } from "lucide-react";
import { useWizard } from "../../wizard-context";

export function IdentityProvidersSection() {
	const {
		enterpriseIdpEnabled,
		setEnterpriseIdpEnabled,
		selectedIdps,
		setSelectedIdps,
	} = useWizard();

	const idpOptions = [
		{ id: "azure", label: "Entra ID", category: "enterprise" },
		{ id: "google", label: "Google Workspace", category: "enterprise" },
		{ id: "opera", label: "Opera Cloud", category: "pms" },
		{ id: "mews", label: "Mews", category: "pms" },
		{ id: "apaleo", label: "Apaleo", category: "pms" },
	];

	return (
		<div className="rounded-lg border bg-card p-4 space-y-4">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<div className="font-semibold">
						Third-Party Authentication
					</div>
					<p className="text-sm text-muted-foreground">
						Allow users to authenticate via external systems
					</p>
				</div>
				<Switch
					checked={enterpriseIdpEnabled}
					onCheckedChange={setEnterpriseIdpEnabled}
				/>
			</div>

			{enterpriseIdpEnabled && (
				<div className="space-y-2 pt-2">
					<Label className="text-sm">Select Identity Sources</Label>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="w-full justify-between h-auto min-h-10 py-2 px-3"
							>
								<div className="flex flex-wrap gap-1 text-left">
									{selectedIdps.length > 0 ? (
										selectedIdps.map((id) => {
											const option = idpOptions.find(
												(o) => o.id === id,
											);
											return (
												<Badge
													key={id}
													variant="secondary"
													className="mr-1 mb-1"
												>
													{option?.label || id}
												</Badge>
											);
										})
									) : (
										<span className="text-muted-foreground font-normal">
											Select Identity Sources...
										</span>
									)}
								</div>
								<ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]">
							<DropdownMenuLabel>Enterprise</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{idpOptions
								.filter(
									(option) =>
										option.category === "enterprise",
								)
								.map((option) => (
									<DropdownMenuCheckboxItem
										key={option.id}
										checked={selectedIdps.includes(
											option.id,
										)}
										onCheckedChange={(checked) => {
											if (checked) {
												setSelectedIdps([
													...selectedIdps,
													option.id,
												]);
											} else {
												setSelectedIdps(
													selectedIdps.filter(
														(id) =>
															id !== option.id,
													),
												);
											}
										}}
									>
										{option.label}
									</DropdownMenuCheckboxItem>
								))}
							<DropdownMenuLabel className="mt-2">
								PMS
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{idpOptions
								.filter((option) => option.category === "pms")
								.map((option) => (
									<DropdownMenuCheckboxItem
										key={option.id}
										checked={selectedIdps.includes(
											option.id,
										)}
										onCheckedChange={(checked) => {
											if (checked) {
												setSelectedIdps([
													...selectedIdps,
													option.id,
												]);
											} else {
												setSelectedIdps(
													selectedIdps.filter(
														(id) =>
															id !== option.id,
													),
												);
											}
										}}
									>
										{option.label}
									</DropdownMenuCheckboxItem>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)}
		</div>
	);
}
