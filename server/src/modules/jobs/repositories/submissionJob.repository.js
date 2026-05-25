import prisma from '../../../config/prisma.js'

export const submissionJobRepository = {
    create(data) {
        return prisma.submissionJob.create({ data })
    },

    findById(id) {
        return prisma.submissionJob.findUnique({
            where: { id }
        })
    },

    findByFormId(formId) {
        return prisma.submissionJob.findMany({
            where: { formId },
            orderBy: {
                createdAt: 'desc'
            }
        })
    },

    findByBatchId(batchId) {
        return prisma.submissionJob.findMany({
            where: { batchId },
            orderBy: {
                createdAt: 'desc'
            }
        })
    },

    findRunningJobs() {
        return prisma.submissionJob.findMany({
            where: {
                status: 'running'
            }
        })
    },

    update(id, data) {
        const allowedData = {
            status: data.status,
            totalRecords: data.totalRecords,
            processedCount: data.processedCount,
            successCount: data.successCount,
            failedCount: data.failedCount,
            retryCount: data.retryCount,
            options: data.options,
            cancelReason: data.cancelReason,
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            startedAt: data.startedAt,
            finishedAt: data.finishedAt
        };

        Object.keys(allowedData).forEach((key) => {
            if (allowedData[key] === undefined) {
                delete allowedData[key];
            }
        });

        return prisma.submissionJob.update({
            where: { id },
            data: allowedData
        });
    },

    updateProgress(id, data) {
        return prisma.submissionJob.update({
            where: { id },
            data: {
                processedCount: data.processedCount,
                successCount: data.successCount,
                failedCount: data.failedCount
            }
        })
    },

    markStarted(id) {
        return prisma.submissionJob.update({
            where: { id },
            data: {
                status: 'running',
                startedAt: new Date()
            }
        })
    },

    markFinished(id) {
        return prisma.submissionJob.update({
            where: { id },
            data: {
                status: 'finished',
                finishedAt: new Date()
            }
        })
    },

    markFailed(id, errorCode, errorMessage) {
        return prisma.submissionJob.update({
            where: { id },
            data: {
                status: 'failed',
                errorCode,
                errorMessage,
                finishedAt: new Date()
            }
        })
    },

    cancel(id, cancelReason) {
        return prisma.submissionJob.update({
            where: { id },
            data: {
                status: 'cancelled',
                cancelReason,
                finishedAt: new Date()
            }
        })
    }
}