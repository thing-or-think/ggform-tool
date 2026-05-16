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