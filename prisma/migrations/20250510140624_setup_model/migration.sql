/*
  Warnings:

  - The `status` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `currentCondition` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "currentCondition" "ItemStatus" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ItemState" NOT NULL DEFAULT 'Processing';
