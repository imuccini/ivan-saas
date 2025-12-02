"use client";

import { Button } from "@ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ui/components/card";
import { Checkbox } from "@ui/components/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ui/components/table";
import {
	ClockIcon,
	GripVerticalIcon,
	MoreVerticalIcon,
	NetworkIcon,
	PlusIcon,
	ShieldIcon,
	ShieldOffIcon,
	UsersIcon,
} from "lucide-react";
import { useState } from "react";

// Mock data
const MOCK_RULES = [
	{
		id: "1",
		type: "Group",
		status: "active",
		name: "Default",
		matched: "Any",
		authorization: "",
	},
	{
		id: "2",
		type: "Rule",
		status: "off",
		name: "Employees",
		matched: "IdP Group = HR",
		authorization: "Deny access",
	},
	{
		id: "3",
		type: "Rule",
		status: "active",
		name: "Contractors",
		matched: "IdP Grou = Consultant",
		authorization: "Dev",
	},
	{
		id: "4",
		type: "Rule",
		status: "active",
		name: "Suspended",
		matched: "Product",
		authorization: "Product",
	},
	{
		id: "5",
		type: "Group",
		status: "active",
		name: "Personal Devices",
		matched: "Admin",
		authorization: "Admin",
	},
	{
		id: "6",
		type: "Rule",
		status: "active",
		name: "IoT",
		matched: "Auth Method = PPSK, SSID = CorpNet",
		authorization: "VLAN = 300",
	},
	{
		id: "7",
		type: "Rule",
		status: "active",
		name: "C4W Entra ID",
		matched: "Dev",
		authorization: "Dev",
	},
	{
		id: "8",
		type: "Rule",
		status: "active",
		name: "C4W Entra ID",
		matched: "HR",
		authorization: "HR",
	},
	{
		id: "9",
		type: "Rule",
		status: "active",
		name: "C4W Entra ID",
		matched: "HR",
		authorization: "HR",
	},
	{
		id: "10",
		type: "Rule",
		status: "off",
		name: "C4W Entra ID",
		matched: "Marketing",
		authorization: "Marketing",
	},
];

