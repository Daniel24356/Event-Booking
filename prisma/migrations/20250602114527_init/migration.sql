/*
  Warnings:

  - You are about to drop the column `incidentType` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `locationOfIncident` on the `Report` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ItemState" ADD VALUE 'All';

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "incidentType",
DROP COLUMN "locationOfIncident";

-- DropEnum
DROP TYPE "Admins";
