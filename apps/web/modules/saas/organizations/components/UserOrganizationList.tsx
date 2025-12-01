"use client";

import type { getOrganizationList } from "@saas/auth/lib/server";
import { OrganizationLogo } from "@saas/organizations/components/OrganizationLogo";
import { Pagination } from "@saas/shared/components/Pagination";
import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Table, TableBody, TableCell, TableRow } from "@ui/components/table";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Organization = Awaited<ReturnType<typeof getOrganizationList>>[number];

const ITEMS_PER_PAGE = 10;

export function UserOrganizationList({
	organizations,
}: {
	organizations: Organization[];
}) {
	const t = useTranslations();
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredOrganizations = organizations.filter((org) =>
		org.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const totalItems = filteredOrganizations.length;
	const paginatedOrganizations = filteredOrganizations.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	return (
		<Card className="p-6">
			<div className="mb-4 flex items-center justify-between gap-6">
				<h2 className="font-semibold text-2xl">
					{t("admin.organizations.title")}
				</h2>

				<Button asChild>
					<Link href="/new-organization">
						<PlusIcon className="mr-1.5 size-4" />
						{t("admin.organizations.create")}
					</Link>
				</Button>
			</div>
			<Input
				type="search"
				placeholder={t("admin.organizations.search")}
				value={searchTerm}
				onChange={(e) => {
					setSearchTerm(e.target.value);
					setCurrentPage(1);
				}}
				className="mb-4"
			/>

			<div className="rounded-md border">
				<Table>
					<TableBody>
						{paginatedOrganizations.length ? (
							paginatedOrganizations.map((org) => (
								<TableRow key={org.id} className="group">
									<TableCell className="py-2">
										<div className="flex items-center gap-2">
											<OrganizationLogo
												name={org.name}
												logoUrl={org.logo}
											/>
											<div className="leading-tight">
												<Link
													href={`/app/${org.slug}`}
													className="block font-bold hover:underline"
												>
													{org.name}
												</Link>
											</div>
										</div>
									</TableCell>
									<TableCell className="text-right">
										<Button
											asChild
											variant="ghost"
											size="sm"
										>
											<Link href={`/app/${org.slug}`}>
												Open
											</Link>
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={2}
									className="h-24 text-center"
								>
									<p>No results.</p>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{totalItems > ITEMS_PER_PAGE && (
				<Pagination
					className="mt-4"
					totalItems={totalItems}
					itemsPerPage={ITEMS_PER_PAGE}
					currentPage={currentPage}
					onChangeCurrentPage={setCurrentPage}
				/>
			)}
		</Card>
	);
}
