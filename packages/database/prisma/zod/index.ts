/**
 * Prisma Zod Generator - Single File (inlined)
 * Auto-generated. Do not edit.
 */

import { z } from 'zod';
// File: TransactionIsolationLevel.schema.ts

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted', 'ReadCommitted', 'RepeatableRead', 'Serializable'])

export type TransactionIsolationLevel = z.infer<typeof TransactionIsolationLevelSchema>;

// File: UserScalarFieldEnum.schema.ts

export const UserScalarFieldEnumSchema = z.enum(['id', 'name', 'email', 'emailVerified', 'image', 'createdAt', 'updatedAt', 'username', 'role', 'banned', 'banReason', 'banExpires', 'onboardingComplete', 'paymentsCustomerId', 'locale', 'twoFactorEnabled'])

export type UserScalarFieldEnum = z.infer<typeof UserScalarFieldEnumSchema>;

// File: SessionScalarFieldEnum.schema.ts

export const SessionScalarFieldEnumSchema = z.enum(['id', 'expiresAt', 'ipAddress', 'userAgent', 'userId', 'impersonatedBy', 'activeOrganizationId', 'token', 'createdAt', 'updatedAt'])

export type SessionScalarFieldEnum = z.infer<typeof SessionScalarFieldEnumSchema>;

// File: AccountScalarFieldEnum.schema.ts

export const AccountScalarFieldEnumSchema = z.enum(['id', 'accountId', 'providerId', 'userId', 'accessToken', 'refreshToken', 'idToken', 'expiresAt', 'password', 'accessTokenExpiresAt', 'refreshTokenExpiresAt', 'scope', 'createdAt', 'updatedAt'])

export type AccountScalarFieldEnum = z.infer<typeof AccountScalarFieldEnumSchema>;

// File: VerificationScalarFieldEnum.schema.ts

export const VerificationScalarFieldEnumSchema = z.enum(['id', 'identifier', 'value', 'expiresAt', 'createdAt', 'updatedAt'])

export type VerificationScalarFieldEnum = z.infer<typeof VerificationScalarFieldEnumSchema>;

// File: PasskeyScalarFieldEnum.schema.ts

export const PasskeyScalarFieldEnumSchema = z.enum(['id', 'name', 'publicKey', 'userId', 'credentialID', 'counter', 'deviceType', 'backedUp', 'transports', 'createdAt'])

export type PasskeyScalarFieldEnum = z.infer<typeof PasskeyScalarFieldEnumSchema>;

// File: TwoFactorScalarFieldEnum.schema.ts

export const TwoFactorScalarFieldEnumSchema = z.enum(['id', 'secret', 'backupCodes', 'userId'])

export type TwoFactorScalarFieldEnum = z.infer<typeof TwoFactorScalarFieldEnumSchema>;

// File: OrganizationScalarFieldEnum.schema.ts

export const OrganizationScalarFieldEnumSchema = z.enum(['id', 'name', 'slug', 'logo', 'createdAt', 'metadata', 'paymentsCustomerId'])

export type OrganizationScalarFieldEnum = z.infer<typeof OrganizationScalarFieldEnumSchema>;

// File: WorkspaceScalarFieldEnum.schema.ts

export const WorkspaceScalarFieldEnumSchema = z.enum(['id', 'organizationId', 'name', 'slug', 'createdAt', 'updatedAt'])

export type WorkspaceScalarFieldEnum = z.infer<typeof WorkspaceScalarFieldEnumSchema>;

// File: WorkspaceMemberScalarFieldEnum.schema.ts

export const WorkspaceMemberScalarFieldEnumSchema = z.enum(['id', 'workspaceId', 'userId', 'createdAt'])

export type WorkspaceMemberScalarFieldEnum = z.infer<typeof WorkspaceMemberScalarFieldEnumSchema>;

// File: MemberScalarFieldEnum.schema.ts

export const MemberScalarFieldEnumSchema = z.enum(['id', 'organizationId', 'userId', 'role', 'createdAt'])

export type MemberScalarFieldEnum = z.infer<typeof MemberScalarFieldEnumSchema>;

// File: InvitationScalarFieldEnum.schema.ts

export const InvitationScalarFieldEnumSchema = z.enum(['id', 'organizationId', 'email', 'role', 'status', 'expiresAt', 'inviterId'])

