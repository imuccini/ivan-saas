"use client";

import {
	ARUBA_REGIONS,
	getArubaRegion,
} from "@saas/networks/lib/aruba-regions";
import { getVendor, type VendorId } from "@saas/networks/lib/vendors";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@ui/components/alert";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Switch } from "@ui/components/switch";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface IntegrationConfigFormProps {
	vendor: VendorId;
	onComplete: (integrationId: string) => void;
	editingIntegration?: {
		id: string;
		name: string;
		provider: string;
	} | null;
}

export function IntegrationConfigForm({
	vendor,
	onComplete,
	editingIntegration,
}: IntegrationConfigFormProps) {
	const { activeWorkspace } = useActiveWorkspace();
	const [name, setName] = useState(editingIntegration?.name || "");
	const [validationError, setValidationError] = useState<string | null>(null);

	// Meraki fields
	const [apiKey, setApiKey] = useState("");

	// Aruba fields
	const [regionId, setRegionId] = useState<string>("");
	const [clientId, setClientId] = useState("");
	const [clientSecret, setClientSecret] = useState("");

	// UniFi fields
	const [unifiHost, setUnifiHost] = useState("");
	const [unifiPort, setUnifiPort] = useState("8443");
	const [unifiUsername, setUnifiUsername] = useState("");
	const [unifiPassword, setUnifiPassword] = useState("");
	const [allowSelfSigned, setAllowSelfSigned] = useState(true);

	const vendorInfo = getVendor(vendor);
	const isEditMode = !!editingIntegration;
	const isAruba = vendor === "aruba";
	const isUnifi = vendor === "ubiquiti";

	// Validation mutation to test credentials
	const validateMutation = useMutation({
		mutationFn: async (credentials: {
			apiKey?: string;
			clientId?: string;
			clientSecret?: string;
			regionUrl?: string; // regionUrl is not needed for the action, but kept for type compatibility if needed, though regionId is what matters
			regionId?: string;
			controllerUrl?: string;
			username?: string;
			password?: string;
			allowSelfSigned?: boolean;
		}) => {
			// Import dynamically to avoid top-level server action import issues in some setups, strictly typing
			const { validateIntegrationCredentials } = await import(
				"../actions"
			);

			const result = await validateIntegrationCredentials(vendor, {
				apiKey: credentials.apiKey,
				clientId: credentials.clientId,
				clientSecret: credentials.clientSecret,
				regionId: regionId, // Use state regionId
				controllerUrl: credentials.controllerUrl,
				username: credentials.username,
				password: credentials.password,
				allowSelfSigned: credentials.allowSelfSigned,
			});

			if (!result.success) {
				throw new Error(result.error);
			}

			return result.data;
		},
	});

	const createMutation = useMutation(
		orpc.integrations.create.mutationOptions({
			onSuccess: (data) => {
				toast.success("Integration created successfully");
				setName("");
				setApiKey("");
				setClientId("");
				setClientSecret("");
				setRegionId("");
				setUnifiHost("");
				setUnifiPort("8443");
				setUnifiUsername("");
				setUnifiPassword("");
				setValidationError(null);
				onComplete(data.id);
			},
			onError: (error) => {
				toast.error("Failed to create integration");
				setValidationError(
					error.message || "An unexpected error occurred",
				);
			},
		}),
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!activeWorkspace?.id || !name) return;

		// Validate required fields based on vendor
		if (vendor === "aruba" && (!clientId || !clientSecret || !regionId)) {
			setValidationError("Please fill in all required fields");
			return;
		}

		if (vendor === "meraki" && !apiKey) {
			setValidationError("Please enter your API key");
			return;
		}

		if (vendor === "ubiquiti" && (!unifiHost || !unifiUsername || !unifiPassword)) {
			setValidationError("Please fill in all required fields");
			return;
		}

		setValidationError(null);

		try {
			let validationPayload: any = {};
			let credentialsPayload: any = {};

			if (vendor === "aruba") {
				validationPayload = {
					clientId,
					clientSecret,
					regionUrl: getArubaRegion(regionId)?.baseUrl,
				};
			} else if (vendor === "ubiquiti") {
				const protocol = unifiHost.startsWith("http") ? "" : "https://";
				const port = unifiPort ? `:${unifiPort}` : "";
				// Make sure we don't duplicate protocol if user added it
				const baseUrl = unifiHost.startsWith("http") ? unifiHost : `${protocol}${unifiHost}`;
				// Construct URL ensuring port is handled
				const controllerUrl = baseUrl.includes(":") && !baseUrl.includes("http") ? baseUrl : `${baseUrl}${port}`;
				
				// Cleaner Logic:
				// If host contains http/https, use as is (maybe remove trailing slash)
				// If not, assume https://HOST:PORT
				let finalUrl = unifiHost;
				if (!finalUrl.startsWith("http")) {
					finalUrl = `https://${finalUrl}`;
				}
				finalUrl = finalUrl.replace(/\/$/, "");
				// Append port if not present in host string
				if (unifiPort && !finalUrl.split("://")[1].includes(":")) {
					finalUrl = `${finalUrl}:${unifiPort}`;
				}

				validationPayload = {
					controllerUrl: finalUrl,
					username: unifiUsername,
					password: unifiPassword,
					allowSelfSigned,
				};
			} else {
				// Meraki
				validationPayload = { apiKey };
			}

			// Validate credentials first
			const validationResult = await validateMutation.mutateAsync(validationPayload);

			// Build credentials object based on vendor
			if (vendor === "aruba") {
				credentialsPayload = {
					clientId,
					clientSecret,
					accessToken: validationResult.accessToken,
					refreshToken: validationResult.refreshToken,
					expiresAt: validationResult.expiresAt,
					regionUrl: getArubaRegion(regionId)?.baseUrl,
					regionId,
				};
			} else if (vendor === "ubiquiti") {
				credentialsPayload = {
					controllerUrl: validationPayload.controllerUrl,
					username: unifiUsername,
					password: unifiPassword,
					allowSelfSigned,
				};
			} else {
				credentialsPayload = { apiKey };
			}

			// If validation passes, create the integration
			createMutation.mutate({
				workspaceId: activeWorkspace.id,
				provider: vendor,
				name,
				credentials: credentialsPayload,
			});
		} catch (error) {
			// Show validation error
			setValidationError(
				error instanceof Error
					? error.message
					: "Failed to validate credentials. Please check and try again.",
			);
		}
	};

	const isLoading = validateMutation.isPending || createMutation.isPending;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold">Configure Integration</h2>
				<p className="text-muted-foreground">
					Connect your {vendorInfo?.name} account
				</p>
			</div>

			{validationError && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{validationError}</AlertDescription>
				</Alert>
			)}

			{/* Integration Name */}
			<div className="space-y-2">
				<Label htmlFor="name">Integration Name</Label>
				<Input
					id="name"
					placeholder="e.g., HQ Meraki, Branch Office"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					disabled={isLoading}
				/>
				<p className="text-xs text-muted-foreground">
					A friendly name to identify this integration
				</p>
			</div>

			{/* Aruba-specific fields */}
			{isAruba && (
				<>
					{/* Region Selection */}
					<div className="space-y-2">
						<Label htmlFor="region">Cluster / Region</Label>
						<Select
							value={regionId}
							onValueChange={(value) => {
								setRegionId(value);
								setValidationError(null);
							}}
							disabled={isLoading}
						>
							<SelectTrigger id="region">
								<SelectValue placeholder="Select your Aruba Central region" />
							</SelectTrigger>
							<SelectContent>
								{ARUBA_REGIONS.map((region) => (
									<SelectItem
										key={region.id}
										value={region.id}
									>
										{region.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-xs text-muted-foreground">
							Select the region where your Aruba Central account
							is hosted
						</p>
					</div>

					{/* Client ID */}
					<div className="space-y-2">
						<Label htmlFor="clientId">Client ID</Label>
						<Input
							id="clientId"
							placeholder="Enter your Client ID"
							value={clientId}
							onChange={(e) => {
								setClientId(e.target.value);
								setValidationError(null);
							}}
							required
							disabled={isLoading}
						/>
						<p className="text-xs text-muted-foreground">
							Your Aruba Central OAuth2 Client ID
						</p>
					</div>

					{/* Client Secret */}
					<div className="space-y-2">
						<Label htmlFor="clientSecret">Client Secret</Label>
						<Input
							id="clientSecret"
							type="password"
							placeholder="Enter your Client Secret"
							value={clientSecret}
							onChange={(e) => {
								setClientSecret(e.target.value);
								setValidationError(null);
							}}
							required
							disabled={isLoading}
						/>
						<p className="text-xs text-muted-foreground">
							Your Aruba Central OAuth2 Client Secret
						</p>
					</div>
				</>
			)}
			
			{/* Ubiquiti UniFi specific fields */}
			{isUnifi && (
				<>
					<div className="grid grid-cols-3 gap-4">
						<div className="col-span-2 space-y-2">
							<Label htmlFor="unifiHost">Controller Host/IP</Label>
							<Input
								id="unifiHost"
								placeholder="e.g. 192.168.1.1 or unifi.example.com"
								value={unifiHost}
								onChange={(e) => {
									setUnifiHost(e.target.value);
									setValidationError(null);
								}}
								required
								disabled={isLoading}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="unifiPort">Port</Label>
							<Input
								id="unifiPort"
								placeholder="8443"
								value={unifiPort}
								onChange={(e) => {
									setUnifiPort(e.target.value);
									setValidationError(null);
								}}
								required
								disabled={isLoading}
							/>
						</div>
					</div>
					<p className="text-xs text-muted-foreground -mt-3">
						The IP address or hostname of your UniFi Controller
					</p>

					<div className="space-y-2">
						<Label htmlFor="unifiUsername">Username</Label>
						<Input
							id="unifiUsername"
							placeholder="Username"
							value={unifiUsername}
							onChange={(e) => {
								setUnifiUsername(e.target.value);
								setValidationError(null);
							}}
							required
							disabled={isLoading}
							autoComplete="off"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="unifiPassword">Password</Label>
						<Input
							id="unifiPassword"
							type="password"
							placeholder="Password"
							value={unifiPassword}
							onChange={(e) => {
								setUnifiPassword(e.target.value);
								setValidationError(null);
							}}
							required
							disabled={isLoading}
							autoComplete="new-password"
						/>
					</div>

					<div className="flex items-center space-x-2 rounded-lg border p-3">
						<div className="flex-1 space-y-0.5">
							<Label htmlFor="allowSelfSigned" className="text-base cursor-pointer">
								Allow Self-Signed Certificates
							</Label>
							<p className="text-xs text-muted-foreground">
								Enable if your controller uses a default SSL certificate
							</p>
						</div>
						<Switch
							id="allowSelfSigned"
							checked={allowSelfSigned}
							onCheckedChange={setAllowSelfSigned}
							disabled={isLoading}
						/>
					</div>
				</>
			)}

			{/* Meraki-specific fields */}
			{!isAruba && !isUnifi && (
				<div className="space-y-2">
					<Label htmlFor="apiKey">API Key</Label>
					<Input
						id="apiKey"
						type="password"
						placeholder={
							isEditMode
								? "Enter new API key (leave blank to keep current)"
								: "Enter your API key"
						}
						value={apiKey}
						onChange={(e) => {
							setApiKey(e.target.value);
							setValidationError(null);
						}}
						required={!isEditMode}
						disabled={isLoading}
					/>
					<p className="text-xs text-muted-foreground">
						Your {vendorInfo?.name} API key
					</p>
				</div>
			)}

			<div className="flex justify-end">
				<Button type="submit" disabled={isLoading}>
					{isLoading && (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					)}
					{validateMutation.isPending
						? "Testing Connection..."
						: createMutation.isPending
							? "Creating..."
							: isEditMode
								? "Update Integration"
								: "Create Integration"}
				</Button>
			</div>
		</form>
	);
}
