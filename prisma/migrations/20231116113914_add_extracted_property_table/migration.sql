-- CreateTable
CREATE TABLE "ExtractedProperty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "embedding_id" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "HubspotPropertyId" TEXT NOT NULL,

    CONSTRAINT "ExtractedProperty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExtractedProperty_HubspotPropertyId_key" ON "ExtractedProperty"("HubspotPropertyId");

-- AddForeignKey
ALTER TABLE "ExtractedProperty" ADD CONSTRAINT "ExtractedProperty_HubspotPropertyId_fkey" FOREIGN KEY ("HubspotPropertyId") REFERENCES "HubSpotProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
