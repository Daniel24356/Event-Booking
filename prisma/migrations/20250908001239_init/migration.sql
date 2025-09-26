/*
  Warnings:

  - The values [CustomerCare] on the enum `AdminRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `receipt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `adminPermission` on the `Permissions` table. All the data in the column will be lost.
  - You are about to drop the column `reportedItemPermission` on the `Permissions` table. All the data in the column will be lost.
  - You are about to drop the column `userPermission` on the `Permissions` table. All the data in the column will be lost.
  - Added the required column `type` to the `ItemImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdminRole_new" AS ENUM ('LawAgency', 'TechnicalSupport', 'CustomeCare');
ALTER TABLE "Admin" ALTER COLUMN "role" TYPE "AdminRole_new" USING ("role"::text::"AdminRole_new");
ALTER TYPE "AdminRole" RENAME TO "AdminRole_old";
ALTER TYPE "AdminRole_new" RENAME TO "AdminRole";
DROP TYPE "AdminRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "receipt",
DROP COLUMN "thumbnail";

-- AlterTable
ALTER TABLE "ItemImage" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Permissions" DROP COLUMN "adminPermission",
DROP COLUMN "reportedItemPermission",
DROP COLUMN "userPermission";

-- DropEnum
DROP TYPE "AdminManagement";

-- DropEnum
DROP TYPE "AnalyticsManagement";

-- DropEnum
DROP TYPE "ApprovalQue";

-- DropEnum
DROP TYPE "ReportedItemsManagement";

-- DropEnum
DROP TYPE "UserManagement";
