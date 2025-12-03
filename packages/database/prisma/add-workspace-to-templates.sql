-- Add workspaceId to communication_template table
ALTER TABLE "communication_template" ADD COLUMN "workspaceId" TEXT;

-- Add foreign key constraint
ALTER TABLE "communication_template" ADD CONSTRAINT "communication_template_workspaceId_fkey" 
    FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create index on workspaceId
CREATE INDEX "communication_template_workspaceId_idx" ON "communication_template"("workspaceId");

-- Note: Existing templates will have workspaceId = NULL, making them global defaults
