export function pickFields(data, fields) {
    return Object.fromEntries(
        fields
            .filter(field => data[field] !== undefined)
            .map(field => [field, data[field]])
    )
}