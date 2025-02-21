import express from "express";
import { registerAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.route("/registerAdmin").post(registerAdmin);

export default router;