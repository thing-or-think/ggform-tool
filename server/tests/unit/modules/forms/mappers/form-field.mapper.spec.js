import {
    FORM_FIELD_CREATE_FIELDS,
    FORM_FIELD_DEFAULT_REQUIRED,
    FORM_FIELD_DEFAULT_TYPE,
    FORM_FIELD_RESPONSE_FIELDS,
    FORM_FIELD_UPDATE_FIELDS
} from "../../../../../src/modules/forms/constants";

import { formFieldMapper } from "../../../../../src/modules/forms/mappers/form-field.mapper";

function buildData(fields) {
    return Object.fromEntries(
        fields.map(field => [field, `${field}-value`])
    );
}

describe("formFieldMapper", () => {
    describe("toResponse", () => {
        it("should return null if field is null", () => {
            expect(formFieldMapper.toResponse(null)).toBeNull();
        });

        it("should pick only FORM_FIELD_RESPONSE_FIELDS", () => {
            const field = {
                ...buildData(FORM_FIELD_RESPONSE_FIELDS),
                extraField: "should be ignored"
            };

            const result = formFieldMapper.toResponse(field);

            expect(Object.keys(result).sort()).toEqual(
                [...FORM_FIELD_RESPONSE_FIELDS].sort()
            );

            expect(result.extraField).toBeUndefined();
        });
    });

    describe("toCreateData", () => {
        it("should pick only FORM_FIELD_CREATE_FIELDS", () => {
            const data = {
                ...buildData(FORM_FIELD_CREATE_FIELDS),
                extraField: "should be ignored"
            };

            const result = formFieldMapper.toCreateData(data);

            expect(Object.keys(result).sort()).toEqual(
                [...FORM_FIELD_CREATE_FIELDS].sort()
            );

            expect(result.extraField).toBeUndefined();
        });

        it("should set default type if type is not provided", () => {
            const data = buildData(FORM_FIELD_CREATE_FIELDS);

            delete data.type;

            const result = formFieldMapper.toCreateData(data);

            expect(result.type).toBe(FORM_FIELD_DEFAULT_TYPE);
        });

        it("should set default required if required is not provided", () => {
            const data = buildData(FORM_FIELD_CREATE_FIELDS);

            delete data.required;

            const result = formFieldMapper.toCreateData(data);

            expect(result.required).toBe(FORM_FIELD_DEFAULT_REQUIRED);
        });

        it("should keep provided type and required", () => {
            const data = {
                ...buildData(FORM_FIELD_CREATE_FIELDS),
                type: "TEXT",
                required: true
            };

            const result = formFieldMapper.toCreateData(data);

            expect(result.type).toBe("TEXT");
            expect(result.required).toBe(true);
        });
    });

    describe("toUpdateData", () => {
        it("should pick only FORM_FIELD_UPDATE_FIELDS", () => {
            const data = {
                ...buildData(FORM_FIELD_UPDATE_FIELDS),
                formId: "should be ignored",
                createdAt: "should be ignored",
                extraField: "should be ignored"
            };

            const result = formFieldMapper.toUpdateData(data);

            expect(Object.keys(result).sort()).toEqual(
                [...FORM_FIELD_UPDATE_FIELDS].sort()
            );

            expect(result.formId).toBeUndefined();
            expect(result.createdAt).toBeUndefined();
            expect(result.extraField).toBeUndefined();
        });

        it("should ignore undefined fields", () => {
            const data = {
                label: "Name",
                type: undefined,
                required: false
            };

            const result = formFieldMapper.toUpdateData(data);

            expect(result).toEqual({
                label: "Name",
                required: false
            });
        });
    });
});