export type InvitationScalarFieldEnum = z.infer<typeof InvitationScalarFieldEnumSchema>;

// File: PurchaseScalarFieldEnum.schema.ts

export const PurchaseScalarFieldEnumSchema = z.enum(['id', 'organizationId', 'userId', 'type', 'customerId', 'subscriptionId', 'productId', 'status', 'createdAt', 'updatedAt'])

export type PurchaseScalarFieldEnum = z.infer<typeof PurchaseScalarFieldEnumSchema>;

// File: AiChatScalarFieldEnum.schema.ts

export const AiChatScalarFieldEnumSchema = z.enum(['id', 'organizationId', 'userId', 'title', 'messages', 'createdAt', 'updatedAt'])

export type AiChatScalarFieldEnum = z.infer<typeof AiChatScalarFieldEnumSchema>;

// File: RoleScalarFieldEnum.schema.ts

export const RoleScalarFieldEnumSchema = z.enum(['id', 'name', 'description', 'organizationId', 'createdAt', 'updatedAt'])

export type RoleScalarFieldEnum = z.infer<typeof RoleScalarFieldEnumSchema>;

// File: PermissionScalarFieldEnum.schema.ts

export const PermissionScalarFieldEnumSchema = z.enum(['id', 'slug', 'description'])

export type PermissionScalarFieldEnum = z.infer<typeof PermissionScalarFieldEnumSchema>;

// File: RolePermissionScalarFieldEnum.schema.ts

export const RolePermissionScalarFieldEnumSchema = z.enum(['roleId', 'permissionId'])

export type RolePermissionScalarFieldEnum = z.infer<typeof RolePermissionScalarFieldEnumSchema>;

// File: RoleAssignmentScalarFieldEnum.schema.ts

export const RoleAssignmentScalarFieldEnumSchema = z.enum(['id', 'userId', 'roleId', 'resourceType', 'resourceId', 'createdAt', 'updatedAt'])

export type RoleAssignmentScalarFieldEnum = z.infer<typeof RoleAssignmentScalarFieldEnumSchema>;

// File: PartnerSettingsScalarFieldEnum.schema.ts

export const PartnerSettingsScalarFieldEnumSchema = z.enum(['organizationId', 'whitelabelLogoUrl'])

export type PartnerSettingsScalarFieldEnum = z.infer<typeof PartnerSettingsScalarFieldEnumSchema>;

// File: NotificationCategoryScalarFieldEnum.schema.ts

export const NotificationCategoryScalarFieldEnumSchema = z.enum(['id', 'name', 'description', 'slug', 'createdAt', 'updatedAt'])

export type NotificationCategoryScalarFieldEnum = z.infer<typeof NotificationCategoryScalarFieldEnumSchema>;

// File: NotificationTriggerScalarFieldEnum.schema.ts

export const NotificationTriggerScalarFieldEnumSchema = z.enum(['id', 'eventKey', 'name', 'description', 'supportedVariables', 'categoryId', 'createdAt', 'updatedAt'])

export type NotificationTriggerScalarFieldEnum = z.infer<typeof NotificationTriggerScalarFieldEnumSchema>;

// File: CommunicationTemplateScalarFieldEnum.schema.ts

export const CommunicationTemplateScalarFieldEnumSchema = z.enum(['id', 'triggerId', 'workspaceId', 'type', 'subject', 'bodyContent', 'isActive', 'createdAt', 'updatedAt'])

export type CommunicationTemplateScalarFieldEnum = z.infer<typeof CommunicationTemplateScalarFieldEnumSchema>;

// File: TermScalarFieldEnum.schema.ts

export const TermScalarFieldEnumSchema = z.enum(['id', 'workspaceId', 'name', 'version', 'category', 'isMandatory', 'isPreChecked', 'status', 'translations', 'createdAt', 'updatedAt'])

export type TermScalarFieldEnum = z.infer<typeof TermScalarFieldEnumSchema>;

// File: SortOrder.schema.ts

export const SortOrderSchema = z.enum(['asc', 'desc'])

export type SortOrder = z.infer<typeof SortOrderSchema>;

// File: JsonNullValueInput.schema.ts

export const JsonNullValueInputSchema = z.enum(['JsonNull'])

export type JsonNullValueInput = z.infer<typeof JsonNullValueInputSchema>;

