import { jest } from "@jest/globals";

jest.unstable_mockModule(
    "../../../../../src/modules/forms/repositories/form.repository.js",
    () => ({
        formRepository: {
            create: jest.fn(),
            findById: jest.fn(),
            findByUrl: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            upsertByUrl: jest.fn()
        }
    })
);

jest.unstable_mockModule(
    "../../../../../src/modules/forms/repositories/form-field.repository.js",
    () => ({
        formFieldRepository: {
            deleteByFormId: jest.fn()
        }
    })
);

jest.unstable_mockModule(
    "../../../../../src/modules/forms/validators/form.validator.js",
    () => ({
        formValidator: {
            validateCreate: jest.fn(),
            validateUpdate: jest.fn()
        }
    })
);

jest.unstable_mockModule(
    "../../../../../src/modules/forms/mappers/form.mapper.js",
    () => ({
        formMapper: {
            toCreateData: jest.fn(),
            toUpdateData: jest.fn(),
            toResponse: jest.fn()
        }
    })
);

const { formService } = await import(
    "../../../../../src/modules/forms/services/form.service.js"
);

const { formRepository } = await import(
    "../../../../../src/modules/forms/repositories/form.repository.js"
);

const { formFieldRepository } = await import(
    "../../../../../src/modules/forms/repositories/form-field.repository.js"
);

const { formValidator } = await import(
    "../../../../../src/modules/forms/validators/form.validator.js"
);

const { formMapper } = await import(
    "../../../../../src/modules/forms/mappers/form.mapper.js"
);

