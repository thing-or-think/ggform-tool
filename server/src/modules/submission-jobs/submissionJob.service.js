import prisma from '../../config/prisma.js'

export const submissionJobService = {
    async createJob({ formId, totalRecords }) {
        return prisma.$transaction(async (tx) => {
            const job = await tx.submissionJob.create({
                data: {
                    formId,
                    totalRecords,
                    status: 'QUEUED'
                }
            })

            return job
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

        let status = 'COMPLETED'

        if (successCount > 0 && failedCount > 0) {
            status = 'PARTIAL_FAILED'
        }

        if (successCount === 0 && failedCount > 0) {
            status = 'FAILED'
        }

        const job = await tx.submissionJob.update({
            where: { id: jobId },
            data: {
                successCount,
                failedCount,
                status,
                finishedAt: new Date()
            }
        })

        return job
    })
}