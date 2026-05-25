export const FORM_FIELD_TYPES = {
    TEXT: "TEXT",
    TEXTAREA: "TEXTAREA",
    NUMBER: "NUMBER",
    DATE: "DATE",
    TIME: "TIME",
    RADIO: "RADIO",
    CHECKBOX: "CHECKBOX",
    SELECT: "SELECT",
    LINEAR_SCALE: "LINEAR_SCALE",
    FILE_UPLOAD: "FILE_UPLOAD",
    UNKNOWN: "UNKNOWN",
    // MULTIPLE_CHOICE_GRID: "MULTIPLE_CHOICE_GRID",
    // CHECKBOX_GRID: "CHECKBOX_GRID",
    // SECTION_BREAK: "SECTION_BREAK",
    // DATE_TIME: "DATE_TIME",
    // MEDIA: "MEDIA",
};

export const FORM_FIELD_RESPONSE_FIELDS = [
    "id",
    "formId",
    "entryId",
    "label",
    "type",
    "required",
    "options",
    "sortOrder",
    "raw",
    "createdAt",
    "updatedAt"
];

export const FORM_FIELD_CREATE_FIELDS = [
    "formId",
    "entryId",
    "label",
    "type",
    "required",
    "options",
    "sortOrder",
    "raw"
];

export const FORM_FIELD_UPDATE_FIELDS = [
    "entryId",
    "label",
    "type",
    "required",
    "options",
    "sortOrder",
    "raw"
];


export const FORM_FIELD_DEFAULT_TYPE = FORM_FIELD_TYPES.UNKNOWN;

export const FORM_FIELD_DEFAULT_REQUIRED = false;