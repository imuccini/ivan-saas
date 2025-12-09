-- CreateTable
CREATE TABLE "guest_user" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "phone" TEXT,
    "customData" JSONB,
    "accessCode" TEXT,
    "termsAccepted" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guest_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsorship_request" (
    "id" TEXT NOT NULL,
    "guestUserId" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "sponsorship_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "guest_user" ADD CONSTRAINT "guest_user_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorship_request" ADD CONSTRAINT "sponsorship_request_guestUserId_fkey" FOREIGN KEY ("guestUserId") REFERENCES "guest_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorship_request" ADD CONSTRAINT "sponsorship_request_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
