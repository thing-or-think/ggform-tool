/**
 * Submit Form Dead Letter Queue
 *
 * Responsibility:
 * - Defines the dead letter queue for failed submit form jobs.
 * - Stores failed job metadata after retry attempts are exhausted.
 *
 * Used by:
 * - Submit form worker failure handler.
 * - Queue monitoring or recovery tools.
 *
 * Notes:
 * - Failed job payloads are preserved for debugging and possible replay.
 * - Avoid storing sensitive data in `originalData` unless payload retention is intentional.
 */

import { Queue } from 'bullmq'
import { QUEUE_NAMES } from './queue.constants'
import { redisConnection } from './queue.connection'

export const submitDlq = new Queue(QUEUE_NAMES.SUBMIT_FORM_DLQ, {
    connection: redisConnection,
})

export async function moveToSubmitDlq(job, error) {
    return submitDlq.add('failed-submit-form', {
        originalJobId: job.id,
        originalQueue: job.queueName,
        originalData: job.data,
        failedReason: error.message,
        stack: error.stack,
        attemptsMade: job.attemptsMade,
        failedAt: new Date().toISOString(),
    })
}