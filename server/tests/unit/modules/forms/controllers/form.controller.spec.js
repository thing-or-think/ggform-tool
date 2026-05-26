import { jest } from "@jest/globals";

const mockFormService = {
    findById: jest.fn(),
    findByUrl: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn()
};

const mockFormFieldService = {
    findByFormId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteByFormId: jest.fn()
};

const mockFormScannerService = {
    scan: jest.fn()
};


jest.unstable_mockModule("../../../../../src/modules/forms/services/form.service.js", () => ({
    formService: mockFormService
}));

jest.unstable_mockModule("../../../../../src/modules/forms/services/form-field.service.js", () => ({
    formFieldService: mockFormFieldService
}));

jest.unstable_mockModule("../../../../../src/modules/forms/services/form-scanner.service.js", () => ({
    formScannerService: mockFormScannerService
}));

const { formController } = await import("../../../../../src/modules/forms/controllers/form.controller.js");

function mockResponse() {
    const res = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
}

describe("formController unit", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            params: {},
            query: {},
            body: {}
        };

        res = mockResponse();
        next = jest.fn();

        jest.clearAllMocks();
    });

    describe("findById", () => {
        it("should return form by id", async () => {
            const form = {
                id: "form-id",
                title: "Test Form"
            };

            req.params.id = "form-id";

            mockFormService.findById.mockResolvedValue(form);

            await formController.findById(req, res, next);

            expect(mockFormService.findById).toHaveBeenCalledWith("form-id");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: form
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next when service throws error", async () => {
            const error = new Error("Form not found");

            req.params.id = "form-id";

            mockFormService.findById.mockRejectedValue(error);

            await formController.findById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("findByUrl", () => {
        it("should return form by url", async () => {
            const form = {
                id: "form-id",
                formUrl: "https://docs.google.com/forms/test"
            };

            req.query.formUrl = "https://docs.google.com/forms/test";

            mockFormService.findByUrl.mockResolvedValue(form);

            await formController.findByUrl(req, res, next);

            expect(mockFormService.findByUrl).toHaveBeenCalledWith(
                "https://docs.google.com/forms/test"
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: form
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next when service throws error", async () => {
            const error = new Error("Form URL is required");

            mockFormService.findByUrl.mockRejectedValue(error);

            await formController.findByUrl(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("findMany", () => {
        it("should return all forms", async () => {
            const forms = [
                {
                    id: "form-id-1",
                    title: "Form 1"
                },
                {
                    id: "form-id-2",
                    title: "Form 2"
                }
            ];

            mockFormService.findMany.mockResolvedValue(forms);

            await formController.findMany(req, res, next);

            expect(mockFormService.findMany).toHaveBeenCalledWith();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: forms
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next when service throws error", async () => {
            const error = new Error("Database error");

            mockFormService.findMany.mockRejectedValue(error);

            await formController.findMany(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("update", () => {
        it("should update form", async () => {
            const updateData = {
                title: "Updated Form"
            };

            const updatedForm = {
                id: "form-id",
                title: "Updated Form"
            };

            req.params.id = "form-id";
            req.body = updateData;

            mockFormService.update.mockResolvedValue(updatedForm);

            await formController.update(req, res, next);

            expect(mockFormService.update).toHaveBeenCalledWith(
                "form-id",
                updateData
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Form updated successfully",
                data: updatedForm
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next when service throws error", async () => {
            const error = new Error("Form not found");

            req.params.id = "form-id";
            req.body = {
                title: "Updated Form"
            };

            mockFormService.update.mockRejectedValue(error);

            await formController.update(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("softDelete", () => {
        it("should soft delete form", async () => {
            req.params.id = "form-id";

            mockFormService.softDelete.mockResolvedValue();

            await formController.softDelete(req, res, next);

            expect(mockFormService.softDelete).toHaveBeenCalledWith("form-id");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Form deleted successfully"
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next when service throws error", async () => {
            const error = new Error("Form not found");

            req.params.id = "form-id";

            mockFormService.softDelete.mockRejectedValue(error);

            await formController.softDelete(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("scan", () => {
        it("should scan form successfully", async () => {
            const scanResult = {
                form: {
                    id: "form-id",
                    title: "Scanned Form"
                },
                fields: []
            };

            req.body.formUrl = "https://docs.google.com/forms/test";

            mockFormScannerService.scan.mockResolvedValue(scanResult);

            await formController.scan(req, res, next);

            expect(mockFormScannerService.scan).toHaveBeenCalledWith(
                "https://docs.google.com/forms/test"
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Google Form scanned successfully",
                data: scanResult
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next when scanner service throws error", async () => {
            const error = new Error("Invalid Google Form URL");

            req.body.formUrl = "invalid-url";

            mockFormScannerService.scan.mockRejectedValue(error);

            await formController.scan(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("getFieldsByFormId", () => {
        it("should return fields by form id", async () => {
            const fields = [
                {
                    id: "field-id",
                    formId: "form-id",
                    label: "Email"
                }
            ];

            req.params.formId = "form-id";

            mockFormFieldService.findByFormId.mockResolvedValue(fields);

            await formController.getFieldsByFormId(req, res, next);

            expect(mockFormFieldService.findByFormId).toHaveBeenCalledWith(
                "form-id"
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: fields
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next when service throws error", async () => {
            const error = new Error("Form id is required");

            req.params.formId = "form-id";

            mockFormFieldService.findByFormId.mockRejectedValue(error);

            await formController.getFieldsByFormId(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("createField", () => {
        it("should create form field", async () => {
            const fieldData = {
                formId: "form-id",
                entryId: "entry-id",
                label: "Email"
            };

            const createdField = {
                id: "field-id",
                ...fieldData
            };

            req.body = fieldData;

            mockFormFieldService.create.mockResolvedValue(createdField);

            await formController.createField(req, res, next);

            expect(mockFormFieldService.create).toHaveBeenCalledWith(fieldData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Form field created successfully",
                data: createdField
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next when service throws error", async () => {
            const error = new Error("Form field data is required");

            req.body = {};

            mockFormFieldService.create.mockRejectedValue(error);

            await formController.createField(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("updateField", () => {
        it("should update form field", async () => {
            const updateData = {
                label: "Updated Email"
            };

            const updatedField = {
                id: "field-id",
                label: "Updated Email"
            };

            req.params.fieldId = "field-id";
            req.body = updateData;

            mockFormFieldService.update.mockResolvedValue(updatedField);

            await formController.updateField(req, res, next);

            expect(mockFormFieldService.update).toHaveBeenCalledWith(
                "field-id",
                updateData
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Form field update successfully",
                data: updatedField
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next when service throws error", async () => {
            const error = new Error("Form field not found");

            req.params.fieldId = "field-id";
            req.body = {
                label: "Updated Email"
            };

            mockFormFieldService.update.mockRejectedValue(error);

            await formController.updateField(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("deleteFieldsByFormId", () => {
        it("should delete fields by form id", async () => {
            req.params.formId = "form-id";

            mockFormFieldService.deleteByFormId.mockResolvedValue();

            await formController.deleteFieldsByFormId(req, res, next);

            expect(mockFormFieldService.deleteByFormId).toHaveBeenCalledWith(
                "form-id"
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "FormFields deleted successfully"
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next when service throws error", async () => {
            const error = new Error("Form id is required");

            req.params.formId = "form-id";

            mockFormFieldService.deleteByFormId.mockRejectedValue(error);

            await formController.deleteFieldsByFormId(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});