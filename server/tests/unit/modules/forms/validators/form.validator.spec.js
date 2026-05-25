import { formValidator } from "../../../../../src/modules/forms/validators/form.validator";
import {
    FORM_PROVIDER,
    FORM_STATUS
} from "../../../../../src/modules/forms/constants";

describe("formValidator", () => {
    const validCreateData = () => ({
        title: "Test Form",
        description: "Test Description",
        formUrl: "https://docs.google.com/forms/test-form",
        provider: FORM_PROVIDER.GOOGLE_FORM,
        providerFormId: "provider-form-id",
        status: FORM_STATUS.ACTIVE
    });

    describe("validateCreate", () => {
        it("should return data when create data is valid", () => {
            const data = validCreateData();

            const result = formValidator.validateCreate(data);

            expect(result).toEqual(data);
        });

        it("should throw error when data is missing", () => {
            expect(() => formValidator.validateCreate())
                .toThrow("Form data is required");
        });

        it("should throw error when title is missing", () => {
            const data = validCreateData();
            delete data.title;

            expect(() => formValidator.validateCreate(data))
                .toThrow("Title is required");
        });

        it("should throw error when formUrl is missing", () => {
            const data = validCreateData();
            delete data.formUrl;

            expect(() => formValidator.validateCreate(data))
                .toThrow("Form URL is required");
        });

        it("should throw error when formUrl is invalid", () => {
            const data = validCreateData();
            data.formUrl = "invalid-url";

            expect(() => formValidator.validateCreate(data))
                .toThrow("Invalid form URL");
        });

        it("should throw error when provider is missing", () => {
            const data = validCreateData();
            delete data.provider;

            expect(() => formValidator.validateCreate(data))
                .toThrow("Provider is required");
        });

        it("should throw error when provider is invalid", () => {
            const data = validCreateData();
            data.provider = "INVALID_PROVIDER";

            expect(() => formValidator.validateCreate(data))
                .toThrow("Invalid form provider");
        });

        it("should throw error when status is invalid", () => {
            const data = validCreateData();
            data.status = "INVALID_STATUS";

            expect(() => formValidator.validateCreate(data))
                .toThrow("Invalid form status");
        });
    });

    describe("validateUpdate", () => {
        it("should return data when update data is valid", () => {
            const data = {
                title: "Updated Form",
                formUrl: "https://docs.google.com/forms/updated-form",
                provider: FORM_PROVIDER.GOOGLE_FORM,
                status: FORM_STATUS.ACTIVE
            };

            const result = formValidator.validateUpdate(data);

            expect(result).toEqual(data);
        });

        it("should throw error when data is missing", () => {
            expect(() => formValidator.validateUpdate())
                .toThrow("Form data is required");
        });

        it("should throw error when title is empty", () => {
            const data = { title: "" };

            expect(() => formValidator.validateUpdate(data))
                .toThrow("Title cannot be empty");
        });

        it("should throw error when formUrl is empty", () => {
            const data = { formUrl: "" };

            expect(() => formValidator.validateUpdate(data))
                .toThrow("Form URL cannot be empty");
        });

        it("should throw error when formUrl is invalid", () => {
            const data = { formUrl: "invalid-url" };

            expect(() => formValidator.validateUpdate(data))
                .toThrow("Invalid form URL");
        });

        it("should throw error when provider is invalid", () => {
            const data = { provider: "INVALID_PROVIDER" };

            expect(() => formValidator.validateUpdate(data))
                .toThrow("Invalid form provider");
        });

        it("should throw error when status is invalid", () => {
            const data = { status: "INVALID_STATUS" };

            expect(() => formValidator.validateUpdate(data))
                .toThrow("Invalid form status");
        });
    });

    describe("validateId", () => {
        it("should return true when id is valid", () => {
            const result = formValidator.validateId("form-id");

            expect(result).toBe(true);
        });

        it("should throw error when id is missing", () => {
            expect(() => formValidator.validateId())
                .toThrow("Form id is required");
        });

        it("should throw error when id is empty", () => {
            expect(() => formValidator.validateId(""))
                .toThrow("Form id is required");
        });
    });
});