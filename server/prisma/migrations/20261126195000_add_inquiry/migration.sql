CREATE TABLE "Inquiry" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "collegeName" VARCHAR(150) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "message" VARCHAR(3000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");
