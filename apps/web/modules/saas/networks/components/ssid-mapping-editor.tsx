"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Label } from "@ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { BotIcon, Loader2, ShieldCheckIcon, WifiIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { SSIDMapping } from "./steps/step-4-ssid-mapping";

interface SsidMappingEditorProps {
	integrationId: string;
	networkId: string;
	initialMapping?: SSIDMapping;
	onSave: (mapping: SSIDMapping) => void;
	onCancel: () => void;
	isSaving?: boolean;
}

const USE_CASES = [
	{
		id: "guestWifi",
		name: "Guest WiFi",
		icon: WifiIcon,
		description: "Public WiFi for guests and visitors",
		color: "blue",
	},
	{
		id: "iot",
		name: "IoT Devices",
		icon: BotIcon,
		description: "Network for IoT and smart devices",
		color: "purple",
	},
	{
		id: "employees",
		name: "Employees",
		icon: ShieldCheckIcon,
		description: "Secure network for staff",
		color: "green",
	},
];

export function SsidMappingEditor({
	integrationId,
	networkId,
	initialMapping,
	onSave,
	onCancel,
	isSaving = false,
}: SsidMappingEditorProps) {
	const { activeWorkspace } = useActiveWorkspace();

	const [guestWifiSsid, setGuestWifiSsid] = useState<string>("");
	const [iotSsid, setIotSsid] = useState<string>("");
	const [employeesSsid, setEmployeesSsid] = useState<string>("");

	// Initialize state from initialMapping
	useEffect(() => {
		if (initialMapping) {
			if (
				initialMapping.guestWifi &&
				typeof initialMapping.guestWifi === "object"
			) {
				setGuestWifiSsid(
					initialMapping.guestWifi.ssidNumber.toString(),
				);
			}
			if (initialMapping.iot && typeof initialMapping.iot === "object") {
				setIotSsid(initialMapping.iot.ssidNumber.toString());
			}
			if (
				initialMapping.employees &&
				typeof initialMapping.employees === "object"
			) {
				setEmployeesSsid(
					initialMapping.employees.ssidNumber.toString(),
				);
			}
		}
	}, [initialMapping]);

	const { data: ssids, isLoading } = useQuery({
		...orpc.meraki.getNetworkSSIDs.queryOptions({
			input: {
				integrationId,
				networkId,
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled: !!networkId && !!integrationId && !!activeWorkspace?.id,
	});

	const handleSave = () => {
		const mapping: SSIDMapping = {};

		if (guestWifiSsid && guestWifiSsid !== "none") {
			const ssid = ssids?.find(
				(s) => s.number.toString() === guestWifiSsid,
			);
			if (ssid) {
				mapping.guestWifi = {
					ssidNumber: ssid.number,
					ssidName: ssid.name,
					enabled: ssid.enabled,
				};
			}
		}

		if (iotSsid && iotSsid !== "none") {
			const ssid = ssids?.find((s) => s.number.toString() === iotSsid);
			if (ssid) {
				mapping.iot = {
					ssidNumber: ssid.number,
					ssidName: ssid.name,
					enabled: ssid.enabled,
				};
			}
		}

		if (employeesSsid && employeesSsid !== "none") {
			const ssid = ssids?.find(
				(s) => s.number.toString() === employeesSsid,
			);
			if (ssid) {
				mapping.employees = {
					ssidNumber: ssid.number,
					ssidName: ssid.name,
					enabled: ssid.enabled,
				};
			}
		}

		onSave(mapping);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				{USE_CASES.map((useCase) => {
					const Icon = useCase.icon;
					const value =
						useCase.id === "guestWifi"
							? guestWifiSsid
							: useCase.id === "iot"
								? iotSsid
								: employeesSsid;
					const setValue =
						useCase.id === "guestWifi"
							? setGuestWifiSsid
							: useCase.id === "iot"
								? setIotSsid
								: setEmployeesSsid;

					return (
						<Card key={useCase.id}>
							<CardHeader className="pb-3">
								<div className="flex items-center gap-3">
									<div
										className={`h-10 w-10 rounded-lg bg-${useCase.color}-100 dark:bg-${useCase.color}-900/20 flex items-center justify-center`}
									>
										<Icon
											className={`h-5 w-5 text-${useCase.color}-600 dark:text-${useCase.color}-400`}
										/>
									</div>
									<div>
										<CardTitle className="text-base">
											{useCase.name}
										</CardTitle>
										<p className="text-sm text-muted-foreground">
											{useCase.description}
										</p>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<Label htmlFor={`ssid-${useCase.id}`}>
										Select SSID
									</Label>
									<Select
										value={value}
										onValueChange={setValue}
									>
										<SelectTrigger
											id={`ssid-${useCase.id}`}
										>
											<SelectValue placeholder="Choose an SSID or skip" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="none">
												<span className="text-muted-foreground">
													Not configured
												</span>
											</SelectItem>
											{ssids?.map((ssid) => (
												<SelectItem
													key={ssid.number}
													value={ssid.number.toString()}
												>
													<div className="flex items-center justify-between w-full gap-2">
														<span>
															SSID {ssid.number}:{" "}
															{ssid.name}
														</span>
														<Badge
															variant={
																ssid.enabled
																	? "default"
																	: "secondary"
															}
															className="ml-2"
														>
															{ssid.enabled
																? "Active"
																: "Inactive"}
														</Badge>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="flex justify-end gap-2 pt-4">
				<Button
					variant="outline"
					onClick={onCancel}
					disabled={isSaving}
				>
					Cancel
				</Button>
				<Button onClick={handleSave} disabled={isSaving}>
					{isSaving && (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					)}
					Save Changes
				</Button>
			</div>
		</div>
	);
}