export function AccessRulesPageContent() {
	const [rules, setRules] = useState(MOCK_RULES);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isEnabled, setIsEnabled] = useState(true);

	const hasRules = rules.length > 0;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Access rules</h1>
					<p className="text-muted-foreground">
						Define who can access the network and what policies
						apply
					</p>
				</div>
				{hasRules && (
					<Button onClick={() => setIsCreateDialogOpen(true)}>
						<PlusIcon className="mr-2 size-4" />
						Create Access Rule
					</Button>
				)}
			</div>

			{/* Empty State */}
			{!hasRules && (
				<>
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-16">
							<div className="flex size-16 items-center justify-center rounded-full bg-muted">
								<ShieldOffIcon className="size-8 text-muted-foreground" />
							</div>
							<h2 className="mt-6 text-xl font-semibold">
								No Access Rules configured - All devices a
								blocked
							</h2>
							<p className="mt-2 max-w-2xl text-center text-muted-foreground">
								Create your first access rule to control who can
								connect to your network and what policies apply
								to their devices
							</p>
							<Button
								className="mt-6"
								onClick={() => setIsCreateDialogOpen(true)}
							>
								Create your first rule
							</Button>
						</CardContent>
					</Card>

					{/* Info Cards */}
					<Card>
						<CardHeader>
							<CardTitle>What are Access Rules?</CardTitle>
							<CardDescription>
								Access rules determine network authorization and
								policy enforcement
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<UsersIcon className="size-5" />
										<h3 className="font-semibold">
											User Groups
										</h3>
									</div>
									<p className="text-sm text-muted-foreground">
										Specify which user groups from your
										identity provider can access the network
									</p>
								</div>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<NetworkIcon className="size-5" />
										<h3 className="font-semibold">
											Network Access
										</h3>
									</div>
									<p className="text-sm text-muted-foreground">
										Control which SSIDs and VLANs users can
										connect to based on their group
										membership
									</p>
								</div>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<ClockIcon className="size-5" />
										<h3 className="font-semibold">
											Time-based
										</h3>
									</div>
									<p className="text-sm text-muted-foreground">
										Set time windows when access rules are
										active, such as business hours only
									</p>
								</div>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<ShieldIcon className="size-5" />
										<h3 className="font-semibold">
											Policies
										</h3>
									</div>
									<p className="text-sm text-muted-foreground">
										Apply bandwidth limits, content
										filtering, and other network policies
										per rule
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Example Rules */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Example Access Rules</CardTitle>
								<CardDescription>
									Common access rule configurations you can
									create
								</CardDescription>
							</div>
							<Button variant="outline">
								<svg
									className="mr-2 size-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="10" />
									<path d="M12 16v-4" />
									<path d="M12 8h.01" />
								</svg>
								AI assisted setup
							</Button>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between rounded-lg border p-4">
								<div className="flex items-center gap-4">
									<div className="flex size-12 items-center justify-center rounded-lg bg-muted">
										<UsersIcon className="size-6" />
									</div>
									<div>
										<h3 className="font-semibold">
											Full-time Employees
										</h3>
										<p className="text-sm text-muted-foreground">
											Grant "Employees" group access to
											CorpNet_Secure with full bandwidth,
											24/7 access
										</p>
									</div>
								</div>
								<Button variant="outline">Setup</Button>
							</div>
							<div className="flex items-center justify-between rounded-lg border p-4">
								<div className="flex items-center gap-4">
									<div className="flex size-12 items-center justify-center rounded-lg bg-muted">
										<ClockIcon className="size-6" />
									</div>
									<div>
										<h3 className="font-semibold">
											Contractors
										</h3>
										<p className="text-sm text-muted-foreground">
											Grant "Contractors" group limited
											access to CorpNet_Guest during
											business hours only
										</p>
									</div>
								</div>
								<Button variant="outline">Setup</Button>
							</div>
						</CardContent>
					</Card>
				</>
			)}

			{/* Table View */}
			{hasRules && (
				<Card>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-12">
									<Checkbox />
								</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>What's matched</TableHead>
								<TableHead>Authorization</TableHead>
								<TableHead className="w-12" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{rules.map((rule) => (
								<TableRow key={rule.id}>
									<TableCell>
										<GripVerticalIcon className="size-4 text-muted-foreground" />
									</TableCell>
									<TableCell className="font-medium">
										{rule.type}
									</TableCell>
									<TableCell>
										{rule.status === "active" ? (
											<span className="inline-flex items-center gap-1.5 text-sm text-green-600">
												<span className="size-2 rounded-full bg-green-600" />
												Active
											</span>
										) : (
											<span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
												<span className="size-2 rounded-full bg-muted-foreground" />
												Off
											</span>
										)}
									</TableCell>
									<TableCell>{rule.name}</TableCell>
									<TableCell className="text-muted-foreground">
										{rule.matched}
									</TableCell>
									<TableCell className="text-muted-foreground">
										{rule.authorization}
									</TableCell>
									<TableCell>
										<Button variant="ghost" size="icon">
											<MoreVerticalIcon className="size-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<div className="flex items-center justify-between border-t px-6 py-4">
						<p className="text-sm text-muted-foreground">
							0 of {rules.length} row(s) selected.
						</p>
						<div className="flex items-center gap-6">
							<div className="flex items-center gap-2">
								<span className="text-sm">Rows per page</span>
								<Select defaultValue="10">
									<SelectTrigger className="w-16">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="10">10</SelectItem>
										<SelectItem value="20">20</SelectItem>
										<SelectItem value="50">50</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<span className="text-sm">Page 1 of 7</span>
							<div className="flex items-center gap-1">
								<Button variant="outline" size="icon" disabled>
									<svg
										className="size-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m11 17-5-5 5-5" />
										<path d="m18 17-5-5 5-5" />
									</svg>
								</Button>
								<Button variant="outline" size="icon" disabled>
									<svg
										className="size-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m15 18-6-6 6-6" />
									</svg>
								</Button>
								<Button variant="outline" size="icon">
									<svg
										className="size-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m9 18 6-6-6-6" />
									</svg>
								</Button>
								<Button variant="outline" size="icon">
									<svg
										className="size-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m13 17 5-5-5-5" />
										<path d="m6 17 5-5-5-5" />
									</svg>
								</Button>
							</div>
						</div>
					</div>
				</Card>
			)}

			{/* Example Rules Section (shown when table has rules) */}
			{hasRules && (
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Example Access Rules</CardTitle>
							<CardDescription>
								Common access rule configurations you can create
							</CardDescription>
						</div>
						<Button variant="outline">
							<svg
								className="mr-2 size-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<path d="M12 16v-4" />
								<path d="M12 8h.01" />
							</svg>
							AI assisted setup
						</Button>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="flex items-center gap-4">
								<div className="flex size-12 items-center justify-center rounded-lg bg-muted">
									<UsersIcon className="size-6" />
								</div>
								<div>
									<h3 className="font-semibold">
										Full-time Employees
									</h3>
									<p className="text-sm text-muted-foreground">
										Grant "Employees" group access to
										CorpNet_Secure with full bandwidth, 24/7
										access
									</p>
								</div>
							</div>
							<Button variant="outline">Setup</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Create/Edit Rule Dialog */}
			<Dialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
			>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Rule</DialogTitle>
					</DialogHeader>

					<div className="space-y-6">
						{/* Name */}
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" placeholder="Employees" />
						</div>

						{/* Status */}
						<div className="flex items-center justify-between">
							<Label htmlFor="status">Status</Label>
							<div className="flex items-center gap-2">
								<Switch
									id="status"
									checked={isEnabled}
									onCheckedChange={setIsEnabled}
								/>
								<span className="text-sm">Enabled</span>
							</div>
						</div>

						{/* What's matched */}
						<div className="space-y-4">
							<h3 className="font-semibold">What's matched</h3>

							{/* Attribute source */}
							<div className="space-y-2">
								<Label>Attribute source 1</Label>
								<div className="flex items-center gap-2">
									<Select defaultValue="idp">
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="idp">
												IdP - Ms Entra C4W
											</SelectItem>
										</SelectContent>
									</Select>
									<Button variant="ghost" size="icon">
										<svg
											className="size-4"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M3 6h18" />
											<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
											<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
										</svg>
									</Button>
								</div>
							</div>

							{/* Attribute fields */}
							<div className="space-y-4 rounded-lg border p-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Attribute</Label>
										<Select defaultValue="group">
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="group">
													Group Name
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label>Operator</Label>
										<Select defaultValue="match">
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="match">
													Match all
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="space-y-2">
									<Label>Value</Label>
									<Select defaultValue="employees">
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="employees">
												Employees
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button
									variant="ghost"
									size="sm"
									className="w-full"
								>
									<PlusIcon className="mr-2 size-4" />
									Add Attribute
								</Button>
							</div>

							<Button variant="ghost" size="sm">
								<PlusIcon className="mr-2 size-4" />
								Add Attribute Source
							</Button>
						</div>

						{/* Authorization */}
						<div className="space-y-4">
							<h3 className="font-semibold">Authorization</h3>

							<div className="space-y-2">
								<Label>Access permission</Label>
								<Select defaultValue="restricted">
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="restricted">
											Allow Restricted Access
										</SelectItem>
										<SelectItem value="full">
											Allow Full Access
										</SelectItem>
										<SelectItem value="deny">
											Deny Access
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-center gap-2">
								<Checkbox id="vlan" defaultChecked />
								<Label htmlFor="vlan">VLAN ID</Label>
							</div>

							<Input placeholder="Type VLAN ID" />

							<div className="space-y-2">
								<Label className="text-muted-foreground">
									Remote Policy ID / Name
								</Label>
								<Label className="text-muted-foreground">
									Virtual Policy
								</Label>
								<Label className="text-muted-foreground">
									Identity PSK
								</Label>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCreateDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={() => setIsCreateDialogOpen(false)}>
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
