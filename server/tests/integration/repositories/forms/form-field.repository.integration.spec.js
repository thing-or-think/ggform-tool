import prisma from "../../../../src/config/prisma";
import { formFieldRepository } from "../../../../src/modules/forms/repositories/form-field.repository";
import { createForm } from "../../../factories/forms/form.factory";
import {
    buildFormFieldData,
    createFormField
} from "../../../factories/forms/form-field.factory";

describe("formFieldRepository integration", () => {

    describe("create", () => {
        it("should create a form field", async () => {
            const form = await createForm(prisma);

            const data = buildFormFieldData({
                formId: form.id
            });

            const result = await formFieldRepository.create(data);

            expect(result.id).toBeDefined();
            expect(result.formId).toBe(form.id);
            expect(result.entryId).toBe(data.entryId);
            expect(result.label).toBe(data.label);
            expect(result.type).toBe(data.type);
            expect(result.required).toBe(data.required);
            expect(result.sortOrder).toBe(data.sortOrder);
        });
    });

    describe("createMany", () => {
        it("should create many form fields", async () => {
            const form = await createForm(prisma);

            const data = [
                buildFormFieldData({
                    formId: form.id,
                    label: "Name",
                    sortOrder: 1
                }),
                buildFormFieldData({
                    formId: form.id,
                    label: "Email",
                    sortOrder: 2
                })
            ];

            const result = await formFieldRepository.createMany(data);

            expect(result.count).toBe(2);

            const fields = await prisma.formField.findMany({
                where: { formId: form.id }
            });

            expect(fields).toHaveLength(2);
        });

        it("should ignore undefined fields", async () => {
            const form = await createForm(prisma);

            const data = [
                buildFormFieldData({
                    formId: form.id,
                    options: undefined,
                    raw: undefined
                })
            ];

            const result = await formFieldRepository.createMany(data);

            expect(result.count).toBe(1);

            const field = await prisma.formField.findFirst({
                where: { formId: form.id }
            });

            expect(field).not.toBeNull();
            expect(field.options).toBeNull();
            expect(field.raw).toBeNull();
        });
    });

    describe("findById", () => {
        it("should find form field by id", async () => {
            const field = await createFormField(prisma);

            const result = await formFieldRepository.findById(field.id);

            expect(result).not.toBeNull();
            expect(result.id).toBe(field.id);
        });

        it("should return null if form field does not exist", async () => {
            const result = await formFieldRepository.findById(
                "00000000-0000-0000-0000-000000000000"
            );

            expect(result).toBeNull();
        });
    });

    describe("findByFormId", () => {
        it("should find fields by formId and order by sortOrder asc", async () => {
            const form = await createForm(prisma);

            const field2 = await createFormField(prisma, {
                formId: form.id,
                label: "Second Field",
                sortOrder: 2
            });

            const field1 = await createFormField(prisma, {
                formId: form.id,
                label: "First Field",
                sortOrder: 1
            });

            const result = await formFieldRepository.findByFormId(form.id);

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(field1.id);
            expect(result[1].id).toBe(field2.id);
        });
    });

    describe("findByEntryId", () => {
        it("should find field by formId and entryId", async () => {
            const field = await createFormField(prisma);

            const result = await formFieldRepository.findByEntryId(
                field.formId,
                field.entryId
            );

            expect(result).not.toBeNull();
            expect(result.id).toBe(field.id);
            expect(result.entryId).toBe(field.entryId);
        });

        it("should return null if entryId does not exist", async () => {
            const form = await createForm(prisma);

            const result = await formFieldRepository.findByEntryId(
                form.id,
                "non-existing-entry"
            );

            expect(result).toBeNull();
        });
    });

    describe("update", () => {
        it("should update only provided fields", async () => {
            const field = await createFormField(prisma, {
                label: "Old Label",
                required: true,
                sortOrder: 1
            });

            const result = await formFieldRepository.update(field.id, {
                label: "New Label",
                required: false
            });

            expect(result.label).toBe("New Label");
            expect(result.required).toBe(false);
            expect(result.sortOrder).toBe(1);
        });

        it("should update allowed fields and ignore restricted fields", async () => {
            const field = await createFormField(prisma, {
                label: "Old Label"
            });

            const result = await formFieldRepository.update(field.id, {
                label: "New Label",
                entryId: "malicious-entry-id",
                formId: "00000000-0000-0000-0000-000000000000",
                type: "NUMBER"
            });

            expect(result.label).toBe("New Label");

            expect(result.entryId).toBe("malicious-entry-id");

            expect(result.formId).toBe(field.formId);
            expect(result.type).toBe("NUMBER");
        });
    });

    describe("delete", () => {
        it("should delete form field by id", async () => {
            const field = await createFormField(prisma);

            const result = await formFieldRepository.delete(field.id);

            expect(result.id).toBe(field.id);

            const found = await prisma.formField.findUnique({
                where: { id: field.id }
            });

            expect(found).toBeNull();
        });
    });

    describe("deleteByFormId", () => {
        it("should delete all fields by formId", async () => {
            const form = await createForm(prisma);

            await createFormField(prisma, {
                formId: form.id,
                sortOrder: 1
            });

            await createFormField(prisma, {
                formId: form.id,
                sortOrder: 2
            });

            const result = await formFieldRepository.deleteByFormId(form.id);

            expect(result.count).toBe(2);

            const fields = await prisma.formField.findMany({
                where: { formId: form.id }
            });

            expect(fields).toHaveLength(0);
        });
    });
});