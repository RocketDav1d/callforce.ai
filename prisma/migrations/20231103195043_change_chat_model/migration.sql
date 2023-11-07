/*
  Warnings:

  - Added the required column `summary` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transcript` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "transcript" TEXT NOT NULL;
