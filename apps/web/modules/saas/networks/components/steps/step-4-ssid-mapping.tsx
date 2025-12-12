"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@ui/components/alert";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Label } from "@ui/components/label";
import { RadioGroup, RadioGroupItem } from "@ui/components/radio-group";
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
	vendor: string;
	// biome-ignore lint/suspicious/noExplicitAny: Network object structure varies
	selectedNetworks: any[];
	onComplete: (ssidMapping: SSIDMapping) => void;
	onSkip: () => void;
}

export interface SSIDMapping {
	guestWifi?:
		| { ssidNumber: number; ssidName: string; enabled?: boolean }
		| "auto"
		| "skip";
	iot?:
		| { ssidNumber: number; ssidName: string; enabled?: boolean }
		| "auto"
		| "skip";
	employees?:
		| { ssidNumber: number; ssidName: string; enabled?: boolean }
		| "auto"
		| "skip";
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
	vendor,
	onComplete,
	onSkip,
}: Step4Props) {
	const { activeWorkspace } = useActiveWorkspace();
	const isSingleNetwork = selectedNetworks.length === 1;

	// For single network: specific SSID selection
	const [guestWifiSsid, setGuestWifiSsid] = useState<string>("");
	const [iotSsid, setIotSsid] = useState<string>("");
	const [employeesSsid, setEmployeesSsid] = useState<string>("");

	// For multiple networks: auto/skip options
	const [guestWifiMode, setGuestWifiMode] = useState<"auto" | "skip">("skip");
	const [iotMode, setIotMode] = useState<"auto" | "skip">("skip");
	const [employeesMode, setEmployeesMode] = useState<"auto" | "skip">("skip");

	// For simplicity, fetch SSIDs from the first selected network
	const firstNetwork = selectedNetworks[0];

	const isMeraki = vendor === "meraki";
	const isUbiquiti = vendor === "ubiquiti";

	const { data: merakiSsids, isLoading: isLoadingMeraki } = useQuery({
		...orpc.meraki.getNetworkSSIDs.queryOptions({
			input: {
				integrationId,
				networkId: firstNetwork?.id || "",
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled:
			!!firstNetwork &&
			!!integrationId &&
			!!activeWorkspace?.id &&
			isSingleNetwork &&
			isMeraki,
	});

	const { data: ubiquitiWlans, isLoading: isLoadingUbiquiti } = useQuery({
		...orpc.ubiquiti.getWLANs.queryOptions({
			input: {
				integrationId,
				siteName: firstNetwork?.id || "", // id maps to name/code
				workspaceId: activeWorkspace?.id || "",
			},
		}),
		enabled:
			!!firstNetwork &&
			!!integrationId &&
			!!activeWorkspace?.id &&
			isSingleNetwork &&
			isUbiquiti,
	});

	const ssids = isUbiquiti ? ubiquitiWlans : merakiSsids;
	const isLoading = isUbiquiti ? isLoadingUbiquiti : isLoadingMeraki;

	const handleContinue = () => {
		const mapping: SSIDMapping = {};

		if (isSingleNetwork) {
			// Single network: use specific SSID selections
			if (guestWifiSsid && guestWifiSsid !== "none") {
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

			if (iotSsid && iotSsid !== "none") {
				const ssid = ssids?.find(
					(s) => s.number.toString() === iotSsid,
				);
				if (ssid) {
					mapping.iot = {
						ssidNumber: ssid.number,
						ssidName: ssid.name,
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
					};
				}
			}
		} else {
			// Multiple networks: use auto/skip modes
			mapping.guestWifi = guestWifiMode;
			mapping.iot = iotMode;
			mapping.employees = employeesMode;
		}

		onComplete(mapping);
	};

	if (isLoading && isSingleNetwork) {
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
					{isSingleNetwork
						? "Map SSIDs to use cases for your network. You can skip this and configure later when deploying services."
						: `Map SSIDs to use cases for your ${selectedNetworks.length} networks. You can automatically setup the first unused SSID or skip for each use case.`}
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

					if (isSingleNetwork) {
						// Single network: show dropdown selector
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
																SSID{" "}
																{ssid.number}:{" "}
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
					}

					// Multiple networks: show auto/skip radio options
					const mode =
						useCase.id === "guestWifi"
							? guestWifiMode
							: useCase.id === "iot"
								? iotMode
								: employeesMode;
					const setMode =
						useCase.id === "guestWifi"
							? setGuestWifiMode
							: useCase.id === "iot"
								? setIotMode
								: setEmployeesMode;

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
								<RadioGroup
									value={mode}
									onValueChange={(value) =>
										setMode(value as "auto" | "skip")
									}
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="auto"
											id={`${useCase.id}-auto`}
										/>
										<Label
											htmlFor={`${useCase.id}-auto`}
											className="font-normal cursor-pointer"
										>
											Automatically setup first unused
											SSID
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="skip"
											id={`${useCase.id}-skip`}
										/>
										<Label
											htmlFor={`${useCase.id}-skip`}
											className="font-normal cursor-pointer"
										>
											Skip - Configure later
										</Label>
									</div>
								</RadioGroup>
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
