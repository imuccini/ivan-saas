"use client";

import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Input } from "@ui/components/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ui/components/table";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	MoreVertical,
	Plus,
	RefreshCw,
	Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data for users
const mockUsers = [
	{
		id: 1,
		username: "dquadrini@cloud4wi.com",
		group: "Dev",
		status: "pending",
		idpSource: "C4W Entra ID",
		lastUpdate: "Oct 20 2025 15:10",
	},
	{
		id: 2,
		username: "dquadrini@cloud4wi.com",
		group: "Dev",
		status: "done",
		idpSource: "C4W Entra ID",
		lastUpdate: "Oct 20 2025 15:10",
	},
	{
		id: 3,
		username: "dquadrini@cloud4wi.com",
		group: "Dev",
		status: "done",
		idpSource: "C4W Entra ID",
		lastUpdate: "Oct 20 2025 15:10",
	},
	{
		id: 4,
		username: "dquadrini@cloud4wi.com",
		group: "Product",
		status: "pending",
		idpSource: "C4W Entra ID",
		lastUpdate: "Oct 20 2025 15:10",
	},
	{
		id: 5,
		username: "dquadrini@cloud4wi.com",
		group: "Admin",
		status: "pending",
		idpSource: "C4W Entra ID",
		lastUpdate: "Oct 20 2025 15:10",
	},
	{
		id: 6,
		username: "dquadrini@cloud4wi.com",
		group: "Admin",
		status: "done",
		idpSource: "C4W Entra ID",
		lastUpdate: "Oct 20 2025 15:10",
	},
	{
		id: 7,
		username: "dquadrini@cloud4wi.com",
		group: "Dev",
		status: "error",
		idpSource: "C4W Entra ID",
		lastUpdate: "Oct 20 2025 15:10",
	},
	{
		id: 8,
		username: "dquadrini@cloud4wi.com",
		group: "HR",
		status: "done",
		idpSource: "C4W Entra ID",
		lastUpdate: "Oct 20 2025 15:10",
	},
	{
		id: 9,
		username: "dquadrini@cloud4wi.com",
		group: "HR",
		status: "done",
		idpSource: "C4W Entra ID",
		lastUpdate: "Oct 20 2025 15:10",
	},
];

function StatusBadge({ status }: { status: string }) {
	const variants = {
		pending:
			"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
		done: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
		error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	};

	const icons = {
		pending: "⏱",
		done: "✓",
		error: "⚠",
	};

	return (
		<Badge
			variant="outline"
			className={`${variants[status as keyof typeof variants]} border-0 font-normal`}
		>
			<span className="mr-1">{icons[status as keyof typeof icons]}</span>
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</Badge>
	);
}

export default function DirectoryPage() {
	const [activeTab, setActiveTab] = useState<"users" | "groups">("users");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const totalPages = Math.ceil(mockUsers.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentUsers = mockUsers.slice(startIndex, endIndex);

	return (
		<div className="space-y-6">
			{/* Top Cards Row */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Summary Card */}
				<Card>
					<CardHeader>
						<CardTitle className="text-xl font-bold">
							Summary
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1">
								<div className="text-sm font-medium text-muted-foreground">
									Users
								</div>
								<div className="text-3xl font-bold">1,288</div>
							</div>
							<div className="flex flex-col gap-1">
								<div className="text-sm font-medium text-muted-foreground">
									Groups
								</div>
								<div className="text-3xl font-bold">5</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Identity Providers Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-xl font-bold">
							Identity Providers
						</CardTitle>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								className="h-8 gap-1 text-sm"
								asChild
							>
								<Link href="#">
									<ExternalLink className="h-3 w-3" />
									Identity Providers
								</Link>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
							>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent className="pt-6">
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1">
								<div className="text-sm font-medium text-muted-foreground">
									Synced
								</div>
								<div className="text-3xl font-bold">2</div>
							</div>
							<div className="flex flex-col gap-1">
								<div className="text-sm font-medium text-muted-foreground">
									Not Synced
								</div>
								<div className="text-3xl font-bold">0</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Users Table Card */}
			<Card>
				<CardHeader className="border-b">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setActiveTab("users")}
								className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
									activeTab === "users"
										? "bg-foreground text-background"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								Users{" "}
								<span className="ml-1 rounded-full bg-background/20 px-2 py-0.5 text-xs">
									357
								</span>
							</button>
							<button
								type="button"
								onClick={() => setActiveTab("groups")}
								className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
									activeTab === "groups"
										? "bg-foreground text-background"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								User Groups{" "}
								<span className="ml-1 rounded-full bg-background/20 px-2 py-0.5 text-xs">
									5
								</span>
							</button>
						</div>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Add User
						</Button>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					{/* Toolbar */}
					<div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search by anything"
								className="pl-9 w-full md:w-[300px]"
							/>
						</div>
						<div className="flex items-center gap-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="gap-2">
										IdP Source
										<ChevronDown className="h-4 w-4 opacity-50" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem>All</DropdownMenuItem>
									<DropdownMenuItem>
										C4W Entra ID
									</DropdownMenuItem>
									<DropdownMenuItem>
										Google Workspace
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="gap-2">
										Status
										<ChevronDown className="h-4 w-4 opacity-50" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem>All</DropdownMenuItem>
									<DropdownMenuItem>Pending</DropdownMenuItem>
									<DropdownMenuItem>Done</DropdownMenuItem>
									<DropdownMenuItem>Error</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="gap-2">
										Group
										<ChevronDown className="h-4 w-4 opacity-50" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem>All</DropdownMenuItem>
									<DropdownMenuItem>Dev</DropdownMenuItem>
									<DropdownMenuItem>Product</DropdownMenuItem>
									<DropdownMenuItem>Admin</DropdownMenuItem>
									<DropdownMenuItem>HR</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Table */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Username</TableHead>
									<TableHead>User group (s)</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>IdP source (s)</TableHead>
									<TableHead>Last update</TableHead>
									<TableHead className="w-[50px]" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentUsers.map((user) => (
									<TableRow key={user.id}>
										<TableCell className="font-medium">
											{user.username}
										</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className="font-normal"
											>
												{user.group}
											</Badge>
										</TableCell>
										<TableCell>
											<StatusBadge status={user.status} />
										</TableCell>
										<TableCell>{user.idpSource}</TableCell>
										<TableCell className="text-muted-foreground">
											{user.lastUpdate}
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem>
														View details
													</DropdownMenuItem>
													<DropdownMenuItem>
														Edit user
													</DropdownMenuItem>
													<DropdownMenuItem className="text-destructive">
														Delete user
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between pt-4">
						<div className="text-sm text-muted-foreground">
							Showing {startIndex + 1}-
							{Math.min(endIndex, mockUsers.length)} of{" "}
							{mockUsers.length}
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setCurrentPage((p) => Math.max(1, p - 1))
								}
								disabled={currentPage === 1}
							>
								<ChevronLeft className="h-4 w-4" />
								Previous
							</Button>
							<div className="flex items-center gap-1">
								{Array.from(
									{ length: totalPages },
									(_, i) => i + 1,
								).map((page) => (
									<Button
										key={page}
										variant={
											currentPage === page
												? "default"
												: "outline"
										}
										size="sm"
										className="h-8 w-8 p-0"
										onClick={() => setCurrentPage(page)}
									>
										{page}
									</Button>
								))}
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setCurrentPage((p) =>
										Math.min(totalPages, p + 1),
									)
								}
								disabled={currentPage === totalPages}
							>
								Next
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
