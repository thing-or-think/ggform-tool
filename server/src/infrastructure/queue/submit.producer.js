/**
 * Submit Job Producer
 *
 * Responsibility:
 * - Adds form submission jobs to the submit queue.
 * - Ensures each submission has a deterministic job ID for idempotent enqueueing.
 *
 * Used by:
 * - Submission service.
 * - API flows that trigger asynchronous form submission processing.
 *
 * Notes:
 * - `payload.submissionId` must be available before enqueueing.
 * - Retry/backoff behavior should be configured at the queue level or worker level.
 */

import { submitQueue } from './submit.queue'
import { JOB_NAMES } from './queue.constants'

export async function addSubmitJob(payload) {
    return submitQueue.add(JOB_NAMES.SUBMIT_FORM, payload, {
        jobId: `submit:${payload.submissionId}`,
    })
}