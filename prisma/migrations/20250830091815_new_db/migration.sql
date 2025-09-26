/*
  Warnings:

  - You are about to drop the column `adminAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `adminCity` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `adminPhoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `adminRole` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `adminState` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `adminTitle` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `adminname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `User` table. All the data in the column will be lost.
  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AdminManagement" AS ENUM ('ViewAdminsDetails', 'ViewAdminsReportedItems', 'DeleteAdmin', 'EditAdminsDetails', 'CreateAdmins');

-- CreateEnum
CREATE TYPE "AnalyticsManagement" AS ENUM ('ViewReportsAndAnalytics');

-- CreateEnum
CREATE TYPE "ApprovalQue" AS ENUM ('ViewApprovalQueue', 'ApprovalAndDeclineItems');

-- CreateEnum
CREATE TYPE "ReportedItemsManagement" AS ENUM ('ViewReportedItems', 'UpdateItemsStatus', 'DeleteItems', 'ReportAnItems', 'DeleteReportedItems');

-- CreateEnum
CREATE TYPE "UserManagement" AS ENUM ('ViewUsersDetails', 'ViewUsersReportedItems', 'DeleteUsers', 'EditUsersDetails');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "adminAddress",
DROP COLUMN "adminCity",
DROP COLUMN "adminPhoneNumber",
DROP COLUMN "adminRole",
DROP COLUMN "adminState",
DROP COLUMN "adminTitle",
DROP COLUMN "adminname",
DROP COLUMN "permissions",
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL,
    "status" "AccountStatus" NOT NULL,
    "address" TEXT NOT NULL,
    "adminTitle" TEXT NOT NULL,
    "adminname" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "adminPermission" "AdminManagement",
    "reportedItemPermission" "ReportedItemsManagement",
    "userPermission" "UserManagement",

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
