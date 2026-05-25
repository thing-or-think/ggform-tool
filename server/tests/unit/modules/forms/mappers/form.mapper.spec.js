import { formMapper } from "../../../../../src/modules/forms/mappers/form.mapper";
import {
    FORM_CREATE_FIELDS,
    FORM_DEFAULT_STATUS,
    FORM_RESPONSE_FIELDS,
    FORM_UPDATE_FIELDS
} from "../../../../../src/modules/forms/constants";

function buildData(fields) {
    return Object.fromEntries(
        fields.map(field => [field, `${field}-value`])
    );
}

describe("formMapper", () => {
    describe("toResponse", () => {
        it("should return null if form is null", () => {
            expect(formMapper.toResponse(null)).toBeNull();
        });

        it("should pick only FORM_RESPONSE_FIELDS", () => {
            const form = {
                ...buildData(FORM_RESPONSE_FIELDS),
                extraField: "should be ignored"
            };

            const result = formMapper.toResponse(form);

            expect(Object.keys(result).sort()).toEqual(
                FORM_RESPONSE_FIELDS.sort()
            );

            expect(result.extraField).toBeUndefined();
        });
    });

    describe("toCreateData", () => {
        it("should pick only FORM_CREATE_FIELDS", () => {
            const data = {
                ...buildData(FORM_CREATE_FIELDS),
                extraField: "should be ignored"
            };

            delete data.status;

            const result = formMapper.toCreateData(data);

            expect(Object.keys(result).sort()).toEqual(
                FORM_CREATE_FIELDS.sort()
            );

            expect(result.extraField).toBeUndefined();
        });

        it("should set default status if status is not provided", () => {
            const data = buildData(FORM_CREATE_FIELDS);

            delete data.status;

            const result = formMapper.toCreateData(data);

            expect(result.status).toBe(FORM_DEFAULT_STATUS);
        });

        it("should keep provided status", () => {
            const data = {
                ...buildData(FORM_CREATE_FIELDS),
                status: "ACTIVE"
            };

            const result = formMapper.toCreateData(data);

            expect(result.status).toBe("ACTIVE");
        });
    });

    describe("toUpdateData", () => {
        it("should pick only FORM_UPDATE_FIELDS", () => {
            const data = {
                ...buildData(FORM_UPDATE_FIELDS),
                id: "should be ignored",
                formUrl: "should be ignored",
                createdAt: "should be ignored"
            };

            const result = formMapper.toUpdateData(data);

            expect(Object.keys(result).sort()).toEqual(
                FORM_UPDATE_FIELDS.sort()
            );

            expect(result.id).toBeUndefined();
            expect(result.formUrl).toBeUndefined();
            expect(result.createdAt).toBeUndefined();
        });
    });
});