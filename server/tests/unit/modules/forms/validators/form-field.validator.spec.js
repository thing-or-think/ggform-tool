import { formFieldValidator } from "../../../../../src/modules/forms/validators/form-field.validator.js";
import { FORM_FIELD_TYPES } from "../../../../../src/modules/forms/constants";

describe("formFieldValidator", () => {
    describe("validateCreate", () => {
        const validData = {
            formId: "form-id-1",
            entryId: "entry-id-1",
            label: "Full name",
            type: FORM_FIELD_TYPES.TEXT,
            required: true,
            sortOrder: 0
        };

        it("should pass with valid data", () => {
            expect(() => {
                formFieldValidator.validateCreate(validData);
            }).not.toThrow();
        });

        it("should throw if data is missing", () => {
            expect(() => {
                formFieldValidator.validateCreate();
            }).toThrow("[FORM_FIELD_VALIDATION] form field data is required");
        });

        it("should throw if formId is missing", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    formId: ""
                });
            }).toThrow("[FORM_FIELD_VALIDATION] formId is required");
        });

        it("should throw if entryId is missing", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    entryId: ""
                });
            }).toThrow("[FORM_FIELD_VALIDATION] entryId is required");
        });

        it("should throw if label is missing", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    label: ""
                });
            }).toThrow("[FORM_FIELD_VALIDATION] label is required");
        });

        it("should throw if type is missing", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    type: ""
                });
            }).toThrow("[FORM_FIELD_VALIDATION] type is required");
        });

        it("should throw if type is invalid", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    type: "INVALID_TYPE"
                });
            }).toThrow("[FORM_FIELD_VALIDATION] invalid form field type");
        });

        it("should throw if required is not boolean", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    required: "true"
                });
            }).toThrow("[FORM_FIELD_VALIDATION] required must be boolean");
        });

        it("should throw if sortOrder is not positive integer", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    sortOrder: -1
                });
            }).toThrow("[FORM_FIELD_VALIDATION] sortOrder must be a positive integer");
        });

        it("should pass with RADIO type and valid options", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    type: FORM_FIELD_TYPES.RADIO,
                    options: ["A", "B", "C"]
                });
            }).not.toThrow();
        });

        it("should throw if RADIO options is missing", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    type: FORM_FIELD_TYPES.RADIO
                });
            }).toThrow("[FORM_FIELD_VALIDATION] options is required for this field type");
        });

        it("should throw if RADIO options is not array", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    type: FORM_FIELD_TYPES.RADIO,
                    options: {}
                });
            }).toThrow("[FORM_FIELD_VALIDATION] options must be an array");
        });

        it("should throw if RADIO options is empty", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    type: FORM_FIELD_TYPES.RADIO,
                    options: []
                });
            }).toThrow("[FORM_FIELD_VALIDATION] options cannot be empty");
        });

        it("should throw if RADIO option item is empty", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    type: FORM_FIELD_TYPES.RADIO,
                    options: ["A", ""]
                });
            }).toThrow("[FORM_FIELD_VALIDATION] each option must be a non-empty string");
        });

        it("should pass with LINEAR_SCALE and valid options", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    type: FORM_FIELD_TYPES.LINEAR_SCALE,
                    options: {
                        min: 1,
                        max: 5
                    }
                });
            }).not.toThrow();
        });

        it("should throw if LINEAR_SCALE options is not object", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    type: FORM_FIELD_TYPES.LINEAR_SCALE,
                    options: []
                });
            }).toThrow("[FORM_FIELD_VALIDATION] linear scale options must be an object");
        });

        it("should throw if LINEAR_SCALE min/max is not integer", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    type: FORM_FIELD_TYPES.LINEAR_SCALE,
                    options: {
                        min: 1,
                        max: "5"
                    }
                });
            }).toThrow("[FORM_FIELD_VALIDATION] linear scale min/max must be integers");
        });

        it("should throw if LINEAR_SCALE min >= max", () => {
            expect(() => {
                formFieldValidator.validateCreate({
                    ...validData,
                    type: FORM_FIELD_TYPES.LINEAR_SCALE,
                    options: {
                        min: 5,
                        max: 5
                    }
                });
            }).toThrow("[FORM_FIELD_VALIDATION] linear scale min must be less than max");
        });
    });

    describe("validateUpdate", () => {
        it("should pass with valid update data", () => {
            expect(() => {
                formFieldValidator.validateUpdate({
                    label: "New label"
                });
            }).not.toThrow();
        });

        it("should throw if update data is missing", () => {
            expect(() => {
                formFieldValidator.validateUpdate();
            }).toThrow("[FORM_FIELD_VALIDATION] update data is required");
        });

        it("should throw if no valid fields to update", () => {
            expect(() => {
                formFieldValidator.validateUpdate({
                    unknownField: "abc"
                });
            }).toThrow("[FORM_FIELD_VALIDATION] no valid fields to update");
        });

        it("should throw if entryId is empty", () => {
            expect(() => {
                formFieldValidator.validateUpdate({
                    entryId: ""
                });
            }).toThrow("[FORM_FIELD_VALIDATION] entryId must be a non-empty string");
        });

        it("should throw if label is empty", () => {
            expect(() => {
                formFieldValidator.validateUpdate({
                    label: ""
                });
            }).toThrow("[FORM_FIELD_VALIDATION] label must be a non-empty string");
        });

        it("should throw if type is invalid", () => {
            expect(() => {
                formFieldValidator.validateUpdate({
                    type: "INVALID_TYPE"
                });
            }).toThrow("[FORM_FIELD_VALIDATION] invalid form field type");
        });

        it("should throw if required is not boolean", () => {
            expect(() => {
                formFieldValidator.validateUpdate({
                    required: "false"
                });
            }).toThrow("[FORM_FIELD_VALIDATION] required must be boolean");
        });

        it("should throw if sortOrder is invalid", () => {
            expect(() => {
                formFieldValidator.validateUpdate({
                    sortOrder: -1
                });
            }).toThrow("[FORM_FIELD_VALIDATION] sortOrder must be a positive integer");
        });

        it("should pass when updating RADIO with valid options", () => {
            expect(() => {
                formFieldValidator.validateUpdate({
                    type: FORM_FIELD_TYPES.RADIO,
                    options: ["Yes", "No"]
                });
            }).not.toThrow();
        });

        it("should throw when updating RADIO without options", () => {
            expect(() => {
                formFieldValidator.validateUpdate({
                    type: FORM_FIELD_TYPES.RADIO
                });
            }).toThrow("[FORM_FIELD_VALIDATION] options is required for this field type");
        });

        it("should pass when updating LINEAR_SCALE with valid options", () => {
            expect(() => {
                formFieldValidator.validateUpdate({
                    type: FORM_FIELD_TYPES.LINEAR_SCALE,
                    options: {
                        min: 1,
                        max: 10
                    }
                });
            }).not.toThrow();
        });
    });

    describe("validateId", () => {
        it("should pass with valid id", () => {
            expect(() => {
                formFieldValidator.validateId("field-id-1");
            }).not.toThrow();
        });

        it("should throw if id is empty", () => {
            expect(() => {
                formFieldValidator.validateId("");
            }).toThrow("[FORM_FIELD_VALIDATION] form field id is required");
        });
    });

    describe("validateFormId", () => {
        it("should pass with valid formId", () => {
            expect(() => {
                formFieldValidator.validateFormId("form-id-1");
            }).not.toThrow();
        });

        it("should throw if formId is empty", () => {
            expect(() => {
                formFieldValidator.validateFormId("");
            }).toThrow("[FORM_FIELD_VALIDATION] formId is required");
        });
    });

    describe("validateEntryId", () => {
        it("should pass with valid entryId", () => {
            expect(() => {
                formFieldValidator.validateEntryId("entry-id-1");
            }).not.toThrow();
        });

        it("should throw if entryId is empty", () => {
            expect(() => {
                formFieldValidator.validateEntryId("");
            }).toThrow("[FORM_FIELD_VALIDATION] entryId is required");
        });
    });
});