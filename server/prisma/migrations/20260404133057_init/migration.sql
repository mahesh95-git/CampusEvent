-- CreateTable
CREATE TABLE "VolunteerTask" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "taskName" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolunteerTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" SERIAL NOT NULL,
    "volunteerTaskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "attendanceStatus" VARCHAR(20) NOT NULL DEFAULT 'not_marked',
    "attendanceTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VolunteerTask_eventId_idx" ON "VolunteerTask"("eventId");

-- CreateIndex
CREATE INDEX "Volunteer_userId_idx" ON "Volunteer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_volunteerTaskId_userId_key" ON "Volunteer"("volunteerTaskId", "userId");

-- AddForeignKey
ALTER TABLE "VolunteerTask" ADD CONSTRAINT "VolunteerTask_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_volunteerTaskId_fkey" FOREIGN KEY ("volunteerTaskId") REFERENCES "VolunteerTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
