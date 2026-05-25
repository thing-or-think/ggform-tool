import {
    FORM_FIELD_TYPES,
    FORM_FIELD_UPDATE_FIELDS
} from "../constants/index.js";

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isBoolean(value) {
    return typeof value === "boolean";
}

function isPositiveInteger(value) {
    return Number.isInteger(value) && value >= 0;
}

function validationError(message) {
    throw new Error(`[FORM_FIELD_VALIDATION] ${message}`);
}

function validateOptionsByType(type, options) {
    const optionRequiredTypes = [
        FORM_FIELD_TYPES.RADIO,
        FORM_FIELD_TYPES.CHECKBOX,
        FORM_FIELD_TYPES.SELECT,
        FORM_FIELD_TYPES.LINEAR_SCALE
    ];

    if (!optionRequiredTypes.includes(type)) {
        return;
    }

    if (!options) {
        validationError("options is required for this field type");
    }

    if (
        [
            FORM_FIELD_TYPES.RADIO,
            FORM_FIELD_TYPES.CHECKBOX,
            FORM_FIELD_TYPES.SELECT
        ].includes(type)
    ) {
        if (!Array.isArray(options)) {
            validationError("options must be an array");
        }

        if (options.length === 0) {
            validationError("options cannot be empty");
        }

        options.forEach((option) => {
            if (!isNonEmptyString(option)) {
                validationError("each option must be a non-empty string");
            }
        });
    }

    if (type === FORM_FIELD_TYPES.LINEAR_SCALE) {
        if (typeof options !== "object" || Array.isArray(options)) {
            validationError("linear scale options must be an object");
        }

        if (
            !Number.isInteger(options.min) ||
            !Number.isInteger(options.max)
        ) {
            validationError("linear scale min/max must be integers");
        }

        if (options.min >= options.max) {
            validationError("linear scale min must be less than max");
        }
    }
}

function pickAllowedFields(data, allowedFields) {
    return Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
            return (
                allowedFields.includes(key) &&
                value !== undefined
            );
        })
    );
}

export const formFieldValidator = {
    validateCreate(data) {
        if (!data || typeof data !== "object") {
            validationError("form field data is required");
        }

        if (!isNonEmptyString(data.formId)) {
            validationError("formId is required");
        }

        if (!isNonEmptyString(data.entryId)) {
            validationError("entryId is required");
        }

        if (!isNonEmptyString(data.label)) {
            validationError("label is required");
        }

        if (!isNonEmptyString(data.type)) {
            validationError("type is required");
        }

        if (
            !Object.values(FORM_FIELD_TYPES).includes(data.type)
        ) {
            validationError("invalid form field type");
        }

        if (
            data.required !== undefined &&
            !isBoolean(data.required)
        ) {
            validationError("required must be boolean");
        }

        if (
            data.sortOrder !== undefined &&
            !isPositiveInteger(data.sortOrder)
        ) {
            validationError(
                "sortOrder must be a positive integer"
            );
        }

        validateOptionsByType(data.type, data.options);
    },

    validateUpdate(data) {
        if (!data || typeof data !== "object") {
            validationError("update data is required");
        }

        const allowedData = pickAllowedFields(
            data,
            FORM_FIELD_UPDATE_FIELDS
        );

        if (Object.keys(allowedData).length === 0) {
            validationError("no valid fields to update");
        }

        if (
            allowedData.entryId !== undefined &&
            !isNonEmptyString(allowedData.entryId)
        ) {
            validationError(
                "entryId must be a non-empty string"
            );
        }

        if (
            allowedData.label !== undefined &&
            !isNonEmptyString(allowedData.label)
        ) {
            validationError(
                "label must be a non-empty string"
            );
        }

        if (
            allowedData.type !== undefined &&
            !Object.values(FORM_FIELD_TYPES).includes(
                allowedData.type
            )
        ) {
            validationError("invalid form field type");
        }

        if (
            allowedData.required !== undefined &&
            !isBoolean(allowedData.required)
        ) {
            validationError("required must be boolean");
        }

        if (
            allowedData.sortOrder !== undefined &&
            !isPositiveInteger(allowedData.sortOrder)
        ) {
            validationError(
                "sortOrder must be a positive integer"
            );
        }

        if (
            allowedData.type !== undefined ||
            allowedData.options !== undefined
        ) {
            validateOptionsByType(
                allowedData.type ?? data.type,
                allowedData.options
            );
        }
    },

    validateId(id) {
        if (!isNonEmptyString(id)) {
            validationError("form field id is required");
        }
    },

    validateFormId(formId) {
        if (!isNonEmptyString(formId)) {
            validationError("formId is required");
        }
    },

    validateEntryId(entryId) {
        if (!isNonEmptyString(entryId)) {
            validationError("entryId is required");
        }
    }
};