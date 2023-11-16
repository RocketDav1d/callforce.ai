-- CreateTable
CREATE TABLE "HubSpotProperty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "HubSpotProperty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HubSpotProperty" ADD CONSTRAINT "HubSpotProperty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
