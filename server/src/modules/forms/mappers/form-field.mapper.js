import {
    FORM_FIELD_CREATE_FIELDS,
    FORM_FIELD_DEFAULT_REQUIRED,
    FORM_FIELD_DEFAULT_TYPE,
    FORM_FIELD_RESPONSE_FIELDS,
    FORM_FIELD_UPDATE_FIELDS
} from "../constants/form-field.constants.js";

import { pickFields } from "../../../shared/utils/pick-fields.js";

function normalizeOptions(options) {
    if (!Array.isArray(options)) {
        return [];
    }

    return options
        .map(option => {
            if (typeof option === "string") {
                return options;
            }

            return option?.value;
        })
        .filter(option => option !== undefined && option !== null);
}

export const formFieldMapper = {
    toResponse(field) {
        if (!field) {
            return null;
        }

        return pickFields(
            {
                ...field,
                options: normalizeOptions(field.options)
            },
            FORM_FIELD_RESPONSE_FIELDS,
        );
    },

    toCreateData(data) {
        return pickFields(
            {
                ...data,
                type:
                    data.type ??
                    FORM_FIELD_DEFAULT_TYPE,

                required:
                    data.required ??
                    FORM_FIELD_DEFAULT_REQUIRED
            },
            FORM_FIELD_CREATE_FIELDS
        );
    },

    toUpdateData(data) {
        return pickFields(
            data,
            FORM_FIELD_UPDATE_FIELDS
        );
    }
};