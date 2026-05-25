import {
    FORM_PROVIDER,
    FORM_STATUS
} from "../constants/form.constants.js";

function isEmpty(value) {
    return value === undefined ||
        value === null ||
        value === "";
}

function isValidUrl(value) {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

export const formValidator = {
    validateCreate(data) {
        if (!data) {
            throw new Error("Form data is required");
        }

        if (isEmpty(data.title)) {
            throw new Error("Title is required");
        }

        if (isEmpty(data.formUrl)) {
            throw new Error("Form URL is required");
        }

        if (!isValidUrl(data.formUrl)) {
            throw new Error("Invalid form URL");
        }

        if (isEmpty(data.provider)) {
            throw new Error("Provider is required");
        }

        if (
            !Object.values(FORM_PROVIDER).includes(data.provider)
        ) {
            throw new Error("Invalid form provider");
        }

        if (
            data.status &&
            !Object.values(FORM_STATUS).includes(data.status)
        ) {
            throw new Error("Invalid form status");
        }

        return data;
    },

    validateUpdate(data) {
        if (!data) {
            throw new Error("Form data is required");
        }

        if (
            data.title !== undefined &&
            isEmpty(data.title)
        ) {
            throw new Error("Title cannot be empty");
        }

        if (data.formUrl !== undefined) {
            if (isEmpty(data.formUrl)) {
                throw new Error("Form URL cannot be empty");
            }

            if (!isValidUrl(data.formUrl)) {
                throw new Error("Invalid form URL");
            }
        }

        if (
            data.provider !== undefined &&
            !Object.values(FORM_PROVIDER).includes(data.provider)
        ) {
            throw new Error("Invalid form provider");
        }

        if (
            data.status !== undefined &&
            !Object.values(FORM_STATUS).includes(data.status)
        ) {
            throw new Error("Invalid form status");
        }

        return data;
    },

    validateId(id) {
        if (isEmpty(id)) {
            throw new Error("Form id is required");
        }

        return true;
    }
};