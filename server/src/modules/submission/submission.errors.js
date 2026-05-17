/**
 * Submission Errors
 *
 * Responsibility:
 * - Defines domain-specific errors for the submission workflow.
 * - Provides retry metadata for queue workers and error handlers.
 *
 * Used by:
 * - Submission services
 * - Queue workers
 * - Global error middleware
 *
 * Notes:
 * - Non-retryable errors usually indicate invalid input or missing data.
 * - Retryable errors usually come from external submit failures.
 */

export class SubmissionNotFoundError extends Error {
    constructor(submissionId) {
        super(`Submission not found: ${submissionId}`)
        this.name = 'SubmissionNotFoundError'
        this.isRetryable = false
    }
}

export class InvalidSubmissionPayloadError extends Error {
    constructor(message = 'Invalid submission payload') {
        super(message)
        this.name = 'InvalidSubmissionPayloadError'
        this.isRetryable = false
    }
}

export class ExternalSubmitError extends Error {
    constructor(message = 'External submit failed') {
        super(message)
        this.name = 'ExternalSubmitError'
        this.isRetryable = true
    }
}