describe("formService", () => {
    const inputData = {
        title: "Test Form",
        description: "Test Description",
        formUrl: "https://docs.google.com/forms/d/e/test/viewform",
        provider: "GOOGLE_FORM",
        providerFormId: "test"
    };

    const createData = {
        title: "Test Form",
        description: "Test Description",
        formUrl: "https://docs.google.com/forms/d/e/test/viewform",
        provider: "GOOGLE_FORM",
        providerFormId: "test",
        status: "ACTIVE"
    };

    const dbForm = {
        id: "form-id",
        ...createData,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const responseForm = {
        id: "form-id",
        title: "Test Form",
        description: "Test Description",
        formUrl: "https://docs.google.com/forms/d/e/test/viewform",
        provider: "GOOGLE_FORM",
        providerFormId: "test",
        status: "ACTIVE"
    };

    beforeEach(() => {
        jest.clearAllMocks();

        formValidator.validateCreate.mockImplementation(() => undefined);
        formValidator.validateUpdate.mockImplementation(() => undefined);

        formMapper.toCreateData.mockReturnValue(createData);
        formMapper.toUpdateData.mockImplementation(data => data);
        formMapper.toResponse.mockReturnValue(responseForm);
    });

    describe("create", () => {
        it("should create form successfully", async () => {
            formRepository.findByUrl.mockResolvedValue(null);
            formRepository.create.mockResolvedValue(dbForm);

            const result = await formService.create(inputData);

            expect(formValidator.validateCreate).toHaveBeenCalledWith(inputData);
            expect(formRepository.findByUrl).toHaveBeenCalledWith(inputData.formUrl);
            expect(formMapper.toCreateData).toHaveBeenCalledWith(inputData);
            expect(formRepository.create).toHaveBeenCalledWith(createData);
            expect(formMapper.toResponse).toHaveBeenCalledWith(dbForm);
            expect(result).toEqual(responseForm);
        });

        it("should throw error if form URL already exists", async () => {
            formRepository.findByUrl.mockResolvedValue(dbForm);

            await expect(formService.create(inputData))
                .rejects
                .toThrow("Form URL already exists");

            expect(formRepository.create).not.toHaveBeenCalled();
        });

        it("should throw validation error", async () => {
            formValidator.validateCreate.mockImplementation(() => {
                throw new Error("Title is required");
            });

            await expect(formService.create({}))
                .rejects
                .toThrow("Title is required");

            expect(formRepository.findByUrl).not.toHaveBeenCalled();
            expect(formRepository.create).not.toHaveBeenCalled();
        });
    });

    describe("findById", () => {
        it("should find form by id successfully", async () => {
            formRepository.findById.mockResolvedValue(dbForm);

            const result = await formService.findById("form-id");

            expect(formRepository.findById).toHaveBeenCalledWith("form-id");
            expect(formMapper.toResponse).toHaveBeenCalledWith(dbForm);
            expect(result).toEqual(responseForm);
        });

        it("should throw error if id is missing", async () => {
            await expect(formService.findById())
                .rejects
                .toThrow("Form id is required");

            expect(formRepository.findById).not.toHaveBeenCalled();
        });

        it("should throw error if form not found", async () => {
            formRepository.findById.mockResolvedValue(null);

            await expect(formService.findById("form-id"))
                .rejects
                .toThrow("Form not found");
        });
    });

    describe("findByUrl", () => {
        it("should find form by URL successfully", async () => {
            formRepository.findByUrl.mockResolvedValue(dbForm);

            const result = await formService.findByUrl(inputData.formUrl);

            expect(formRepository.findByUrl).toHaveBeenCalledWith(inputData.formUrl);
            expect(formMapper.toResponse).toHaveBeenCalledWith(dbForm);
            expect(result).toEqual(responseForm);
        });

        it("should throw error if URL is missing", async () => {
            await expect(formService.findByUrl())
                .rejects
                .toThrow("Form URL is required");

            expect(formRepository.findByUrl).not.toHaveBeenCalled();
        });

        it("should throw error if form not found", async () => {
            formRepository.findByUrl.mockResolvedValue(null);

            await expect(formService.findByUrl(inputData.formUrl))
                .rejects
                .toThrow("Form not found");
        });
    });

    describe("findMany", () => {
        it("should return all forms", async () => {
            formRepository.findMany.mockResolvedValue([dbForm]);

            const result = await formService.findMany();

            expect(formRepository.findMany).toHaveBeenCalled();
            expect(formMapper.toResponse).toHaveBeenCalledWith(dbForm);
            expect(result).toEqual([responseForm]);
        });
    });

    describe("update", () => {
        const updateData = {
            title: "Updated Form"
        };

        it("should update form successfully", async () => {
            formRepository.findById.mockResolvedValue(dbForm);
            formMapper.toUpdateData.mockReturnValue(updateData);
            formRepository.update.mockResolvedValue({
                ...dbForm,
                ...updateData
            });

            const result = await formService.update("form-id", updateData);

            expect(formValidator.validateUpdate).toHaveBeenCalledWith(updateData);
            expect(formRepository.findById).toHaveBeenCalledWith("form-id");
            expect(formMapper.toUpdateData).toHaveBeenCalledWith(updateData);
            expect(formRepository.update).toHaveBeenCalledWith("form-id", updateData);
            expect(result).toEqual(responseForm);
        });

        it("should throw error if id is missing", async () => {
            await expect(formService.update(null, updateData))
                .rejects
                .toThrow("Form id is required");

            expect(formValidator.validateUpdate).not.toHaveBeenCalled();
        });

        it("should throw validation error", async () => {
            formValidator.validateUpdate.mockImplementation(() => {
                throw new Error("Invalid form status");
            });

            await expect(formService.update("form-id", { status: "INVALID" }))
                .rejects
                .toThrow("Invalid form status");

            expect(formRepository.update).not.toHaveBeenCalled();
        });

        it("should throw error if form not found", async () => {
            formRepository.findById.mockResolvedValue(null);

            await expect(formService.update("form-id", updateData))
                .rejects
                .toThrow("Form not found");

            expect(formRepository.update).not.toHaveBeenCalled();
        });
    });

    describe("softDelete", () => {
        it("should delete form fields then soft delete form", async () => {
            formRepository.findById.mockResolvedValue(dbForm);
            formFieldRepository.deleteByFormId.mockResolvedValue({ count: 2 });
            formRepository.softDelete.mockResolvedValue({
                ...dbForm,
                deletedAt: new Date()
            });

            const result = await formService.softDelete("form-id");

            expect(formRepository.findById).toHaveBeenCalledWith("form-id");
            expect(formFieldRepository.deleteByFormId).toHaveBeenCalledWith("form-id");
            expect(formRepository.softDelete).toHaveBeenCalledWith("form-id");
            expect(result).toEqual(responseForm);
        });

        it("should throw error if id is missing", async () => {
            await expect(formService.softDelete())
                .rejects
                .toThrow("Form id is required");

            expect(formRepository.findById).not.toHaveBeenCalled();
        });

        it("should throw error if form not found", async () => {
            formRepository.findById.mockResolvedValue(null);

            await expect(formService.softDelete("form-id"))
                .rejects
                .toThrow("Form not found");

            expect(formFieldRepository.deleteByFormId).not.toHaveBeenCalled();
            expect(formRepository.softDelete).not.toHaveBeenCalled();
        });
    });

    describe("upsertByUrl", () => {
        it("should upsert form by URL successfully", async () => {
            formRepository.upsertByUrl.mockResolvedValue(dbForm);

            const result = await formService.upsertByUrl(inputData);

            expect(formValidator.validateCreate).toHaveBeenCalledWith(inputData);
            expect(formMapper.toCreateData).toHaveBeenCalledWith(inputData);
            expect(formRepository.upsertByUrl).toHaveBeenCalledWith(createData);
            expect(formMapper.toResponse).toHaveBeenCalledWith(dbForm);
            expect(result).toEqual(responseForm);
        });

        it("should throw validation error", async () => {
            formValidator.validateCreate.mockImplementation(() => {
                throw new Error("Form URL is required");
            });

            await expect(formService.upsertByUrl({}))
                .rejects
                .toThrow("Form URL is required");

            expect(formRepository.upsertByUrl).not.toHaveBeenCalled();
        });
    });
});