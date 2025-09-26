/*
  Warnings:

  - Added the required column `comment` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemType` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `missingData` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `missingLocation` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseCondition` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportedName` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seenDate` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seenLocation` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('User', 'Admin', 'SuperAdmin');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('LawAgency', 'TechnicalSupport', 'CustomeCare');

-- CreateEnum
CREATE TYPE "ItemState" AS ENUM ('Processing', 'Investigating', 'Recovered');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('Mobilephone', 'Car', 'Laptop', 'OtherElectronics');

-- CreateEnum
CREATE TYPE "UserManagement" AS ENUM ('ViewUsersDetails', 'ViewUsersReportedItems', 'DeleteUsers', 'EditUsersDetails');

-- CreateEnum
CREATE TYPE "AdminManagement" AS ENUM ('ViewAdminsDetails', 'ViewAdminsReportedItems', 'DeleteAdmin', 'EditAdminsDetails', 'CreateAdmins');

-- CreateEnum
CREATE TYPE "ReportedItemsManagement" AS ENUM ('ViewReportedItems', 'UpdateItemsStatus', 'DeleteItems', 'ReportAnItems', 'DeleteReportedItems');

-- CreateEnum
CREATE TYPE "ApprovalQue" AS ENUM ('ViewApprovalQueue', 'ApprovalAndDeclineItems');

-- CreateEnum
CREATE TYPE "AnalyticsManagement" AS ENUM ('ViewReportsAndAnalytics');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "itemType" "ItemType" NOT NULL,
ADD COLUMN     "missingData" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "missingLocation" TEXT NOT NULL,
ADD COLUMN     "purchaseCondition" "ItemStatus" NOT NULL,
ADD COLUMN     "reportedName" TEXT NOT NULL,
ADD COLUMN     "review" TEXT NOT NULL,
ADD COLUMN     "seenDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "seenLocation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminNote" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "role" "UserRole";

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL,
    "status" "AccountStatus" NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "userManagement" "UserManagement" NOT NULL,
    "admin" "AdminManagement" NOT NULL,
    "reportedItemsManagement" "ReportedItemsManagement" NOT NULL,
    "approvalQueue" "ApprovalQue" NOT NULL,
    "analyticsManagement" "AnalyticsManagement" NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "incidentType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locationOfIncident" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
