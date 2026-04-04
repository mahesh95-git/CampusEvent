-- DropIndex
DROP INDEX "Registration_eventId_userId_key";

-- AlterTable
ALTER TABLE "Registration" ALTER COLUMN "userId" DROP NOT NULL;
