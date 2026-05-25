/*
  Warnings:

  - The primary key for the `forms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `fields` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `formUrl` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `forms` table. All the data in the column will be lost.
  - The primary key for the `submission_jobs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `submission_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `failedCount` on the `submission_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `finishedAt` on the `submission_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `formId` on the `submission_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `queuedAt` on the `submission_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `submission_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `successCount` on the `submission_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `totalRecords` on the `submission_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `submission_jobs` table. All the data in the column will be lost.
  - The `status` column on the `submission_jobs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `submission_results` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attemptCount` on the `submission_results` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `submission_results` table. All the data in the column will be lost.
  - You are about to drop the column `durationMs` on the `submission_results` table. All the data in the column will be lost.
  - You are about to drop the column `errorMessage` on the `submission_results` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `submission_results` table. All the data in the column will be lost.
  - You are about to drop the column `requestPayload` on the `submission_results` table. All the data in the column will be lost.
  - You are about to drop the column `responsePayload` on the `submission_results` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `submission_results` table. All the data in the column will be lost.
  - You are about to drop the column `success` on the `submission_results` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[form_url]` on the table `forms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[job_id,record_id]` on the table `submission_results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `form_url` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_form_id` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `forms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `title` on table `forms` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `provider` on the `forms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `batch_id` to the `submission_jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `form_id` to the `submission_jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `submission_jobs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `submission_jobs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `job_id` to the `submission_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `record_id` to the `submission_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `record_index` to the `submission_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `submission_results` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `submission_results` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "form_provider" AS ENUM ('google_form');

-- CreateEnum
CREATE TYPE "form_status" AS ENUM ('active', 'inactive', 'error');

-- CreateEnum
CREATE TYPE "form_field_type" AS ENUM ('text', 'textarea', 'number', 'date', 'time', 'radio', 'checkbox', 'select', 'linear_scale', 'file_upload', 'unknown');

-- CreateEnum
CREATE TYPE "submission_batch_source_type" AS ENUM ('csv', 'json', 'manual');

-- CreateEnum
CREATE TYPE "submission_batch_status" AS ENUM ('draft', 'validating', 'valid', 'invalid', 'ready', 'archived');

-- CreateEnum
CREATE TYPE "submission_job_status" AS ENUM ('pending', 'queued', 'running', 'completed', 'partial', 'failed', 'canceled', 'retrying');

-- CreateEnum
CREATE TYPE "submission_result_status" AS ENUM ('pending', 'success', 'failed', 'skipped');

-- CreateEnum
CREATE TYPE "job_log_level" AS ENUM ('debug', 'info', 'warn', 'error');

-- DropForeignKey
ALTER TABLE "submission_jobs" DROP CONSTRAINT "submission_jobs_formId_fkey";

-- DropForeignKey
ALTER TABLE "submission_results" DROP CONSTRAINT "submission_results_jobId_fkey";

-- DropIndex
DROP INDEX "forms_createdAt_idx";

-- DropIndex
DROP INDEX "forms_formUrl_key";

-- DropIndex
DROP INDEX "submission_jobs_finishedAt_idx";

-- DropIndex
DROP INDEX "submission_jobs_formId_idx";

-- DropIndex
DROP INDEX "submission_jobs_queuedAt_idx";

-- DropIndex
DROP INDEX "submission_jobs_status_queuedAt_idx";

-- DropIndex
DROP INDEX "submission_results_jobId_idx";

-- DropIndex
DROP INDEX "submission_results_jobId_success_idx";

-- DropIndex
DROP INDEX "submission_results_submittedAt_idx";

-- DropIndex
DROP INDEX "submission_results_success_idx";

-- AlterTable
ALTER TABLE "forms" DROP CONSTRAINT "forms_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "fields",
DROP COLUMN "formUrl",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "form_url" TEXT NOT NULL,
ADD COLUMN     "provider_form_id" TEXT NOT NULL,
ADD COLUMN     "scan_error" TEXT,
ADD COLUMN     "status" "form_status" NOT NULL DEFAULT 'active',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
DROP COLUMN "provider",
ADD COLUMN     "provider" "form_provider" NOT NULL,
ADD CONSTRAINT "forms_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "submission_jobs" DROP CONSTRAINT "submission_jobs_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "failedCount",
DROP COLUMN "finishedAt",
DROP COLUMN "formId",
DROP COLUMN "queuedAt",
DROP COLUMN "startedAt",
DROP COLUMN "successCount",
DROP COLUMN "totalRecords",
DROP COLUMN "updatedAt",
ADD COLUMN     "batch_id" UUID NOT NULL,
ADD COLUMN     "cancel_reason" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "error_code" TEXT,
ADD COLUMN     "error_message" TEXT,
ADD COLUMN     "failed_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "finished_at" TIMESTAMP(3),
ADD COLUMN     "form_id" UUID NOT NULL,
ADD COLUMN     "options" JSONB,
ADD COLUMN     "parent_job_id" UUID,
ADD COLUMN     "processed_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "started_at" TIMESTAMP(3),
ADD COLUMN     "success_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_records" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "submission_job_status" NOT NULL DEFAULT 'pending',
ADD CONSTRAINT "submission_jobs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "submission_results" DROP CONSTRAINT "submission_results_pkey",
DROP COLUMN "attemptCount",
DROP COLUMN "createdAt",
DROP COLUMN "durationMs",
DROP COLUMN "errorMessage",
DROP COLUMN "jobId",
DROP COLUMN "requestPayload",
DROP COLUMN "responsePayload",
DROP COLUMN "submittedAt",
DROP COLUMN "success",
ADD COLUMN     "attempt_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "error_code" TEXT,
ADD COLUMN     "error_message" TEXT,
ADD COLUMN     "job_id" UUID NOT NULL,
ADD COLUMN     "provider_response" JSONB,
ADD COLUMN     "record_id" UUID NOT NULL,
ADD COLUMN     "record_index" INTEGER NOT NULL,
ADD COLUMN     "status" "submission_result_status" NOT NULL DEFAULT 'pending',
ADD COLUMN     "submitted_payload" JSONB,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "submission_results_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "FormProvider";

-- DropEnum
DROP TYPE "SubmissionJobStatus";

-- CreateTable
CREATE TABLE "form_fields" (
    "id" UUID NOT NULL,
    "form_id" UUID NOT NULL,
    "entry_id" VARCHAR(100) NOT NULL,
    "label" TEXT NOT NULL,
    "type" "form_field_type" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "order" INTEGER NOT NULL,
    "raw" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_batches" (
    "id" UUID NOT NULL,
    "form_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "source_type" "submission_batch_source_type" NOT NULL,
    "total_records" INTEGER NOT NULL DEFAULT 0,
    "valid_records" INTEGER NOT NULL DEFAULT 0,
    "invalid_records" INTEGER NOT NULL DEFAULT 0,
    "status" "submission_batch_status" NOT NULL DEFAULT 'draft',
    "validation_errors" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "submission_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_records" (
    "id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "row_index" INTEGER NOT NULL,
    "is_valid" BOOLEAN NOT NULL DEFAULT false,
    "validation_errors" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_answers" (
    "id" UUID NOT NULL,
    "record_id" UUID NOT NULL,
    "field_id" UUID NOT NULL,
    "entry_id" VARCHAR(100) NOT NULL,
    "value" TEXT,
    "value_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_logs" (
    "id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "level" "job_log_level" NOT NULL,
    "message" TEXT NOT NULL,
    "context" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "form_fields_form_id_idx" ON "form_fields"("form_id");

-- CreateIndex
CREATE INDEX "form_fields_entry_id_idx" ON "form_fields"("entry_id");

-- CreateIndex
CREATE INDEX "form_fields_type_idx" ON "form_fields"("type");

-- CreateIndex
CREATE INDEX "form_fields_order_idx" ON "form_fields"("order");

-- CreateIndex
CREATE INDEX "form_fields_created_at_idx" ON "form_fields"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "form_fields_form_id_entry_id_key" ON "form_fields"("form_id", "entry_id");

-- CreateIndex
CREATE INDEX "submission_batches_form_id_idx" ON "submission_batches"("form_id");

-- CreateIndex
CREATE INDEX "submission_batches_source_type_idx" ON "submission_batches"("source_type");

-- CreateIndex
CREATE INDEX "submission_batches_status_idx" ON "submission_batches"("status");

-- CreateIndex
CREATE INDEX "submission_batches_created_at_idx" ON "submission_batches"("created_at");

-- CreateIndex
CREATE INDEX "submission_batches_deleted_at_idx" ON "submission_batches"("deleted_at");

-- CreateIndex
CREATE INDEX "submission_records_batch_id_idx" ON "submission_records"("batch_id");

-- CreateIndex
CREATE INDEX "submission_records_is_valid_idx" ON "submission_records"("is_valid");

-- CreateIndex
CREATE INDEX "submission_records_created_at_idx" ON "submission_records"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "submission_records_batch_id_row_index_key" ON "submission_records"("batch_id", "row_index");

-- CreateIndex
CREATE INDEX "submission_answers_record_id_idx" ON "submission_answers"("record_id");

-- CreateIndex
CREATE INDEX "submission_answers_field_id_idx" ON "submission_answers"("field_id");

-- CreateIndex
CREATE INDEX "submission_answers_entry_id_idx" ON "submission_answers"("entry_id");

-- CreateIndex
CREATE INDEX "submission_answers_created_at_idx" ON "submission_answers"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "submission_answers_record_id_field_id_key" ON "submission_answers"("record_id", "field_id");

-- CreateIndex
CREATE INDEX "job_logs_job_id_idx" ON "job_logs"("job_id");

-- CreateIndex
CREATE INDEX "job_logs_level_idx" ON "job_logs"("level");

-- CreateIndex
CREATE INDEX "job_logs_created_at_idx" ON "job_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "forms_form_url_key" ON "forms"("form_url");

-- CreateIndex
CREATE INDEX "forms_provider_idx" ON "forms"("provider");

-- CreateIndex
CREATE INDEX "forms_provider_form_id_idx" ON "forms"("provider_form_id");

-- CreateIndex
CREATE INDEX "forms_status_idx" ON "forms"("status");

-- CreateIndex
CREATE INDEX "forms_created_at_idx" ON "forms"("created_at");

-- CreateIndex
CREATE INDEX "forms_deleted_at_idx" ON "forms"("deleted_at");

-- CreateIndex
CREATE INDEX "submission_jobs_form_id_idx" ON "submission_jobs"("form_id");

-- CreateIndex
CREATE INDEX "submission_jobs_batch_id_idx" ON "submission_jobs"("batch_id");

-- CreateIndex
CREATE INDEX "submission_jobs_parent_job_id_idx" ON "submission_jobs"("parent_job_id");

-- CreateIndex
CREATE INDEX "submission_jobs_status_idx" ON "submission_jobs"("status");

-- CreateIndex
CREATE INDEX "submission_jobs_created_at_idx" ON "submission_jobs"("created_at");

-- CreateIndex
CREATE INDEX "submission_jobs_started_at_idx" ON "submission_jobs"("started_at");

-- CreateIndex
CREATE INDEX "submission_jobs_finished_at_idx" ON "submission_jobs"("finished_at");

-- CreateIndex
CREATE INDEX "submission_results_job_id_idx" ON "submission_results"("job_id");

-- CreateIndex
CREATE INDEX "submission_results_record_id_idx" ON "submission_results"("record_id");

-- CreateIndex
CREATE INDEX "submission_results_status_idx" ON "submission_results"("status");

-- CreateIndex
CREATE INDEX "submission_results_record_index_idx" ON "submission_results"("record_index");

-- CreateIndex
CREATE INDEX "submission_results_created_at_idx" ON "submission_results"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "submission_results_job_id_record_id_key" ON "submission_results"("job_id", "record_id");

-- AddForeignKey
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_batches" ADD CONSTRAINT "submission_batches_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_records" ADD CONSTRAINT "submission_records_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "submission_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_answers" ADD CONSTRAINT "submission_answers_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "submission_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_answers" ADD CONSTRAINT "submission_answers_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "form_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_jobs" ADD CONSTRAINT "submission_jobs_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_jobs" ADD CONSTRAINT "submission_jobs_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "submission_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_jobs" ADD CONSTRAINT "submission_jobs_parent_job_id_fkey" FOREIGN KEY ("parent_job_id") REFERENCES "submission_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_results" ADD CONSTRAINT "submission_results_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "submission_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_results" ADD CONSTRAINT "submission_results_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "submission_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_logs" ADD CONSTRAINT "job_logs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "submission_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
