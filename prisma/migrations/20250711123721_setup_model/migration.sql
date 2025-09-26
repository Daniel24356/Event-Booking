/*
  Warnings:

  - You are about to drop the column `approvalQuePermission` on the `Permissions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ApprovalQueue" AS ENUM ('ViewApprovalQueue', 'ApproveDeclineItems');

-- AlterTable
ALTER TABLE "Permissions" DROP COLUMN "approvalQuePermission",
ADD COLUMN     "approvalQueuePermission" "ApprovalQueue";

-- DropEnum
DROP TYPE "ApprovalQue";
