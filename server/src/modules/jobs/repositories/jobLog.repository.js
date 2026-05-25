import prisma from "../../../config/prisma"

export const jobLogRepository = {
    create(data) {
        return prisma.jobLog.create({ data })
    },

    findById(id) {
        return prisma.jobLog.findUnique({
            where: { id }
        })
    },

    findByJobId(jobId) {
        return prisma.jobLog.findMany({
            where: { jobId },
            orderBy: {
                createdAt: 'asc'
            }
        })
    },

    findErrorsByJobId(jobId) {
        return prisma.jobLog.findMany({
            where: {
                jobId,
                level: 'error'
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
    },

    deleteByJobId(jobId) {
        return prisma.jobLog.deleteMany({
            where: { jobId }
        })
    }
}