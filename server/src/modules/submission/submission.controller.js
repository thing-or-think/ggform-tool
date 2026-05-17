/**
 * Submission Controller
 *
 * Responsibility:
 * - Handles HTTP requests for creating form submissions.
 * - Queues submission payloads for asynchronous background processing.
 *
 * Used by:
 * - Submission routes
 * - API clients
 * - Frontend submission flow
 *
 * Notes:
 * - This controller only handles request/response orchestration.
 * - Submission processing should be handled by queue workers.
 */

import crypto from 'crypto'
import { addSubmitJob } from '../../infrastructure/queue/submit.producer.js'
import { JOB_STATUS } from '../../shared/constants/jobStatus.js'

export async function createSubmission(req, res, next) {
    try {
        const { formId, payload } = req.body

        const submission = {
            id: crypto.randomUUID(),
            formId,
            status: JOB_STATUS.QUEUED
        }

        const job = await addSubmitJob({
            submissionId: submission.id,
            formId,
            payload
        })

        return res.status(202).json({
            success: true,
            message: 'Submission queued successfully',
            data: {
                submissionId: submission.id,
                jobId: job.id,
                status: submission.status
            }
        })
    } catch (error) {
        next(error)
    }
}