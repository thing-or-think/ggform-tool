import prisma from '../../../config/prisma.js'

export const submissionAnswerRepository = {
    create(data) {
        return prisma.submissionAnswer.create({ data })
    },

    createMany(data) {
        return prisma.submissionAnswer.createMany({ data })
    },

    findById(id) {
        return prisma.submissionAnswer.findUnique({
            where: { id }
        })
    },

    findByRecordId(recordId) {
        return prisma.submissionAnswer.findMany({
            where: { recordId }
        })
    },

    findByFieldId(fieldId) {
        return prisma.submissionAnswer.findMany({
            where: { fieldId }
        })
    },

    update(id, data) {
        const allowedData = {
            value: data.value,
            valueJson: data.valueJson
        }

        Object.keys(allowedData).forEach((key) => {
            if (allowedData[key] === undefined) {
                delete allowedData[key];
            }
        })

        return prisma.submissionAnswer.update({
            where: { id },
            data: allowedData
        })
    },

    delete(id) {
        return prisma.submissionAnswer.delete({
            where: { id }
        })
    },

    deleteByRecordId(recordId) {
        return prisma.submissionAnswer.deleteMany({
            where: { recordId }
        })
    }
}