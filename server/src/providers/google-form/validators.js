/**
 * Google Form Structure Validator
 *
 * Responsibility:
 *  - Validate extracted Google Form data before normalization or submission.
 *  - Ensure required form metadata and field structure are available.
 *
 * Used by:
 *  - Google Form provider layer.
 *  - Form scanning workflow after HTML extraction.
 *
 * Notes:
 *  - This module only validates raw extracted structure.
 *  - Business validation and field normalization should be handled in separate modules.
 */

export function validateStructure(data) {
    if (!data) {
        throw new Error('Google Form data is empty')
    }

    if (!data.action) {
        throw new Error('Google Form submit action is missing')
    }

    if (!Array.isArray(data.fields)) {
        throw new Error('Google Form fields must be an array')
    }

    if (data.fields.length === 0) {
        throw new Error('Google Form has no fields')
    }
}