// File: QueryMode.schema.ts

export const QueryModeSchema = z.enum(['default', 'insensitive'])

export type QueryMode = z.infer<typeof QueryModeSchema>;

// File: NullsOrder.schema.ts

export const NullsOrderSchema = z.enum(['first', 'last'])

export type NullsOrder = z.infer<typeof NullsOrderSchema>;

// File: JsonNullValueFilter.schema.ts

export const JsonNullValueFilterSchema = z.enum(['DbNull', 'JsonNull', 'AnyNull'])

export type JsonNullValueFilter = z.infer<typeof JsonNullValueFilterSchema>;

// File: PurchaseType.schema.ts

export const PurchaseTypeSchema = z.enum(['SUBSCRIPTION', 'ONE_TIME'])

export type PurchaseType = z.infer<typeof PurchaseTypeSchema>;

// File: CommunicationType.schema.ts

export const CommunicationTypeSchema = z.enum(['EMAIL', 'SMS'])

export type CommunicationType = z.infer<typeof CommunicationTypeSchema>;

// File: TermCategory.schema.ts

export const TermCategorySchema = z.enum(['PRIVACY_POLICY', 'TERMS_OF_USE', 'COOKIE_POLICY', 'OTHER'])

export type TermCategory = z.infer<typeof TermCategorySchema>;

// File: TermStatus.schema.ts

export const TermStatusSchema = z.enum(['DRAFT', 'PUBLISHED'])

export type TermStatus = z.infer<typeof TermStatusSchema>;

// File: User.schema.ts

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string().nullish(),
  role: z.string().nullish(),
  banned: z.boolean().nullish(),
  banReason: z.string().nullish(),
  banExpires: z.date().nullish(),
  onboardingComplete: z.boolean(),
  paymentsCustomerId: z.string().nullish(),
  locale: z.string().nullish(),
  twoFactorEnabled: z.boolean().nullish(),
});

export type UserType = z.infer<typeof UserSchema>;


// File: Session.schema.ts

export const SessionSchema = z.object({
  id: z.string(),
  expiresAt: z.date(),
  ipAddress: z.string().nullish(),
  userAgent: z.string().nullish(),
  userId: z.string(),
  impersonatedBy: z.string().nullish(),
  activeOrganizationId: z.string().nullish(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SessionType = z.infer<typeof SessionSchema>;


// File: Account.schema.ts

export const AccountSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullish(),
  refreshToken: z.string().nullish(),
  idToken: z.string().nullish(),
  expiresAt: z.date().nullish(),
  password: z.string().nullish(),
  accessTokenExpiresAt: z.date().nullish(),
  refreshTokenExpiresAt: z.date().nullish(),
  scope: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AccountType = z.infer<typeof AccountSchema>;


// File: Verification.schema.ts

export const VerificationSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.date(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
});

export type VerificationType = z.infer<typeof VerificationSchema>;


// File: Passkey.schema.ts

export const PasskeySchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  publicKey: z.string(),
  userId: z.string(),
  credentialID: z.string(),
  counter: z.number().int(),
  deviceType: z.string(),
  backedUp: z.boolean(),
  transports: z.string().nullish(),
  createdAt: z.date().nullish(),
});

export type PasskeyType = z.infer<typeof PasskeySchema>;


// File: TwoFactor.schema.ts

export const TwoFactorSchema = z.object({
  id: z.string(),
  secret: z.string(),
  backupCodes: z.string(),
  userId: z.string(),
});

export type TwoFactorType = z.infer<typeof TwoFactorSchema>;


// File: Organization.schema.ts

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().nullish(),
  logo: z.string().nullish(),
  createdAt: z.date(),
  metadata: z.string().nullish(),
  paymentsCustomerId: z.string().nullish(),
});

export type OrganizationType = z.infer<typeof OrganizationSchema>;


// File: Workspace.schema.ts

export const WorkspaceSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type WorkspaceType = z.infer<typeof WorkspaceSchema>;


// File: WorkspaceMember.schema.ts

export const WorkspaceMemberSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});

export type WorkspaceMemberType = z.infer<typeof WorkspaceMemberSchema>;


// File: Member.schema.ts

export const MemberSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.date(),
});

export type MemberType = z.infer<typeof MemberSchema>;


