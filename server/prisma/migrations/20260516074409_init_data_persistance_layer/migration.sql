-- CreateEnum
CREATE TYPE "FormProvider" AS ENUM ('GOOGLE_FORM');

-- CreateEnum
CREATE TYPE "SubmissionJobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'PARTIAL_FAILED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "forms" (
    "id" TEXT NOT NULL,
    "formUrl" TEXT NOT NULL,
    "title" TEXT,
    "provider" "FormProvider" NOT NULL DEFAULT 'GOOGLE_FORM',
    "fields" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_jobs" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "status" "SubmissionJobStatus" NOT NULL DEFAULT 'QUEUED',
    "queuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_results" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 1,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMs" INTEGER,
    "requestPayload" JSONB,
    "responsePayload" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "forms_provider_idx" ON "forms"("provider");

-- CreateIndex
CREATE INDEX "forms_createdAt_idx" ON "forms"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "forms_formUrl_key" ON "forms"("formUrl");

-- CreateIndex
CREATE INDEX "submission_jobs_formId_idx" ON "submission_jobs"("formId");

-- CreateIndex
CREATE INDEX "submission_jobs_status_idx" ON "submission_jobs"("status");

-- CreateIndex
CREATE INDEX "submission_jobs_queuedAt_idx" ON "submission_jobs"("queuedAt");

-- CreateIndex
CREATE INDEX "submission_jobs_finishedAt_idx" ON "submission_jobs"("finishedAt");

-- CreateIndex
CREATE INDEX "submission_jobs_status_queuedAt_idx" ON "submission_jobs"("status", "queuedAt");

-- CreateIndex
CREATE INDEX "submission_results_jobId_idx" ON "submission_results"("jobId");

-- CreateIndex
CREATE INDEX "submission_results_success_idx" ON "submission_results"("success");

-- CreateIndex
CREATE INDEX "submission_results_submittedAt_idx" ON "submission_results"("submittedAt");

-- CreateIndex
CREATE INDEX "submission_results_jobId_success_idx" ON "submission_results"("jobId", "success");

-- AddForeignKey
ALTER TABLE "submission_jobs" ADD CONSTRAINT "submission_jobs_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_results" ADD CONSTRAINT "submission_results_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "submission_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
