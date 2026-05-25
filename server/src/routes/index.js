import express from "express";
import formRoutes from "./v1/form.routes.js";

const router = express.Router();

router.use("/api/v1/forms", formRoutes);

export default router;