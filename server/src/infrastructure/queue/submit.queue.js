/**
 * Submit Form Queue
 *
 * Responsibility:
 * - Defines the BullMQ queue used for asynchronous form submission jobs.
 * - Configures retry, exponential backoff, and job retention policy.
 *
 * Used by:
 * - Submit job producer.
 * - Submit form worker.
 * - Queue monitoring or administration tools.
 *
 * Notes:
 * - Failed jobs are retained for debugging and DLQ handling.
 * - Completed jobs are removed based on age and count limits to control Redis storage usage.
 */

import { Queue } from 'bullmq'
import { redisConnection } from './queue.connection'
import { QUEUE_NAMES } from './queue.constants'

export const submitQueue = new Queue(QUEUE_NAMES.SUBMIT_FORM, {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 3000,
        },
        removeOnComplete: {
            age: 3600,
            count: 1000,
        },
        removeOnFail: false,
    },
})