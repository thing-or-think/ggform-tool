import prisma from '../config/prisma.js'
import { submissionJobRepository } from '../modules/submission-jobs/submissionJob.repository.js'

async function testCreateJob() {
    try {
        const job = await submissionJobRepository.create({
            formId: 'test-form-id', // ⚠️ phải tồn tại trong DB nếu có FK
            totalRecords: 5,
            status: 'QUEUED'
        })

        console.log('JOB CREATED:', job)
    } catch (err) {
        console.error('ERROR:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

testCreateJob()