-- Create Organization
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "metadata" TEXT,
    "paymentsCustomerId" TEXT,
    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

-- Create Workspace
CREATE TABLE "workspace" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "workspace_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "workspace_organizationId_slug_key" ON "workspace"("organizationId", "slug");
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create Integration table
CREATE TABLE "integration" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "credentials" JSONB NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "integration_pkey" PRIMARY KEY ("id")
);

-- Create indexes for Integration
CREATE INDEX "integration_workspaceId_provider_idx" ON "integration"("workspaceId", "provider");
ALTER TABLE "integration" ADD CONSTRAINT "integration_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create Network table
CREATE TABLE "network" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "tags" TEXT[],
    "provisioningStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "network_pkey" PRIMARY KEY ("id")
);

-- Create indexes for Network
CREATE UNIQUE INDEX "network_integrationId_externalId_key" ON "network"("integrationId", "externalId");
CREATE INDEX "network_workspaceId_idx" ON "network"("workspaceId");
ALTER TABLE "network" ADD CONSTRAINT "network_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "network" ADD CONSTRAINT "network_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create ByodUser table
CREATE TABLE "byod_user" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "byod_user_pkey" PRIMARY KEY ("id")
);

-- Create indexes for ByodUser
CREATE UNIQUE INDEX "byod_user_integrationId_externalId_key" ON "byod_user"("integrationId", "externalId");
CREATE UNIQUE INDEX "byod_user_workspaceId_email_key" ON "byod_user"("workspaceId", "email");
CREATE INDEX "byod_user_workspaceId_idx" ON "byod_user"("workspaceId");
ALTER TABLE "byod_user" ADD CONSTRAINT "byod_user_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "byod_user" ADD CONSTRAINT "byod_user_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create ByodUserGroup table
CREATE TABLE "byod_user_group" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "byod_user_group_pkey" PRIMARY KEY ("id")
);

-- Create indexes for ByodUserGroup
CREATE UNIQUE INDEX "byod_user_group_integrationId_externalId_key" ON "byod_user_group"("integrationId", "externalId");
CREATE INDEX "byod_user_group_workspaceId_idx" ON "byod_user_group"("workspaceId");
ALTER TABLE "byod_user_group" ADD CONSTRAINT "byod_user_group_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "byod_user_group" ADD CONSTRAINT "byod_user_group_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create ByodUserGroupMember table
CREATE TABLE "byod_user_group_member" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    CONSTRAINT "byod_user_group_member_pkey" PRIMARY KEY ("userId", "groupId")
);
ALTER TABLE "byod_user_group_member" ADD CONSTRAINT "byod_user_group_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "byod_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "byod_user_group_member" ADD CONSTRAINT "byod_user_group_member_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "byod_user_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
