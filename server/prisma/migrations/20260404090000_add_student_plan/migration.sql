-- CreateTable
CREATE TABLE "StudentPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "term" TEXT NOT NULL DEFAULT 'Semester Plan',
    "volunteerGoal" INTEGER NOT NULL DEFAULT 2,
    "milestones" JSONB NOT NULL,
    "focusAreas" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentPlan_userId_key" ON "StudentPlan"("userId");

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
