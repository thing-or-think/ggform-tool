/**
 * Google Form Normalizer
 *
 * Responsibility:
 *  - Convert raw extracted Google Form data into the internal form schema.
 *  - Normalize provider-specific field types into application-supported field types.
 *
 * Used by:
 *  - Google Form provider layer.
 *  - Form scanning workflow after extraction and structure validation.
 *
 * Notes:
 *  - This module should not fetch, parse, or submit form data.
 *  - Required-field detection is currently not extracted and defaults to false.
 */

const FIELD_TYPE_MAP = {
    text: 'text',
    email: 'email',
    number: 'number',
    textarea: 'textarea',
    select: 'select',
    radio: 'radio',
    checkbox: 'checkbox',
    hidden: 'hidden'
}

export function normalize(rawData) {
    return {
        title: rawData.title,
        submitUrl: rawData.action,
        fields: rawData.fields.map((field) => ({
            id: field.name,
            name: field.name,
            type: normalizeFieldType(field.type),
            required: false
        }))
    }
}

function normalizeFieldType(type) {
    return FIELD_TYPE_MAP[type] || 'text'
}