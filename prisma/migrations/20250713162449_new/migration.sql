/*
  Warnings:

  - You are about to drop the `Permissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Permissions" DROP CONSTRAINT "Permissions_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permissions" TEXT[];

-- DropTable
DROP TABLE "Permissions";

-- DropEnum
DROP TYPE "AdminManagement";

-- DropEnum
DROP TYPE "AnalyticsManagement";

-- DropEnum
DROP TYPE "ApprovalQueue";

-- DropEnum
DROP TYPE "ReportedItemsManagement";

-- DropEnum
DROP TYPE "UserManagement";
