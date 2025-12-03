import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface SupportedVariable {
	key: string;
	description: string;
	example: string;
}

interface CategoryData {
	name: string;
	slug: string;
	description: string;
	triggers: {
		eventKey: string;
		name: string;
		description: string;
		supportedVariables: SupportedVariable[];
		templates: {
			type: "EMAIL" | "SMS";
			subject?: string;
			bodyContent: string;
			isActive: boolean;
		}[];
	}[];
}

const communicationData: CategoryData[] = [
	{
		name: "Guest WiFi",
		slug: "guest-wifi",
		description: "Notifications related to guest WiFi access",
		triggers: [
			{
				eventKey: "GUEST_SIGNUP",
				name: "Guest Sign Up",
				description: "Triggered when a guest creates an account",
				supportedVariables: [
					{
						key: "user_name",
						description: "Guest's full name",
						example: "John Doe",
					},
					{
						key: "user_email",
						description: "Guest's email address",
						example: "john@example.com",
					},
					{
						key: "network_name",
						description: "WiFi network name",
						example: "Guest_Network",
					},
				],
				templates: [
					{
						type: "EMAIL",
						subject: "Welcome to {network_name}!",
						bodyContent: `<p>Hi {user_name},</p>

<p>Thank you for signing up for {network_name}. Your account has been created successfully.</p>

<p>You can now connect to our WiFi network and enjoy high-speed internet access.</p>

<p>Best regards,<br>The WiFi Team</p>`,
						isActive: true,
					},
				],
			},
			{
				eventKey: "GUEST_VERIFY",
				name: "Account Verification",
				description:
					"Triggered when a guest needs to verify their email",
				supportedVariables: [
					{
						key: "user_name",
						description: "Guest's full name",
						example: "John Doe",
					},
					{
						key: "verification_link",
						description: "Email verification URL",
						example: "https://example.com/verify?token=abc123",
					},
					{
						key: "expiry_time",
						description: "Link expiration time",
						example: "24 hours",
					},
				],
				templates: [
					{
						type: "EMAIL",
						subject: "Verify your email address",
						bodyContent: `<p>Hi {user_name},</p>

<p>Please verify your email address by clicking the link below:</p>

<p><a href="{verification_link}">Verify Email</a></p>

<p>This link will expire in {expiry_time}.</p>

<p>If you didn't create this account, please ignore this email.</p>

<p>Best regards,<br>The WiFi Team</p>`,
						isActive: true,
					},
				],
			},
		],
	},
	{
		name: "Employees",
		slug: "employees",
		description: "Notifications related to employee network access",
		triggers: [
			{
				eventKey: "EMP_PORTAL_SIGNUP",
				name: "Captive Portal Sign-up",
				description:
					"Triggered when an employee signs up via captive portal",
				supportedVariables: [
					{
						key: "employee_name",
						description: "Employee's full name",
						example: "Jane Smith",
					},
					{
						key: "employee_email",
						description: "Employee's email address",
						example: "jane@company.com",
					},
					{
						key: "device_name",
						description: "Registered device name",
						example: "iPhone 13",
					},
				],
				templates: [
					{
						type: "EMAIL",
						subject: "Device Registered Successfully",
						bodyContent: `<p>Hi {employee_name},</p>

<p>Your device "{device_name}" has been successfully registered on the corporate network.</p>

<p>You can now access network resources with this device.</p>

<p>If you have any questions, please contact IT support.</p>

<p>Best regards,<br>IT Department</p>`,
						isActive: true,
					},
				],
			},
			{
				eventKey: "EMP_ONBOARDING",
				name: "Employee Onboarding",
				description: "Triggered when a new employee is onboarded",
				supportedVariables: [
					{
						key: "employee_name",
						description: "Employee's full name",
						example: "Jane Smith",
					},
					{
						key: "employee_email",
						description: "Employee's email address",
						example: "jane@company.com",
					},
					{
						key: "setup_link",
						description: "Network setup instructions URL",
						example: "https://example.com/setup",
					},
					{
						key: "start_date",
						description: "Employee start date",
						example: "January 15, 2024",
					},
				],
				templates: [
					{
						type: "EMAIL",
						subject: "Welcome to the Team - Network Access Setup",
						bodyContent: `<p>Hi {employee_name},</p>

<p>Welcome to the team! We're excited to have you starting on {start_date}.</p>

<p>To set up your network access, please follow the instructions at:</p>

<p><a href="{setup_link}">Network Setup Guide</a></p>

<p>If you need any assistance, don't hesitate to reach out to IT support.</p>

<p>Best regards,<br>IT Department</p>`,
						isActive: true,
					},
				],
			},
			{
				eventKey: "EMP_EXPIRING",
				name: "Account Expiring",
				description:
					"Triggered when an employee account is about to expire",
				supportedVariables: [
					{
						key: "employee_name",
						description: "Employee's full name",
						example: "Jane Smith",
					},
					{
						key: "expiry_date",
						description: "Account expiration date",
						example: "December 31, 2024",
					},
					{
						key: "renewal_link",
						description: "Account renewal URL",
						example: "https://example.com/renew",
					},
				],
				templates: [
					{
						type: "EMAIL",
						subject: "Your Network Access is Expiring Soon",
						bodyContent: `<p>Hi {employee_name},</p>

<p>This is a reminder that your network access will expire on {expiry_date}.</p>

<p>To continue accessing network resources, please renew your access:</p>

<p><a href="{renewal_link}">Renew Access</a></p>

<p>If you have any questions, please contact IT support.</p>

<p>Best regards,<br>IT Department</p>`,
						isActive: true,
					},
				],
			},
		],
	},
];

export async function seedCommunications() {
	console.log("🌱 Seeding communication data...");

	for (const categoryData of communicationData) {
		// Create category
		const category = await db.notificationCategory.upsert({
			where: { slug: categoryData.slug },
			update: {
				name: categoryData.name,
				description: categoryData.description,
			},
			create: {
				name: categoryData.name,
				slug: categoryData.slug,
				description: categoryData.description,
			},
		});

		console.log(`  ✓ Category: ${category.name}`);

		// Create triggers and templates
		for (const triggerData of categoryData.triggers) {
			const trigger = await db.notificationTrigger.upsert({
				where: { eventKey: triggerData.eventKey },
				update: {
					name: triggerData.name,
					description: triggerData.description,
					supportedVariables: triggerData.supportedVariables as any,
					categoryId: category.id,
				},
				create: {
					eventKey: triggerData.eventKey,
					name: triggerData.name,
					description: triggerData.description,
					supportedVariables: triggerData.supportedVariables as any,
					categoryId: category.id,
				},
			});

			console.log(`    ✓ Trigger: ${trigger.name} (${trigger.eventKey})`);

			// Create templates
			for (const templateData of triggerData.templates) {
				const existingTemplate =
					await db.communicationTemplate.findFirst({
						where: {
							triggerId: trigger.id,
							type: templateData.type,
						},
					});

				if (!existingTemplate) {
					await db.communicationTemplate.create({
						data: {
							triggerId: trigger.id,
							type: templateData.type,
							subject: templateData.subject,
							bodyContent: templateData.bodyContent,
							isActive: templateData.isActive,
						},
					});

					console.log(
						`      ✓ Template: ${templateData.type} - ${templateData.subject}`,
					);
				}
			}
		}
	}

	console.log("✅ Communication data seeded successfully!");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	seedCommunications()
		.catch((e) => {
			console.error("❌ Error seeding communications:", e);
			process.exit(1);
		})
		.finally(async () => {
			await db.$disconnect();
		});
}
