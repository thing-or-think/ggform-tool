export const FORM_PROVIDER = {
    GOOGLE_FORM: "GOOGLE_FORM",
};

export const FORM_STATUS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    ERROR: "ERROR",
};

export const FORM_RESPONSE_FIELDS = [
    "id",
    "title",
    "description",
    "formUrl",
    "provider",
    "providerFormId",
    "status",
    "scanError",
    "createdAt",
    "updatedAt"
];

export const FORM_CREATE_FIELDS = [
    "title",
    "description",
    "formUrl",
    "provider",
    "providerFormId",
    "status"
];

export const FORM_UPDATE_FIELDS = [
    "title",
    "description",
    "provider",
    "providerFormId",
    "status",
    "scanError"
];

export const FORM_DEFAULT_STATUS = FORM_STATUS.ACTIVE;