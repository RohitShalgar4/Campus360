import express from "express";
import { registerDoctor } from "../controllers/doctorController.js";

const router = express.Router();

router.route("/registerDoctor").post(registerDoctor);

export default router;