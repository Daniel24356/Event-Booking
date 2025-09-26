/*
  Warnings:

  - You are about to drop the column `username` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `admin` on the `Permissions` table. All the data in the column will be lost.
  - You are about to drop the column `analyticsManagement` on the `Permissions` table. All the data in the column will be lost.
  - You are about to drop the column `approvalQueue` on the `Permissions` table. All the data in the column will be lost.
  - You are about to drop the column `reportedItemsManagement` on the `Permissions` table. All the data in the column will be lost.
  - You are about to drop the column `userManagement` on the `Permissions` table. All the data in the column will be lost.
  - Added the required column `address` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminTitle` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminname` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "username",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "adminTitle" TEXT NOT NULL,
ADD COLUMN     "adminname" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Permissions" DROP COLUMN "admin",
DROP COLUMN "analyticsManagement",
DROP COLUMN "approvalQueue",
DROP COLUMN "reportedItemsManagement",
DROP COLUMN "userManagement",
ADD COLUMN     "adminPermission" "AdminManagement",
ADD COLUMN     "reportedItemPermission" "ReportedItemsManagement",
ADD COLUMN     "userPermission" "UserManagement";
