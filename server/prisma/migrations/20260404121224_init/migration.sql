/*
  Warnings:

  - You are about to drop the column `guestEmail` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `guestName` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the `StudentPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentPlan" DROP CONSTRAINT "StudentPlan_userId_fkey";

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "guestEmail",
DROP COLUMN "guestName";

-- DropTable
DROP TABLE "StudentPlan";
