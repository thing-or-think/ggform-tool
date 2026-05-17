/**
 * Submission Job Repository
 *
 * Responsibility:
 * - Encapsulates database access logic for submission job records.
 * - Provides methods to create, query, update status, and update execution counters.
 *
 * Used by:
 * - Submission services
 * - Queue workers
 * - Job processing workflows
 *
 * Notes:
 * - This repository should only handle persistence logic.
 * - Business rules and workflow orchestration should stay in service/worker layers.
 */

import prisma from '../../config/prisma.js'
import { JOB_STATUS } from '../../shared/constants/jobStatus.js'

export const submissionJobRepository = {
    create(data) {
        return prisma.submissionJob.create({
            data
        })
    },

    findById(id) {
        return prisma.submissionJob.findUnique({
            where: { id },
            include: {
                form: true,
                results: true
            }
        })
    },

    markProcessing(id) {
        return prisma.submissionJob.update({
            where: { id },
            data: {
                status: JOB_STATUS.PROCESSING,
                startedAt: new Date()
            }
        })
    },

    markCompleted(id) {
        return prisma.submissionJob.update({
            where: { id },
            data: {
                status: JOB_STATUS.COMPLETED,
                finishedAt: new Date()
            }
        })
    },

    markFailed(id) {
        return prisma.submissionJob.update({
            where: { id },
            data: {
                status: JOB_STATUS.FAILED,
                finishedAt: new Date()
            }
        })
    },

    updateCounters(id, { successCount, failedCount }) {
        return prisma.submissionJob.update({
            where: { id },
            data: {
                successCount,
                failedCount
            }
        })
    }
}