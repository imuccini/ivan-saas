import { ORPCError } from "@orpc/client";
import { db } from "@repo/database";
import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const createWorkspace = protectedProcedure
	.route({
		method: "POST",
		path: "/workspaces",
		tags: ["Workspaces"],
		summary: "Create workspace",
		description: "Create a new workspace in an organization",
	})
	.input(
		z.object({
			name: z.string().min(1),
			slug: z.string().optional(),
			organizationId: z.string(),
		}),
	)
	.handler(async ({ input, context }) => {
		const { user } = context;

		// Verify user is member of organization
		const member = await db.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: input.organizationId,
					userId: user.id,
				},
			},
		});

		if (!member) {
			throw new ORPCError("FORBIDDEN", {
				message: "You are not a member of this organization",
			});
		}

		let slug = input.slug;
		if (!slug) {
			slug = slugify(input.name, { lowercase: true });
			// Check for uniqueness within organization
			const existing = await db.workspace.findUnique({
				where: {
					organizationId_slug: {
						organizationId: input.organizationId,
						slug,
					},
				},
			});

			if (existing) {
				slug = `${slug}-${nanoid(5)}`;
			}
		} else {
			// Check for uniqueness within organization
			const existing = await db.workspace.findUnique({
				where: {
					organizationId_slug: {
						organizationId: input.organizationId,
						slug,
					},
				},
			});
			if (existing) {
				throw new ORPCError("CONFLICT", {
					message:
						"Workspace with this slug already exists in this organization",
				});
			}
		}

		const workspace = await db.workspace.create({
			data: {
				name: input.name,
				slug,
				organizationId: input.organizationId,
			},
		});

		await db.workspaceMember.create({
			data: {
				workspaceId: workspace.id,
				userId: user.id,
			},
		});

		// Create default terms for the workspace
		const defaultTerms = [
			{
				name: "Privacy Policy",
				version: "1.0",
				category: "PRIVACY_POLICY" as const,
				isMandatory: true,
				isPreChecked: true,
				status: "PUBLISHED" as const,
				translations: {
					en: {
						label: "I accept the Privacy Policy",
						linkText: "Read Privacy Policy",
						documentTitle: "Privacy Policy",
						documentContent:
							"This is the default privacy policy. Please update this content to reflect your organization's privacy practices and compliance requirements.",
					},
				},
			},
			{
				name: "Terms of Use",
				version: "1.0",
				category: "TERMS_OF_USE" as const,
				isMandatory: true,
				isPreChecked: true,
				status: "PUBLISHED" as const,
				translations: {
					en: {
						label: "I agree to the Terms of Use",
						linkText: "Read Terms of Use",
						documentTitle: "Terms of Use",
						documentContent:
							"These are the default terms of use. Please update this content to reflect your organization's terms and conditions.",
					},
				},
			},
			{
				name: "Marketing Consent",
				version: "1.0",
				category: "OTHER" as const,
				isMandatory: false,
				isPreChecked: false,
				status: "PUBLISHED" as const,
				translations: {
					en: {
						label: "I agree to receive marketing communications",
						linkText: "Read Marketing Policy",
						documentTitle: "Marketing Consent",
						documentContent:
							"By checking this box, you agree to receive marketing communications from us. You can unsubscribe at any time.",
					},
				},
			},
		];

		await db.term.createMany({
			data: defaultTerms.map((term) => ({
				workspaceId: workspace.id,
				...term,
			})),
		});

		// Create default Guest WiFi config with pre-configured look and feel
		await db.guestWifiConfig.create({
			data: {
				workspaceId: workspace.id,
				name: "Default",
				isActive: true,
				config: {
					authentication: {
						showLoginOption: true,
						appleIdEnabled: true,
						accessCodesEnabled: false,
						enterpriseIdpEnabled: false,
						selectedIdps: [],
						sponsorshipEnabled: false,
						phoneValidationEnabled: false,
						registrationFields: [
							{
								id: "1",
								label: "First Name",
								placeholder: "Enter your first name",
								required: false,
								type: "text",
							},
							{
								id: "3",
								label: "Email",
								placeholder: "Enter your email address",
								required: true,
								type: "email",
							},
						],
						terms: [],
					},
					journey: {
						easyWifiEnabled: false,
						successRedirectMode: "text",
						autoConnectReturning: true,
						allowBypassWithCode: true,
						allowExtensionRequest: true,
					},
					style: {
						fontFamily: "Inter",
						baseFontSize: "16",
						baseColor: "#1F2937",
						primaryColor: "#111827",
						spacing: "balanced",
						backgroundType: "gradient",
						backgroundColor: "#6366f1",
						gradientColor1: "#6366f1",
						gradientColor2: "#ec4899",
					},
					content: {
						en: {
							title: "Get online with free WiFi",
							description: "How do you want to connect?",
							signupButtonText: "Register",
							loginButtonText: "Login with your account",
							sponsorMessage:
								"You need to wait that your host approves your access",
							phoneValidationMessage:
								"You need to validate your phone number",
							successMessage:
								"You're all set! Enjoy your WiFi connection.",
							blockedMessage:
								"Sorry, you have used all your WiFi time allowance for today.",
							easyWifiCtaMessage:
								"You need to wait that your host approves your access",
							easyWifiSkipMessage: "I'll take my chances",
						},
					},
					assets: {
						logoUrl: "/images/default_logo.png",
						logoSize: 104,
					},
					languages: ["en"],
					defaultLanguage: "en",
				},
			},
		});

		return workspace;
	});
