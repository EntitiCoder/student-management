-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "PostSubmission" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "rejectionReason" TEXT,
    "teacherNote" TEXT,
    "finalPoints" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostSubmissionFile" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostSubmissionFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostSubmission_postId_status_idx" ON "PostSubmission"("postId", "status");

-- CreateIndex
CREATE INDEX "PostSubmission_studentId_submittedAt_idx" ON "PostSubmission"("studentId", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PostSubmission_studentId_postId_key" ON "PostSubmission"("studentId", "postId");

-- AddForeignKey
ALTER TABLE "PostSubmission" ADD CONSTRAINT "PostSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostSubmission" ADD CONSTRAINT "PostSubmission_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostSubmission" ADD CONSTRAINT "PostSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostSubmissionFile" ADD CONSTRAINT "PostSubmissionFile_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "PostSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
