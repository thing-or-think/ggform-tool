import prisma from "server/src/config/prisma.js";
import { formService } from "server/src/modules/forms/services/form.service.js";
import { FORM_STATUS } from "server/src/modules/forms/constants/form.constants.js";
import { buildFormData } from "server/tests/factories/forms/form.factory.js";
import { buildFormFieldData } from "server/tests/factories/forms/form-field.factory.js";

describe("formService integration", () => {
    describe("create", () => {
        test("should create form", async () => {
            const data = buildFormData();

            const result = await formService.create(data);

            expect(result.id).toBeDefined();
            expect(result.title).toBe(data.title);
            expect(result.formUrl).toBe(data.formUrl);
            expect(result.provider).toBe(data.provider);
            expect(result.status).toBe(data.status);
        });

        test("should create form with default status", async () => {
            const data = buildFormData({
                status: undefined
            });

            const result = await formService.create(data);

            expect(result.status).toBeDefined();
        });

        test("should throw error when create data is invalid", async () => {
            await expect(
                formService.create({
                    ...buildFormData(),
                    title: "",
                    formUrl: ""
                })
            ).rejects.toThrow();
        });

        test("should throw error when formUrl already exists", async () => {
            const data = buildFormData();

            await formService.create(data);

            await expect(
                formService.create(data)
            ).rejects.toThrow();
        });
    })
    describe("upsertByUrl", () => {
        test("should create form by url", async () => {
            const data = buildFormData();

            const result = await formService.upsertByUrl(data);

            expect(result.id).toBeDefined();
            expect(result.title).toBe(data.title);
            expect(result.formUrl).toBe(data.formUrl);
            expect(result.provider).toBe(data.provider);
            expect(result.status).toBe(data.status);
        });

        test("should update existing form if formUrl already exists", async () => {
            const data = buildFormData();

            const created = await formService.upsertByUrl(data);

            const updated = await formService.upsertByUrl({
                ...data,
                title: "Updated Form",
                description: "Updated description",
                status: FORM_STATUS.INACTIVE
            });

            expect(updated.id).toBe(created.id);
            expect(updated.title).toBe("Updated Form");
            expect(updated.description).toBe("Updated description");
            expect(updated.status).toBe(FORM_STATUS.INACTIVE);
        });

        test("should throw error when create data is invalid", async () => {
            await expect(
                formService.upsertByUrl({
                    ...buildFormData(),
                    title: "",
                    formUrl: ""
                })
            ).rejects.toThrow();
        });
    });

    describe("findById", () => {
        test("should find form by id", async () => {
            const created = await formService.upsertByUrl(buildFormData());

            const result = await formService.findById(created.id);

            expect(result.id).toBe(created.id);
            expect(result.formUrl).toBe(created.formUrl);
        });

        test("should throw error when id is missing", async () => {
            await expect(formService.findById()).rejects.toThrow(
                "Form id is required"
            );
        });

        test("should throw error when form does not exist", async () => {
            await expect(
                formService.findById("11111111-1111-1111-1111-111111111111")
            ).rejects.toThrow("Form not found");
        });
    });

    describe("findByUrl", () => {
        test("should find form by url", async () => {
            const created = await formService.upsertByUrl(buildFormData());

            const result = await formService.findByUrl(created.formUrl);

            expect(result.id).toBe(created.id);
            expect(result.formUrl).toBe(created.formUrl);
        });

        test("should throw error when formUrl is missing", async () => {
            await expect(formService.findByUrl()).rejects.toThrow(
                "Form URL is required"
            );
        });

        test("should throw error when formUrl does not exist", async () => {
            await expect(
                formService.findByUrl(
                    "https://docs.google.com/forms/d/e/not-found/viewform"
                )
            ).rejects.toThrow("Form not found");
        });
    });

    describe("findMany", () => {
        test("should return all forms", async () => {
            await formService.upsertByUrl(buildFormData({ title: "Form 1" }));
            await formService.upsertByUrl(buildFormData({ title: "Form 2" }));

            const result = await formService.findMany();

            expect(result).toHaveLength(2);
            expect(result[0].id).toBeDefined();
            expect(result[1].id).toBeDefined();
        });

        test("should return empty array when no forms exist", async () => {
            const result = await formService.findMany();

            expect(result).toEqual([]);
        });
    });

    describe("update", () => {
        test("should update form", async () => {
            const created = await formService.upsertByUrl(buildFormData());

            const result = await formService.update(created.id, {
                title: "Updated title",
                description: "Updated description",
                status: FORM_STATUS.INACTIVE
            });

            expect(result.id).toBe(created.id);
            expect(result.title).toBe("Updated title");
            expect(result.description).toBe("Updated description");
            expect(result.status).toBe(FORM_STATUS.INACTIVE);
        });

        test("should ignore fields that are not allowed by mapper", async () => {
            const created = await formService.upsertByUrl(buildFormData());

            const result = await formService.update(created.id, {
                title: "Updated title",
                formUrl: "https://malicious-url.com",
                deletedAt: new Date()
            });

            expect(result.title).toBe("Updated title");
            expect(result.formUrl).toBe(created.formUrl);
        });

        test("should throw error when id is missing", async () => {
            await expect(
                formService.update(null, { title: "Updated" })
            ).rejects.toThrow("Form id is required");
        });

        test("should throw error when form does not exist", async () => {
            await expect(
                formService.update("11111111-1111-1111-1111-111111111111", {
                    title: "Updated"
                })
            ).rejects.toThrow("Form not found");
        });

        test("should throw error when update data is invalid", async () => {
            const created = await formService.upsertByUrl(buildFormData());

            await expect(
                formService.update(created.id, {
                    status: "INVALID_STATUS"
                })
            ).rejects.toThrow();
        });
    });

    describe("softDelete", () => {
        test("should soft delete form", async () => {
            const created = await formService.upsertByUrl(buildFormData());

            const result = await formService.softDelete(created.id);

            expect(result.id).toBe(created.id);

            const formInDb = await prisma.form.findUnique({
                where: { id: created.id }
            });

            expect(formInDb.deletedAt).not.toBeNull();
        });

        test("should delete form fields before soft deleting form", async () => {
            const created = await formService.upsertByUrl(buildFormData());

            await prisma.formField.create({
                data: buildFormFieldData({
                    formId: created.id
                })
            });

            await formService.softDelete(created.id);

            const fields = await prisma.formField.findMany({
                where: { formId: created.id }
            });

            expect(fields).toHaveLength(0);
        });

        test("should throw error when id is missing", async () => {
            await expect(formService.softDelete()).rejects.toThrow(
                "Form id is required"
            );
        });

        test("should throw error when form does not exist", async () => {
            await expect(
                formService.softDelete("11111111-1111-1111-1111-111111111111")
            ).rejects.toThrow("Form not found");
        });
    });
})