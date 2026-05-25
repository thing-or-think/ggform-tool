import prisma from '../../../config/prisma.js'

export const submissionBathRepository = {
    create(data) {
        return prisma.submissionBatch.create({ data })
    },

    findById(id) {
        return prisma.submissionBatch.findUnique({
            where: { id }
        })
    },

    findByFormId(formId) {
        return prisma.submissionBatch.findMany({
            where: {
                formId,
                deleteAt: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    },

    findMany() {
        return prisma.submissionBatch.findMany({
            where: {
                deletedAt: null
            },
            orderBy: {
                createAt: 'desc'
            }
        })
    },

    update(id, data) {
        const allowedData = {
            name: data.name,
            sourceType: data.sourceType,
            totalRecords: data.totalRecords,
            validRecords: data.validRecords,
            invalidRecords: data.invalidRecords,
            status: data.status,
            validationErrors: data.validationErrors,
            deletedAt: data.deletedAt
        }

        Object.keys(allowedData).forEach(key => {
            if (allowedData[key] === undefined) {
                delete allowedData[key]
            }
        })

        return prisma.submissionBatch.update({
            where: { id },
            data: allowedData
        })
    },

    updateStatus(id, status) {
        return prisma.submissionBatch.update({
            where: { id },
            data: { status }
        })
    },
    softDelete(id) {
        return prisma.submissionBatch.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })
    }
}