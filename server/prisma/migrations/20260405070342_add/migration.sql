/*
  Warnings:

  - You are about to drop the `Volunteer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VolunteerTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Volunteer" DROP CONSTRAINT "Volunteer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Volunteer" DROP CONSTRAINT "Volunteer_volunteerTaskId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerTask" DROP CONSTRAINT "VolunteerTask_eventId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "bannerUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePictureUrl" TEXT;

-- DropTable
DROP TABLE "Volunteer";

-- DropTable
DROP TABLE "VolunteerTask";
