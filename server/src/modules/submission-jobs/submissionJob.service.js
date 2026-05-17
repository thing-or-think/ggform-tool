/**
 * Submission Job Service
 *
 * Responsibility:
 * - Handles submission job creation and completion workflow.
 * - Persists submission results and updates aggregate job execution status.
 *
 * Used by:
 * - Submission controllers
 * - Queue workers
 * - Background job processors
 *
 * Notes:
 * - Uses database transactions to keep job status and result records consistent.
 * - Business workflow belongs here; low-level database access can be moved to repository layer when needed.
 */

import prisma from '../../config/prisma.js'
import { JOB_STATUS } from '../../shared/constants/jobStatus.js'

export const submissionJobService = {
    async createJob({ formId, totalRecords }) {
        return prisma.$transaction(async (tx) => {
            return tx.submissionJob.create({
                data: {
                    formId,
                    totalRecords,
                    status: JOB_STATUS.QUEUED
                }
            })
        })
    }
}

export async function completeSubmissionJob(jobId, results) {
    return prisma.$transaction(async (tx) => {
        await tx.submissionResult.createMany({
            data: results.map((item) => ({
                jobId,
                success: item.success,
                attemptCount: item.attemptCount,
                submittedAt: item.submittedAt ?? new Date(),
                durationMs: item.durationMs,
                requestPayload: item.requestPayload,
                responsePayload: item.responsePayload,
                errorMessage: item.errorMessage
            }))
        })

        const successCount = results.filter((item) => item.success).length
        const failedCount = results.filter((item) => !item.success).length

        let status = JOB_STATUS.COMPLETED

        if (successCount > 0 && failedCount > 0) {
            status = JOB_STATUS.PARTIAL_FAILED
        }

        if (successCount === 0 && failedCount > 0) {
            status = JOB_STATUS.FAILED
        }

        return tx.submissionJob.update({
            where: { id: jobId },
            data: {
                successCount,
                failedCount,
                status,
                finishedAt: new Date()
            }
        })
    })
}