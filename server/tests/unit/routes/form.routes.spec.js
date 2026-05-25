import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

jest.unstable_mockModule(
    "../../../src/modules/forms/controllers/form.controller.js",
    () => ({
        formController: {
            findMany: jest.fn((req, res) => res.status(200).json({ handler: "findMany" })),
            findByUrl: jest.fn((req, res) => res.status(200).json({ handler: "findByUrl" })),
            findById: jest.fn((req, res) => res.status(200).json({ handler: "findById" })),
            update: jest.fn((req, res) => res.status(200).json({ handler: "update" })),
            softDelete: jest.fn((req, res) => res.status(200).json({ handler: "softDelete" })),
            scan: jest.fn((req, res) => res.status(200).json({ handler: "scan" })),

            getFieldsByFormId: jest.fn((req, res) =>
                res.status(200).json({ handler: "getFieldsByFormId" })
            ),
            createField: jest.fn((req, res) =>
                res.status(201).json({ handler: "createField" })
            ),
            updateField: jest.fn((req, res) =>
                res.status(200).json({ handler: "updateField" })
            ),
            deleteFieldsByFormId: jest.fn((req, res) =>
                res.status(200).json({ handler: "deleteFieldsByFormId" })
            )
        }
    })
);

const { default: formRoutes } = await import(
    "../../../src/routes/v1/form.routes.js"
);

const { formController } = await import(
    "../../../src/modules/forms/controllers/form.controller.js"
);

describe("form.routes unit", () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use("/api/v1/forms", formRoutes);

        jest.clearAllMocks();
    });

    test("GET /api/v1/forms should call findMany", async () => {
        const res = await request(app).get("/api/v1/forms");

        expect(res.status).toBe(200);
        expect(res.body.handler).toBe("findMany");
        expect(formController.findMany).toHaveBeenCalledTimes(1);
    });

    test("GET /api/v1/forms/url should call findByUrl", async () => {
        const res = await request(app)
            .get("/api/v1/forms/url")
            .query({ formUrl: "https://docs.google.com/forms/test" });

        expect(res.status).toBe(200);
        expect(res.body.handler).toBe("findByUrl");
        expect(formController.findByUrl).toHaveBeenCalledTimes(1);
    });

    test("GET /api/v1/forms/:id should call findById", async () => {
        const res = await request(app).get("/api/v1/forms/form-1");

        expect(res.status).toBe(200);
        expect(res.body.handler).toBe("findById");
        expect(formController.findById).toHaveBeenCalledTimes(1);
    });

    test("PUT /api/v1/forms/:id should call update", async () => {
        const res = await request(app)
            .put("/api/v1/forms/form-1")
            .send({ title: "Updated Form" });

        expect(res.status).toBe(200);
        expect(res.body.handler).toBe("update");
        expect(formController.update).toHaveBeenCalledTimes(1);
    });

    test("DELETE /api/v1/forms/:id should call softDelete", async () => {
        const res = await request(app).delete("/api/v1/forms/form-1");

        expect(res.status).toBe(200);
        expect(res.body.handler).toBe("softDelete");
        expect(formController.softDelete).toHaveBeenCalledTimes(1);
    });

    test("POST /api/v1/forms/scan should call scan", async () => {
        const res = await request(app)
            .post("/api/v1/forms/scan")
            .send({ formUrl: "https://docs.google.com/forms/test" });

        expect(res.status).toBe(200);
        expect(res.body.handler).toBe("scan");
        expect(formController.scan).toHaveBeenCalledTimes(1);
    });

    test("GET /api/v1/forms/:formId/fields should call getFieldsByFormId", async () => {
        const res = await request(app).get("/api/v1/forms/form-1/fields");

        expect(res.status).toBe(200);
        expect(res.body.handler).toBe("getFieldsByFormId");
        expect(formController.getFieldsByFormId).toHaveBeenCalledTimes(1);
    });

    test("POST /api/v1/forms/fields should call createField", async () => {
        const res = await request(app)
            .post("/api/v1/forms/fields")
            .send({
                formId: "form-1",
                entryId: "entry.123",
                label: "Email"
            });

        expect(res.status).toBe(201);
        expect(res.body.handler).toBe("createField");
        expect(formController.createField).toHaveBeenCalledTimes(1);
    });

    test("PUT /api/v1/forms/fields/:fieldId should call updateField", async () => {
        const res = await request(app)
            .put("/api/v1/forms/fields/field-1")
            .send({ label: "Updated Field" });

        expect(res.status).toBe(200);
        expect(res.body.handler).toBe("updateField");
        expect(formController.updateField).toHaveBeenCalledTimes(1);
    });

    test("DELETE /api/v1/forms/:formId/fields should call deleteFieldsByFormId", async () => {
        const res = await request(app).delete("/api/v1/forms/form-1/fields");

        expect(res.status).toBe(200);
        expect(res.body.handler).toBe("deleteFieldsByFormId");
        expect(formController.deleteFieldsByFormId).toHaveBeenCalledTimes(1);
    });
});