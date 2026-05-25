import { formService } from "../services/form.service.js";
import { formFieldService } from "../services/form-field.service.js";
import { formScannerService } from "../services/form-scanner.service.js";

export const formController = {
    async findById(req, res, next) {
        try {
            const { id } = req.params;

            const form = await formService.findById(id);

            return res.status(200).json({
                success: true,
                data: form
            });
        } catch (error) {
            next(error);
        }
    },

    async findByUrl(req, res, next) {
        try {
            const { formUrl } = req.query;

            const form = await formService.findByUrl(formUrl);

            return res.status(200).json({
                success: true,
                data: form
            });
        } catch (error) {
            next(error);
        }
    },

    async findMany(req, res, next) {
        try {
            const forms = await formService.findMany();

            return res.status(200).json({
                success: true,
                data: forms
            })
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;

            const form = await formService.update(id, req.body);

            return res.status(200).json({
                success: true,
                message: "Form updated successfully",
                data: form
            });
        } catch (error) {
            next(error);
        }
    },

    async softDelete(req, res, next) {
        try {
            const { id } = req.params;

            await formService.softDelete(id);

            return res.status(200).json({
                success: true,
                message: "Form deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    },

    async scan(req, res, next) {
        try {
            const { formUrl } = req.body;

            const result = await formScannerService.scan(formUrl);

            return res.status(200).json({
                success: true,
                message: "Form scanned successfully",
                data: result
            })
        } catch (error) {
            next(error);
        }
    },

    async getFieldsByFormId(req, res, next) {
        try {
            const { formId } = req.params;

            const fields = await formFieldService.findByFormId(formId);

            return res.status(200).json({
                success: true,
                data: fields
            });
        } catch (error) {
            next(error);
        }
    },

    async createField(req, res, next) {
        try {
            const field = await formFieldService.create(req.body);

            return res.status(201).json({
                success: true,
                message: "Form field created successfully",
                data: field
            });
        } catch (error) {
            next(error);
        }
    },

    async updateField(req, res, next) {
        try {
            const { fieldId } = req.params;

            const field = await formFieldService.update(fieldId, req.body);

            return res.status(200).json({
                success: true,
                message: "Form field update successfully",
                data: field
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteFieldsByFormId(req, res, next) {
        try {
            const { formId } = req.params;

            await formFieldService.deleteByFormId(formId);

            return res.status(200).json({
                success: true,
                message: "FormFields deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}