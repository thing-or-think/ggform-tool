/**
 * Google Form Extractor
 *
 * Responsibility:
 * - Fetches Google Form HTML from a given form URL.
 * - Extracts raw form metadata, submit action URL, and input field structure.
 *
 * Used by:
 * - Google Form provider layer
 * - Form scanning workflow before validation and normalization
 *
 * Notes:
 * - This module only extracts raw HTML-based form structure.
 * - Field validation and type normalization must be handled by separate provider modules.
 * - Network error handling should be delegated to the service/controller error pipeline.
 */

import axios from 'axios'
import * as cheerio from 'cheerio'

export async function extract(formUrl) {
    const response = await axios.get(formUrl)
    const html = response.data

    const $ = cheerio.load(html)

    const title = $('title').text().trim()
    const action = $('form').attr('action')

    const fields = []

    $('input, textarea, select').each((_, element) => {
        const name = $(element).attr('name')
        const type = $(element).attr('type') || element.name

        if (!name) return

        fields.push({
            name,
            type,
            rawTag: element.name,
        })
    })

    return {
        title,
        action,
        fields,
    }
}