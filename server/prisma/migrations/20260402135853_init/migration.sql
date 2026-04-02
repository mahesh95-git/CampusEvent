-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "collegeName" TEXT NOT NULL,
    "collegeSlug" TEXT NOT NULL,
    "collegeType" TEXT NOT NULL,
    "establishedYear" INTEGER NOT NULL,
    "affiliatedUniversity" TEXT NOT NULL,
    "website" TEXT,
    "logoUrl" TEXT,
    "addressStreet" TEXT NOT NULL,
    "addressCity" TEXT NOT NULL,
    "addressPincode" TEXT NOT NULL,
    "addressState" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "adminPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_collegeSlug_key" ON "Organization"("collegeSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_adminEmail_key" ON "Organization"("adminEmail");
