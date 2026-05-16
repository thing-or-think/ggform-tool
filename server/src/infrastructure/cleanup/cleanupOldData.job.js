import prisma from '../../config/prisma.js'

const daysAgo = (days) => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
}

export async function cleanupOldData() {
    const successResultRetentionDate = daysAgo(30)
    const failedResultRetentionDate = daysAgo(90)
    const completedJobRetentionDate = daysAgo(90)
    const failedJobRetentionDate = daysAgo(180)

    await prisma.submissionResult.deleteMany({
        where: {
            success: true,
            submittedAt: {
                lt: successResultRetentionDate
            }
        }
    })

    await prisma.submissionResult.deleteMany({
        where: {
            success: false,
            submittedAt: {
                lt: failedResultRetentionDate
            }
        }
    })

    await prisma.submissionJob.deleteMany({
        where: {
            status: 'COMPLETED',
            finishedAt: {
                lt: completedJobRetentionDate
            }
        }
    })

    await prisma.submissionJob.deleteMany({
        where: {
            status: 'FAILED',
            finishedAt: {
                lt: failedJobRetentionDate
            }
        }
    })
}

export async function cleanupOldPayloads() {
    const retentionDate = new Date()
    retentionDate.setDate(retentionDate.getDate() - 30)

    return prisma.submissionResult.updateMany({
        where: {
            submittedAt: {
                lt: retentionDate
            }
        },
        data: {
            requestPayload: null,
            responsePayload: null
        }
    })
}