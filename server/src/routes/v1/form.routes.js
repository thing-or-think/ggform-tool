import express from "express";
import { formController } from "../../modules/forms/controllers/form.controller.js";


const router = express.Router()

router.get("/", formController.findMany);
router.get("/url", formController.findByUrl);
router.get("/:id", formController.findById);

router.put("/:id", formController.update);
router.delete("/:id", formController.softDelete);

router.post("/scan", formController.scan);

/**
 * Form field routes
 */
router.get("/:formId/fields", formController.getFieldsByFormId);
router.post("/fields", formController.createField);
router.put("/fields/:fieldId", formController.updateField);
router.delete("/:formId/fields", formController.deleteFieldsByFormId);

export default router;