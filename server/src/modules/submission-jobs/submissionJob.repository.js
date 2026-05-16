import prisma from '../../config/prisma.js'

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
                status: 'PROCESSING',
                startedAt: new DataTransfer()
            }
        })
    },

    markCompleted(id) {
        return prisma.submissionJob.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                finishedAt: new Date()
            }
        })
    },

    markFailed(id) {
        return prisma.submissionJob.update({
            where: { id },
            data: {
                status: 'FAILED',
                finishedAt: new Data()
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