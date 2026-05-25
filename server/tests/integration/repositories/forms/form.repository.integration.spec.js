import prisma from "../../../../src/config/prisma.js";
import { formRepository } from "../../../../src/modules/forms/repositories/form.repository.js";
import {
    buildFormData
} from "../../../factories/forms/form.factory.js";

describe("formRepository integration", () => {

    describe("create", () => {
        it("should create a form", async () => {
            const data = buildFormData();

            const result = await formRepository.create(data);

            expect(result.id).toBeDefined();
            expect(result.title).toBe(data.title);
            expect(result.formUrl).toBe(data.formUrl);
            expect(result.deletedAt).toBeNull();
        });
    });

    describe("findById", () => {
        it("should find form by id", async () => {
            const form = await formRepository.create(buildFormData());

            const result = await formRepository.findById(form.id);

            expect(result).not.toBeNull();
            expect(result.id).toBe(form.id);
        });

        it("should return null if form does not exist", async () => {
            const result = await formRepository.findById(
                "00000000-0000-0000-0000-000000000000"
            );

            expect(result).toBeNull();
        });
    });

    describe("findByUrl", () => {
        it("should find form by formUrl", async () => {
            const data = buildFormData();

            await formRepository.create(data);

            const result = await formRepository.findByUrl(data.formUrl);

            expect(result).not.toBeNull();
            expect(result.formUrl).toBe(data.formUrl);
        });
    });

    describe("findMany", () => {
        it("should return only non-deleted forms", async () => {
            const activeForm = await formRepository.create(
                buildFormData({
                    title: "Active Form"
                })
            );

            const deletedForm = await formRepository.create(
                buildFormData({
                    title: "Deleted Form"
                })
            );

            await prisma.form.update({
                where: { id: deletedForm.id },
                data: { deletedAt: new Date() }
            });

            const result = await formRepository.findMany();

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(activeForm.id);
            expect(result[0].deletedAt).toBeNull();
        });

        it("should order forms by createdAt desc", async () => {
            const oldForm = await formRepository.create(
                buildFormData({
                    title: "Old Form"
                })
            );

            await new Promise(resolve => setTimeout(resolve, 20));

            const newForm = await formRepository.create(
                buildFormData({
                    title: "New Form"
                })
            );

            const result = await formRepository.findMany();

            expect(result[0].id).toBe(newForm.id);
            expect(result[1].id).toBe(oldForm.id);
        });
    });

    describe("update", () => {
        it("should update only provided fields", async () => {
            const form = await formRepository.create(
                buildFormData({
                    title: "Old Title",
                    description: "Old Description",
                    status: "ACTIVE"
                })
            );

            const result = await formRepository.update(form.id, {
                title: "New Title",
                status: "INACTIVE"
            });

            expect(result.title).toBe("New Title");
            expect(result.status).toBe("INACTIVE");
            expect(result.description).toBe("Old Description");
        });

        it("should ignore fields that are not allowed", async () => {
            const form = await formRepository.create(
                buildFormData({
                    title: "Old Title"
                })
            );

            const result = await formRepository.update(form.id, {
                title: "New Title",
                formUrl: "https://malicious-change.com",
                deletedAt: new Date()
            });

            expect(result.title).toBe("New Title");
            expect(result.formUrl).toBe(form.formUrl);
            expect(result.deletedAt).toBeNull();
        });
    });

    describe("softDelete", () => {
        it("should set deletedAt", async () => {
            const form = await formRepository.create(buildFormData());

            const result = await formRepository.softDelete(form.id);

            expect(result.deletedAt).toBeInstanceOf(Date);
        });
    });

    describe("upsertByUrl", () => {
        it("should create form if formUrl does not exist", async () => {
            const data = buildFormData();

            const result = await formRepository.upsertByUrl(data);

            expect(result.id).toBeDefined();
            expect(result.formUrl).toBe(data.formUrl);
            expect(result.title).toBe(data.title);
        });

        it("should update form if formUrl already exists", async () => {
            const data = buildFormData({
                title: "Old Title"
            });

            const created = await formRepository.create(data);

            const result = await formRepository.upsertByUrl({
                ...data,
                title: "Updated Title",
                description: "Updated Description",
                status: "INACTIVE"
            });

            expect(result.id).toBe(created.id);
            expect(result.title).toBe("Updated Title");
            expect(result.description).toBe("Updated Description");
            expect(result.status).toBe("INACTIVE");
        });
    });
});