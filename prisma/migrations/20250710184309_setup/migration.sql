/*
  Warnings:

  - You are about to drop the column `adminId` on the `Permissions` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Permissions" DROP CONSTRAINT "Permissions_adminId_fkey";

-- AlterTable
ALTER TABLE "Permissions" DROP COLUMN "adminId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminAddress" TEXT,
ADD COLUMN     "adminCity" TEXT,
ADD COLUMN     "adminPhoneNumber" TEXT,
ADD COLUMN     "adminRole" "AdminRole",
ADD COLUMN     "adminState" TEXT,
ADD COLUMN     "adminTitle" TEXT,
ADD COLUMN     "adminname" TEXT;

-- DropTable
DROP TABLE "Admin";

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
