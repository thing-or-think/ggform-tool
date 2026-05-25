/**
 * Google Form Provider
 *
 * Responsibility:
 * - Exposes the public provider API for scanning and submitting Google Forms.
 * - Orchestrates extraction, structure validation, normalization, and submission.
 *
 * Used by:
 * - Form service when scanning external Google Form URLs
 * - Submission service or worker when submitting answers to Google Forms
 *
 * Notes:
 * - This module acts as the Google Form provider entry point.
 * - Keep provider-specific workflow here.
 * - Controller and service layers should not call extractor, validator, normalizer, or submitter directly.
 */

import { extract } from './extractor'
import { validateStructure } from './validators'
import { normalize } from './normalizer'
import { submit as submitForm } from './submitter'

export async function scan(formUrl) {
    const rawData = await extract(formUrl)

    validateStructure(rawData)

    return normalize(rawData)
}

export async function submit(payload) {
    return submitForm(payload)
}