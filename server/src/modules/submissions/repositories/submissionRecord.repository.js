import prisma from "../../../config/prisma.js"

export const submissionRecordRepository = {
    create(data) {
        return prisma.submissionRecord.create({ data })
    },

    createMany(data) {
        return prisma.submissionRecord.createMany({ data })
    },

    findById(id) {
        return prisma.submissionRecord.findUnique({
            where: { id }
        })
    },

    findByBatchId(batchId) {
        return prisma.submissionRecord.findMany({
            where: { batchId },
            orderBy: {
                rowIndex: 'asc'
            }
        })
    },

    findValidRecords(batchId) {
        return prisma.submissionRecord.findMany({
            where: {
                batchId,
                isValid: true
            },
            orderBy: {
                rowIndex: 'asc'
            }
        })
    },

    findInvalidRecords(batchId) {
        return prisma.submissionRecord.findMany({
            where: {
                batchId,
                isValid: false
            },
            orderBy: {
                rowIndex: 'asc'
            }
        })
    },

    update(id, data) {
        const allowedData = {
            batchId: data.batchId,
            rowIndex: data.rowIndex,
            isValid: data.isValid,
            validationErrors: data.validationErrors
        }

        Object.keys(allowedData).forEach((key) => {
            if (allowedData[key] === undefined) {
                delete allowedData[key];
            }
        })

        return prisma.submissionRecord.update({
            where: { id },
            data: allowedData
        })
    },

    delete(id) {
        return prisma.submissionRecord.delete({
            where: { id }
        })
    }
}