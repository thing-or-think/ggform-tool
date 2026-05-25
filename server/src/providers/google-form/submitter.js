/**
 * Google Form Submitter
 *
 * Responsibility:
 *  - Submit normalized answers to a Google Form submit endpoint.
 *  - Convert answer payload into application/x-www-form-urlencoded form data.
 *
 * Used by:
 *  - Google Form provider layer.
 *  - Submission service or worker when processing form submission jobs.
 *
 * Notes:
 *  - This module assumes answers are already validated and mapped to provider field names.
 *  - Retry, deduplication, and job status handling should be managed outside this module.
 */

import axios from 'axios'

export async function submit({ submitUrl, answers }) {
    if (!submitUrl) {
        throw new Error('Submit URL is required')
    }

    if (!answers || typeof answers !== 'object') {
        throw new Error('Answers must be an object')
    }

    const formData = new URLSearchParams()

    Object.entries(answers).forEach(([key, value]) => {
        formData.append(key, value)
    })

    const response = await axios.post(submitUrl, formData.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    return {
        success: response.status >= 200 && response.status < 300,
        statusCode: response.status
    }
}
