/*
  Warnings:

  - Added the required column `type` to the `HubSpotProperty` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('CONTACT', 'COMPANY', 'DEAL');

-- AlterTable
ALTER TABLE "HubSpotProperty" ADD COLUMN     "type" "PropertyType" NOT NULL;
