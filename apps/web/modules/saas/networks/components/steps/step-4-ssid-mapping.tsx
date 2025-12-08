"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@ui/components/alert";
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
import {
	BotIcon,
	InfoIcon,
	Loader2,
	ShieldCheckIcon,
	WifiIcon,
} from "lucide-react";
import { useState } from "react";

interface Step4Props {
	integrationId: string;
	// biome-ignore lint/suspicious/noExplicitAny: Network object structure varies
	selectedNetworks: any[];
	onComplete: (ssidMapping: SSIDMapping) => void;
	onSkip: () => void;
}

export interface SSIDMapping {
	guestWifi?: { ssidNumber: number; ssidName: string };
	iot?: { ssidNumber: number; ssidName: string };
	employees?: { ssidNumber: number; ssidName: string };
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

export function Step4SsidMapping({
	integrationId,
	selectedNetworks,
	onComplete,
	onSkip,
}: Step4Props) {
	const { activeWorkspace } = useActiveWorkspace();
	const [guestWifiSsid, setGuestWifiSsid] = useState<string>("");
	const [iotSsid, setIotSsid] = useState<string>("");
	const [employeesSsid, setEmployeesSsid] = useState<string>("");

	// For simplicity, fetch SSIDs from the first selected network
	const firstNetwork = selectedNetworks[0];

	const { data: ssids, isLoading } = useQuery({
		queryKey: ["meraki-ssids", integrationId, firstNetwork?.id],
		queryFn: async () => {
			// This would be a new API endpoint to fetch SSIDs for a network
			// For now, we'll return mock data
			return [
				{ number: 0, name: "Corporate WiFi", enabled: true },
				{ number: 1, name: "Guest Network", enabled: true },
				{ number: 2, name: "IoT Network", enabled: false },
				{ number: 3, name: "Unconfigured SSID 3", enabled: false },
				{ number: 4, name: "Unconfigured SSID 4", enabled: false },
			];
		},
		enabled: !!firstNetwork && !!integrationId && !!activeWorkspace?.id,
	});

	const handleContinue = () => {
		const mapping: SSIDMapping = {};

		if (guestWifiSsid) {
			const ssid = ssids?.find(
				(s) => s.number.toString() === guestWifiSsid,
			);
			if (ssid) {
				mapping.guestWifi = {
					ssidNumber: ssid.number,
					ssidName: ssid.name,
				};
			}
		}

		if (iotSsid) {
			const ssid = ssids?.find((s) => s.number.toString() === iotSsid);
			if (ssid) {
				mapping.iot = { ssidNumber: ssid.number, ssidName: ssid.name };
			}
		}

		if (employeesSsid) {
			const ssid = ssids?.find(
				(s) => s.number.toString() === employeesSsid,
			);
			if (ssid) {
				mapping.employees = {
					ssidNumber: ssid.number,
					ssidName: ssid.name,
				};
			}
		}

		onComplete(mapping);
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
			<div>
				<h2 className="text-xl font-semibold">
					SSID Mapping (Optional)
				</h2>
				<p className="text-muted-foreground">
					Map SSIDs to use cases for your networks. You can skip this
					and configure later when deploying services.
				</p>
			</div>

			<Alert>
				<InfoIcon className="h-4 w-4" />
				<AlertDescription>
					SSIDs will be configured but not activated. Deployment
					happens in the respective service section (Guest WiFi, IoT,
					etc.).
				</AlertDescription>
			</Alert>

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
							<CardHeader>
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
													Skip for now
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

			<div className="flex justify-between pt-4">
				<Button variant="outline" onClick={onSkip}>
					Skip - Configure Later
				</Button>
				<Button onClick={handleContinue}>Continue</Button>
			</div>
		</div>
	);
}
