"use client";

import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
import { Input } from "@ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import {
	CheckCircle2Icon,
	GripVerticalIcon,
	LoaderIcon,
	MoreVerticalIcon,
	PlusIcon,
	SearchIcon,
} from "lucide-react";
import { useState } from "react";

// Mock data for users
const MOCK_USERS = [
	{
		id: "1",
		header: "Cover Page",
		sectionType: "Cover Page",
		status: "in-process",
		target: 23,
		limit: 32,
		reviewer: "Jamik Tashpula...",
	},
	{
		id: "2",
		header: "Table of conten...",
		sectionType: "Table of Contents",
		status: "done",
		target: 45,
		limit: 8,
		reviewer: "Jamik Tashpula...",
	},
	{
		id: "3",
		header: "Executive sum...",
		sectionType: "Technical Content",
		status: "done",
		target: 45,
		limit: 45,
		reviewer: "Jamik Tashpula...",
	},
	{
		id: "4",
		header: "Technical appro...",
		sectionType: "Cover Page",
		status: "in-process",
		target: 45,
		limit: 45,
		reviewer: "Eddie Lake",
	},
	{
		id: "5",
		header: "Design",
		sectionType: "Cover Page",
		status: "in-process",
		target: 23,
		limit: 23,
		reviewer: "Eddie Lake",
	},
	{
		id: "6",
		header: "Capabilities",
		sectionType: "Narrative",
		status: "done",
		target: 23,
		limit: 23,
		reviewer: "Eddie Lake",
	},
	{
		id: "7",
		header: "Integration with...",
		sectionType: "Technical Content",
		status: "in-process",
		target: 23,
		limit: 23,
		reviewer: "Eddie Lake",
	},
	{
		id: "8",
		header: "Innovation and...",
		sectionType: "Table of Contents",
		status: "done",
		target: 8,
		limit: 45,
		reviewer: "Assign reviewer",
	},
	{
		id: "9",
		header: "Overview of EM...",
		sectionType: "Narrative",
		status: "done",
		target: 23,
		limit: 23,
		reviewer: "Assign reviewer",
	},
	{
		id: "10",
		header: "Advanced Algor...",
		sectionType: "Table of Contents",
		status: "in-process",
		target: 89,
		limit: 23,
		reviewer: "Assign reviewer",
	},
];

export function UsersDevicesPageContent() {
	const [selectedTab, setSelectedTab] = useState("users");
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const totalUsers = 387;
	const totalDevices = 6000;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold">Users</h1>
			</div>

			{/* Tabs */}
			<Tabs value={selectedTab} onValueChange={setSelectedTab}>
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="users" className="relative">
						Users
						<Badge className="ml-2 bg-foreground text-background">
							{totalUsers}
						</Badge>
					</TabsTrigger>
					<TabsTrigger value="devices" className="relative">
						Devices
						<Badge className="ml-2 bg-foreground text-background">
							{totalDevices}
						</Badge>
					</TabsTrigger>
				</TabsList>

				{/* Users Tab */}
				<TabsContent value="users" className="space-y-4">
					{/* Filters and Actions */}
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="relative flex-1 max-w-sm">
							<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search by anything"
								className="pl-9"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Select defaultValue="all-sources">
								<SelectTrigger className="w-[140px]">
									<SelectValue placeholder="IdP Source" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all-sources">
										IdP Source
									</SelectItem>
									<SelectItem value="azure">
										Azure AD
									</SelectItem>
									<SelectItem value="okta">Okta</SelectItem>
								</SelectContent>
							</Select>
							<Select defaultValue="all-status">
								<SelectTrigger className="w-[120px]">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all-status">
										Status
									</SelectItem>
									<SelectItem value="active">
										Active
									</SelectItem>
									<SelectItem value="inactive">
										Inactive
									</SelectItem>
								</SelectContent>
							</Select>
							<Select defaultValue="all-groups">
								<SelectTrigger className="w-[120px]">
									<SelectValue placeholder="Group" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all-groups">
										Group
									</SelectItem>
									<SelectItem value="employees">
										Employees
									</SelectItem>
									<SelectItem value="contractors">
										Contractors
									</SelectItem>
								</SelectContent>
							</Select>
							<Button>
								<PlusIcon className="mr-2 size-4" />
								Add User
							</Button>
						</div>
					</div>

					{/* Table */}
					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-12">
										<Checkbox />
									</TableHead>
									<TableHead className="w-12" />
									<TableHead>Header</TableHead>
									<TableHead>Section Type</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Target</TableHead>
									<TableHead>Limit</TableHead>
									<TableHead>Reviewer</TableHead>
									<TableHead className="w-12" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{MOCK_USERS.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<Checkbox
												checked={selectedRows.includes(
													user.id,
												)}
												onCheckedChange={(checked) => {
													if (checked) {
														setSelectedRows([
															...selectedRows,
															user.id,
														]);
													} else {
														setSelectedRows(
															selectedRows.filter(
																(id) =>
																	id !==
																	user.id,
															),
														);
													}
												}}
											/>
										</TableCell>
										<TableCell>
											<GripVerticalIcon className="size-4 text-muted-foreground" />
										</TableCell>
										<TableCell className="font-medium">
											{user.header}
										</TableCell>
										<TableCell>
											{user.sectionType}
										</TableCell>
										<TableCell>
											{user.status === "done" ? (
												<span className="inline-flex items-center gap-1.5 text-sm text-green-600">
													<CheckCircle2Icon className="size-4" />
													Done
												</span>
											) : (
												<span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
													<LoaderIcon className="size-4" />
													In Process
												</span>
											)}
										</TableCell>
										<TableCell>{user.target}</TableCell>
										<TableCell>{user.limit}</TableCell>
										<TableCell className="text-muted-foreground">
											{user.reviewer}
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

						{/* Pagination */}
						<div className="flex items-center justify-between border-t px-6 py-4">
							<p className="text-sm text-muted-foreground">
								{selectedRows.length} of {MOCK_USERS.length}{" "}
								row(s) selected.
							</p>
							<div className="flex items-center gap-6">
								<div className="flex items-center gap-2">
									<span className="text-sm">
										Rows per page
									</span>
									<Select defaultValue="10">
										<SelectTrigger className="w-16">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="10">
												10
											</SelectItem>
											<SelectItem value="20">
												20
											</SelectItem>
											<SelectItem value="50">
												50
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<span className="text-sm">Page 1 of 7</span>
								<div className="flex items-center gap-1">
									<Button
										variant="outline"
										size="icon"
										disabled
									>
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
									<Button
										variant="outline"
										size="icon"
										disabled
									>
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
					</div>
				</TabsContent>

				{/* Devices Tab */}
				<TabsContent value="devices" className="space-y-4">
					<div className="flex items-center justify-center rounded-lg border p-12">
						<p className="text-muted-foreground">
							Devices view coming soon...
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
