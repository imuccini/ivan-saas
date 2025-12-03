import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding RBAC...");

	// 1. Define Permissions
	const permissions = [
		// Workspace
		{ slug: "workspace.read", description: "View workspace details" },
		{ slug: "workspace.create", description: "Create new workspaces" },
		{ slug: "workspace.update", description: "Update workspace settings" },
		{ slug: "workspace.delete", description: "Delete workspaces" },

		// Organization
		{ slug: "organization.read", description: "View organization details" },
		{
			slug: "organization.update",
			description: "Update organization settings",
		},
		{ slug: "organization.delete", description: "Delete organization" },
		{
			slug: "organization.invite",
			description: "Invite members to organization",
		},

		// Billing
		{ slug: "billing.read", description: "View billing information" },
		{
			slug: "billing.update",
			description: "Manage billing and subscriptions",
		},
	];

	console.log("Upserting permissions...");
	for (const perm of permissions) {
		await prisma.permission.upsert({
			where: { slug: perm.slug },
			update: { description: perm.description },
			create: perm,
		});
	}

	// 2. Define Roles
	const roles = [
		{
			name: "Owner",
			description: "Organization Owner with full access",
			permissions: permissions.map((p) => p.slug),
		},
		{
			name: "Admin",
			description: "Administrator with management access",
			permissions: [
				"workspace.read",
				"workspace.create",
				"workspace.update",
				"workspace.delete",
				"organization.read",
				"organization.update",
				"organization.invite",
				"billing.read",
				"billing.update",
			],
		},
		{
			name: "Member",
			description: "Regular member with read access",
			permissions: ["workspace.read", "organization.read"],
		},
	];

	console.log("Upserting roles...");
	for (const role of roles) {
		// Create or update role
		const existingRole = await prisma.role.findFirst({
			where: {
				name: role.name,
				organizationId: null,
			},
		});

		let roleRecord;
		if (existingRole) {
			roleRecord = await prisma.role.update({
				where: { id: existingRole.id },
				data: { description: role.description },
			});
		} else {
			roleRecord = await prisma.role.create({
				data: {
					name: role.name,
					description: role.description,
					organizationId: null,
				},
			});
		}

		// Assign permissions
		const permissionRecords = await prisma.permission.findMany({
			where: { slug: { in: role.permissions } },
		});

		// Clear existing permissions for this role (simple way to sync)
		await prisma.rolePermission.deleteMany({
			where: { roleId: roleRecord.id },
		});

		// Add new permissions
		await prisma.rolePermission.createMany({
			data: permissionRecords.map((p) => ({
				roleId: roleRecord.id,
				permissionId: p.id,
			})),
		});
	}

	console.log("RBAC Seeding completed.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
