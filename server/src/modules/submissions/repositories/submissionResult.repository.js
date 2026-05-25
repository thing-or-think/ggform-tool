import prisma from "../../../config/prisma"

export const submissionResultRepository = {
    create(data) {
        return prisma.submissionResult.create({ data })
    },

    createMany(data) {
        return prisma.submissionResult.createMany({ data })
    },

    findById(id) {
        return prisma.submissionResult.findUnique({
            where: { id }
        })
    },

    findByJobId(jobId) {
        return prisma.submissionResult.findMany({
            where: { jobId },
            orderBy: {
                recordIndex: 'asc'
            }
        })
    },

    findByRecordId(recordId) {
        return prisma.submissionResult.findMany({
            where: { recordId },
            orderBy: {
                createdAt: 'desc'
            }
        })
    },

    findFailedByJobId(jobId) {
        return prisma.submissionResult.findMany({
            where: {
                jobId,
                status: 'failed'
            },
            orderBy: {
                recordIndex: 'asc'
            }
        })
    },

    update(id, data) {
        const allowedData = {
            status: data.status,
            attemptCount: data.attemptCount,
            submittedPayload: data.submittedPayload,
            providerResponse: data.providerResponse,
            errorCode: data.errorCode,
            errorMessage: data.errorMessage
        };

        Object.keys(allowedData).forEach((key) => {
            if (allowedData[key] === undefined) {
                delete allowedData[key];
            }
        });

        return prisma.submissionResult.update({
            where: { id },
            data: allowedData
        });
    },

    markSuccess(id, providerResponse) {
        return prisma.submissionResult.update({
            where: { id },
            data: {
                status: 'success',
                providerResponse
            }
        })
    },

    markFailed(id, errorCode, errorMessage) {
        return prisma.submissionResult.update({
            where: { id },
            data: {
                status: 'failed',
                errorCode,
                errorMessage
            }
        })
    }
}