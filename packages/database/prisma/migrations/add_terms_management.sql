-- Terms Management Feature Migration
-- Run this SQL in your Supabase SQL Editor

-- Create TermCategory enum
CREATE TYPE "TermCategory" AS ENUM ('PRIVACY_POLICY', 'TERMS_OF_USE', 'COOKIE_POLICY', 'OTHER');

-- Create TermStatus enum
CREATE TYPE "TermStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- Create term table
CREATE TABLE "term" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "category" "TermCategory" NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "isPreChecked" BOOLEAN NOT NULL DEFAULT false,
    "status" "TermStatus" NOT NULL DEFAULT 'DRAFT',
    "translations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "term_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "term_workspaceId_idx" ON "term"("workspaceId");
CREATE INDEX "term_workspaceId_status_idx" ON "term"("workspaceId", "status");

-- Add foreign key constraint
ALTER TABLE "term" ADD CONSTRAINT "term_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
