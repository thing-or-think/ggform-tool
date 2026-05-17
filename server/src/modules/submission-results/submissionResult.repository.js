/**
 * Submission Result Repository
 *
 * Responsibility:
 * - Encapsulates database access logic for submission result records.
 * - Provides methods to create and query results by submission job.
 *
 * Used by:
 * - Submission services
 * - Queue workers
 * - Job result tracking workflows
 *
 * Notes:
 * - This repository should only handle persistence logic.
 * - Business rules and status calculation should stay in service/worker layers.
 */

import prisma from '../../config/prisma.js'

export const submissionResultRepository = {
    create(data) {
        return prisma.submissionResult.create({
            data
        })
    },

    createMany(results) {
        return prisma.submissionResult.createMany({
            data: results
        })
    },

    findByJobId(jobId) {
        return prisma.submissionResult.findMany({
            where: { jobId },
            orderBy: {
                submittedAt: 'desc'
            }
        })
    }
}