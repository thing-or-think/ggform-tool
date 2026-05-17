/**
 * Queue Constants
 *
 * Responsibility:
 * - Defines shared queue and job names used across BullMQ infrastructure.
 * - Prevents hard-coded queue identifiers across producers, workers, and DLQ handlers.
 *
 * Used by:
 * - Queue producers.
 * - Queue workers.
 * - Dead letter queue handlers.
 *
 * Notes:
 * - Keep queue and job names stable because BullMQ uses them as Redis identifiers.
 */

export const QUEUE_NAMES = {
    SUBMIT_FORM: 'form-submit-queue',
    SUBMIT_FORM_DLQ: 'form-submit-dlq',
}

export const JOB_NAMES = {
    SUBMIT_FORM: 'submit-form',
}