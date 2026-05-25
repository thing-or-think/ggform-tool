import {
    FORM_CREATE_FIELDS,
    FORM_DEFAULT_STATUS,
    FORM_RESPONSE_FIELDS,
    FORM_UPDATE_FIELDS
} from "../constants/form.constants.js";

import { pickFields } from "../../../shared/utils/pick-fields.js";

export const formMapper = {
    toResponse(form) {
        if (!form) {
            return null
        }

        return pickFields(
            form,
            FORM_RESPONSE_FIELDS
        );
    },

    toCreateData(data) {
        return pickFields(
            {
                ...data,
                status:
                    data.status ??
                    FORM_DEFAULT_STATUS
            },
            FORM_CREATE_FIELDS
        )
    },

    toUpdateData(data) {
        return pickFields(
            data,
            FORM_UPDATE_FIELDS
        )
    }
}

