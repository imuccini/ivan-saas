-- Communication Manager Tables
-- Run this SQL in your Supabase SQL Editor

-- Create CommunicationType enum
CREATE TYPE "CommunicationType" AS ENUM ('EMAIL', 'SMS');

-- Create notification_category table
CREATE TABLE "notification_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_category_pkey" PRIMARY KEY ("id")
);

-- Create notification_trigger table
CREATE TABLE "notification_trigger" (
    "id" TEXT NOT NULL,
    "eventKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "supportedVariables" JSONB NOT NULL DEFAULT '[]',
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_trigger_pkey" PRIMARY KEY ("id")
);

-- Create communication_template table
CREATE TABLE "communication_template" (
    "id" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "type" "CommunicationType" NOT NULL DEFAULT 'EMAIL',
    "subject" TEXT,
    "bodyContent" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communication_template_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "notification_category_slug_key" ON "notification_category"("slug");
CREATE UNIQUE INDEX "notification_trigger_eventKey_key" ON "notification_trigger"("eventKey");

-- Create regular indexes
CREATE INDEX "notification_trigger_categoryId_idx" ON "notification_trigger"("categoryId");
CREATE INDEX "communication_template_triggerId_idx" ON "communication_template"("triggerId");

-- Add foreign key constraints
ALTER TABLE "notification_trigger" ADD CONSTRAINT "notification_trigger_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "notification_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "communication_template" ADD CONSTRAINT "communication_template_triggerId_fkey" 
    FOREIGN KEY ("triggerId") REFERENCES "notification_trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;
