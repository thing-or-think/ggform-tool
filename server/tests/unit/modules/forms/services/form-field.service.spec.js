import { jest } from "@jest/globals";

const formFieldRepository = {
    create: jest.fn(),
    createMany: jest.fn(),
    findById: jest.fn(),
    findByFormId: jest.fn(),
    findByEntryId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteByFormId: jest.fn()
};

const formFieldValidator = {
    validateCreate: jest.fn(),
    validateUpdate: jest.fn()
};

const formFieldMapper = {
    toCreateData: jest.fn(),
    toUpdateData: jest.fn(),
    toResponse: jest.fn()
};

jest.unstable_mockModule(
    "../../../../../src/modules/forms/repositories/form-field.repository.js",
    () => ({
        formFieldRepository
    })
);

jest.unstable_mockModule(
    "../../../../../src/modules/forms/validators/form-field.validator.js",
    () => ({
        formFieldValidator
    })
);

jest.unstable_mockModule(
    "../../../../../src/modules/forms/mappers/form-field.mapper.js",
    () => ({
        formFieldMapper
    })
);

const { formFieldService } = await import(
    "../../../../../src/modules/forms/services/form-field.service.js"
);

describe("formFieldService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should validate, map, create and return response", async () => {
            const data = { label: "Name" };
            const createData = { label: "Name" };
            const createdField = { id: "field-1", label: "Name" };
            const response = { id: "field-1", label: "Name" };

            formFieldMapper.toCreateData.mockReturnValue(createData);
            formFieldRepository.create.mockResolvedValue(createdField);
            formFieldMapper.toResponse.mockReturnValue(response);

            const result = await formFieldService.create(data);

            expect(formFieldValidator.validateCreate).toHaveBeenCalledWith(data);
            expect(formFieldMapper.toCreateData).toHaveBeenCalledWith(data);
            expect(formFieldRepository.create).toHaveBeenCalledWith(createData);
            expect(formFieldMapper.toResponse).toHaveBeenCalledWith(createdField);
            expect(result).toEqual(response);
        });
    });

    describe("createMany", () => {
        it("should throw error if fields is not an array", async () => {
            await expect(
                formFieldService.createMany(null)
            ).rejects.toThrow("Form fields must be an array");
        });

        it("should validate, map and create many fields", async () => {
            const fields = [
                { label: "Name" },
                { label: "Email" }
            ];

            const createData = [
                { label: "Name" },
                { label: "Email" }
            ];

            const resultData = { count: 2 };

            formFieldMapper.toCreateData
                .mockReturnValueOnce(createData[0])
                .mockReturnValueOnce(createData[1]);

            formFieldRepository.createMany.mockResolvedValue(resultData);

            const result = await formFieldService.createMany(fields);

            expect(formFieldValidator.validateCreate).toHaveBeenCalledTimes(2);
            expect(formFieldValidator.validateCreate).toHaveBeenNthCalledWith(1, fields[0]);
            expect(formFieldValidator.validateCreate).toHaveBeenNthCalledWith(2, fields[1]);

            expect(formFieldMapper.toCreateData).toHaveBeenCalledTimes(2);
            expect(formFieldRepository.createMany).toHaveBeenCalledWith(createData);
            expect(result).toEqual(resultData);
        });
    });

    describe("findById", () => {
        it("should throw error if id is missing", async () => {
            await expect(
                formFieldService.findById()
            ).rejects.toThrow("Form field id is required");
        });

        it("should throw error if field is not found", async () => {
            formFieldRepository.findById.mockResolvedValue(null);

            await expect(
                formFieldService.findById("field-1")
            ).rejects.toThrow("Form field not found");
        });

        it("should return mapped field response", async () => {
            const field = { id: "field-1", label: "Name" };
            const response = { id: "field-1", label: "Name" };

            formFieldRepository.findById.mockResolvedValue(field);
            formFieldMapper.toResponse.mockReturnValue(response);

            const result = await formFieldService.findById("field-1");

            expect(formFieldRepository.findById).toHaveBeenCalledWith("field-1");
            expect(formFieldMapper.toResponse).toHaveBeenCalledWith(field);
            expect(result).toEqual(response);
        });
    });

    describe("findByFormId", () => {
        it("should throw error if formId is missing", async () => {
            await expect(
                formFieldService.findByFormId()
            ).rejects.toThrow("Form id is required");
        });

        it("should return mapped fields", async () => {
            const fields = [
                { id: "field-1", label: "Name" },
                { id: "field-2", label: "Email" }
            ];

            const responses = [
                { id: "field-1", label: "Name" },
                { id: "field-2", label: "Email" }
            ];

            formFieldRepository.findByFormId.mockResolvedValue(fields);

            formFieldMapper.toResponse
                .mockReturnValueOnce(responses[0])
                .mockReturnValueOnce(responses[1]);

            const result = await formFieldService.findByFormId("form-1");

            expect(formFieldRepository.findByFormId).toHaveBeenCalledWith("form-1");
            expect(formFieldMapper.toResponse).toHaveBeenCalledTimes(2);
            expect(result).toEqual(responses);
        });
    });

    describe("findByEntryId", () => {
        it("should throw error if formId is missing", async () => {
            await expect(
                formFieldService.findByEntryId(null, "entry-1")
            ).rejects.toThrow("Form id is required");
        });

        it("should throw error if entryId is missing", async () => {
            await expect(
                formFieldService.findByEntryId("form-1")
            ).rejects.toThrow("Entry id is required");
        });

        it("should return mapped field response", async () => {
            const field = { id: "field-1", entryId: "entry-1" };
            const response = { id: "field-1", entryId: "entry-1" };

            formFieldRepository.findByEntryId.mockResolvedValue(field);
            formFieldMapper.toResponse.mockReturnValue(response);

            const result = await formFieldService.findByEntryId(
                "form-1",
                "entry-1"
            );

            expect(formFieldRepository.findByEntryId).toHaveBeenCalledWith(
                "form-1",
                "entry-1"
            );
            expect(formFieldMapper.toResponse).toHaveBeenCalledWith(field);
            expect(result).toEqual(response);
        });
    });

    describe("update", () => {
        it("should throw error if id is missing", async () => {
            await expect(
                formFieldService.update(null, {})
            ).rejects.toThrow("Form field id is required");
        });

        it("should validate, map, update and return response", async () => {
            const data = { label: "New Name" };
            const updateData = { label: "New Name" };
            const updatedField = { id: "field-1", label: "New Name" };
            const response = { id: "field-1", label: "New Name" };

            formFieldMapper.toUpdateData.mockReturnValue(updateData);
            formFieldRepository.update.mockResolvedValue(updatedField);
            formFieldMapper.toResponse.mockReturnValue(response);

            const result = await formFieldService.update("field-1", data);

            expect(formFieldValidator.validateUpdate).toHaveBeenCalledWith(data);
            expect(formFieldMapper.toUpdateData).toHaveBeenCalledWith(data);
            expect(formFieldRepository.update).toHaveBeenCalledWith(
                "field-1",
                updateData
            );
            expect(formFieldMapper.toResponse).toHaveBeenCalledWith(updatedField);
            expect(result).toEqual(response);
        });
    });

    describe("delete", () => {
        it("should throw error if id is missing", async () => {
            await expect(
                formFieldService.delete()
            ).rejects.toThrow("Form field id is required");
        });

        it("should delete field", async () => {
            const deletedField = { id: "field-1" };

            formFieldRepository.delete.mockResolvedValue(deletedField);

            const result = await formFieldService.delete("field-1");

            expect(formFieldRepository.delete).toHaveBeenCalledWith("field-1");
            expect(result).toEqual(deletedField);
        });
    });

    describe("deleteByFormId", () => {
        it("should throw error if formId is missing", async () => {
            await expect(
                formFieldService.deleteByFormId()
            ).rejects.toThrow("Form id is required");
        });

        it("should delete fields by formId", async () => {
            const deleteResult = { count: 2 };

            formFieldRepository.deleteByFormId.mockResolvedValue(deleteResult);

            const result = await formFieldService.deleteByFormId("form-1");

            expect(formFieldRepository.deleteByFormId).toHaveBeenCalledWith("form-1");
            expect(result).toEqual(deleteResult);
        });
    });

    describe("replaceByFormId", () => {
        it("should throw error if formId is missing", async () => {
            await expect(
                formFieldService.replaceByFormId(null, [])
            ).rejects.toThrow("Form id is required");
        });

        it("should throw error if fields is not an array", async () => {
            await expect(
                formFieldService.replaceByFormId("form-1", null)
            ).rejects.toThrow("Form fields must be an array");
        });

        it("should delete old fields and create new fields", async () => {
            const fields = [
                { label: "Name" },
                { label: "Email" }
            ];

            const fieldsWithFormId = [
                { label: "Name", formId: "form-1" },
                { label: "Email", formId: "form-1" }
            ];

            const createData = [
                { label: "Name", formId: "form-1" },
                { label: "Email", formId: "form-1" }
            ];

            const createResult = { count: 2 };

            formFieldMapper.toCreateData
                .mockReturnValueOnce(createData[0])
                .mockReturnValueOnce(createData[1]);

            formFieldRepository.deleteByFormId.mockResolvedValue({ count: 2 });
            formFieldRepository.createMany.mockResolvedValue(createResult);

            const result = await formFieldService.replaceByFormId(
                "form-1",
                fields
            );

            expect(formFieldValidator.validateCreate).toHaveBeenCalledTimes(2);
            expect(formFieldValidator.validateCreate).toHaveBeenNthCalledWith(
                1,
                fieldsWithFormId[0]
            );
            expect(formFieldValidator.validateCreate).toHaveBeenNthCalledWith(
                2,
                fieldsWithFormId[1]
            );

            expect(formFieldMapper.toCreateData).toHaveBeenCalledTimes(2);
            expect(formFieldMapper.toCreateData).toHaveBeenNthCalledWith(
                1,
                fieldsWithFormId[0]
            );
            expect(formFieldMapper.toCreateData).toHaveBeenNthCalledWith(
                2,
                fieldsWithFormId[1]
            );

            expect(formFieldRepository.deleteByFormId).toHaveBeenCalledWith("form-1");
            expect(formFieldRepository.createMany).toHaveBeenCalledWith(createData);
            expect(result).toEqual(createResult);
        });
    });
});