import prisma from '../config/prisma.js'
import { submissionJobService } from '../modules/submission-jobs/submissionJob.service.js'

async function test() {
    try {
        const job = await submissionJobService.createJob({
            formId: 'invalid-form-id-123', // ❌ không tồn tại
            totalRecords: 10
        })

        console.log('JOB CREATED:', job)
    } catch (err) {
        console.error('ERROR:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

test()