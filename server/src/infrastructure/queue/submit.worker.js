/**
 * Submit Form Worker
 *
 * Responsibility:
 * - Consumes submit form jobs from the BullMQ queue.
 * - Delegates submission processing to the submission service.
 * - Moves permanently failed jobs to the submit DLQ after all retry attempts are exhausted.
 *
 * Used by:
 * - Queue infrastructure during application/worker bootstrap.
 * - Submission job processing flow.
 *
 * Notes:
 * - Only accepts jobs with the expected submit form job name.
 * - Worker concurrency is controlled by environment configuration.
 */

import { Worker } from 'bullmq'
import { redisConnection } from './queue.connection'
import { QUEUE_NAMES, JOB_NAMES } from './queue.constants'
import { processSubmissionJob } from '../../modules/submission/submission.service'
import { moveToSubmitDlq } from './submit.dlq'
import { env } from '../../config'

export const submitWorker = new Worker(
    QUEUE_NAMES.SUBMIT_FORM,
    async (job) => {
        if (job.name !== JOB_NAMES.SUBMIT_FORM) {
            throw new Error(`Unknown job name: ${job.name}`)
        }

        return processSubmissionJob(job.data)
    },
    {
        connection: redisConnection,
        concurrency: env.queue.workerConcurrency,
    }
)

submitWorker.on('completed', (job) => {
    console.log(`Submit job completed: ${job.id}`)
})

submitWorker.on('failed', async (job, error) => {
    console.error(`Submit job failed: ${job?.id}`, error.message)

    if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
        await moveToSubmitDlq(job, error)
    }
})