import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Verifying RBAC Data...");

	const permissions = await prisma.permission.findMany();
	console.log(`Found ${permissions.length} permissions.`);
	permissions.forEach(p => console.log(`- ${p.slug}`));

	const roles = await prisma.role.findMany({
		include: { permissions: { include: { permission: true } } }
	});
	console.log(`\nFound ${roles.length} roles.`);
	roles.forEach(r => {
		console.log(`- Role: ${r.name} (System: ${r.organizationId === null})`);
		console.log(`  Permissions: ${r.permissions.map(rp => rp.permission.slug).join(", ")}`);
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