// File: Invitation.schema.ts

export const InvitationSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  email: z.string(),
  role: z.string().nullish(),
  status: z.string(),
  expiresAt: z.date(),
  inviterId: z.string(),
});

export type InvitationType = z.infer<typeof InvitationSchema>;


// File: Purchase.schema.ts

export const PurchaseSchema = z.object({
  id: z.string(),
  organizationId: z.string().nullish(),
  userId: z.string().nullish(),
  type: PurchaseTypeSchema,
  customerId: z.string(),
  subscriptionId: z.string().nullish(),
  productId: z.string(),
  status: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Purchase = z.infer<typeof PurchaseSchema>;


// File: AiChat.schema.ts

export const AiChatSchema = z.object({
  id: z.string(),
  organizationId: z.string().nullish(),
  userId: z.string().nullish(),
  title: z.string().nullish(),
  messages: z.unknown().refine((val) => { const getDepth = (obj: unknown, depth: number = 0): number => { if (depth > 10) return depth; if (obj === null || typeof obj !== 'object') return depth; const values = Object.values(obj as Record<string, unknown>); if (values.length === 0) return depth; return Math.max(...values.map(v => getDepth(v, depth + 1))); }; return getDepth(val) <= 10; }, "JSON nesting depth exceeds maximum of 10").default("[]"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AiChatType = z.infer<typeof AiChatSchema>;


// File: Role.schema.ts

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  organizationId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RoleType = z.infer<typeof RoleSchema>;


// File: Permission.schema.ts

export const PermissionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
});

export type PermissionType = z.infer<typeof PermissionSchema>;


// File: RolePermission.schema.ts

export const RolePermissionSchema = z.object({
  roleId: z.string(),
  permissionId: z.string(),
});

export type RolePermissionType = z.infer<typeof RolePermissionSchema>;


// File: RoleAssignment.schema.ts

export const RoleAssignmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  roleId: z.string(),
  resourceType: z.string(),
  resourceId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RoleAssignmentType = z.infer<typeof RoleAssignmentSchema>;


// File: PartnerSettings.schema.ts

export const PartnerSettingsSchema = z.object({
  organizationId: z.string(),
  whitelabelLogoUrl: z.string().nullish(),
});

export type PartnerSettingsType = z.infer<typeof PartnerSettingsSchema>;


// File: NotificationCategory.schema.ts

export const NotificationCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type NotificationCategoryType = z.infer<typeof NotificationCategorySchema>;


// File: NotificationTrigger.schema.ts

export const NotificationTriggerSchema = z.object({
  id: z.string(),
  eventKey: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  supportedVariables: z.unknown().refine((val) => { const getDepth = (obj: unknown, depth: number = 0): number => { if (depth > 10) return depth; if (obj === null || typeof obj !== 'object') return depth; const values = Object.values(obj as Record<string, unknown>); if (values.length === 0) return depth; return Math.max(...values.map(v => getDepth(v, depth + 1))); }; return getDepth(val) <= 10; }, "JSON nesting depth exceeds maximum of 10").default("[]"),
  categoryId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type NotificationTriggerType = z.infer<typeof NotificationTriggerSchema>;


// File: CommunicationTemplate.schema.ts

export const CommunicationTemplateSchema = z.object({
  id: z.string(),
  triggerId: z.string(),
  workspaceId: z.string().nullish(),
  type: CommunicationTypeSchema.default("EMAIL"),
  subject: z.string().nullish(),
  bodyContent: z.string(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CommunicationTemplateType = z.infer<typeof CommunicationTemplateSchema>;


// File: Term.schema.ts

export const TermSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  name: z.string(),
  version: z.string(),
  category: TermCategorySchema,
  isMandatory: z.boolean(),
  isPreChecked: z.boolean(),
  status: TermStatusSchema.default("DRAFT"),
  translations: z.unknown().refine((val) => { const getDepth = (obj: unknown, depth: number = 0): number => { if (depth > 10) return depth; if (obj === null || typeof obj !== 'object') return depth; const values = Object.values(obj as Record<string, unknown>); if (values.length === 0) return depth; return Math.max(...values.map(v => getDepth(v, depth + 1))); }; return getDepth(val) <= 10; }, "JSON nesting depth exceeds maximum of 10"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TermType = z.infer<typeof TermSchema>;

