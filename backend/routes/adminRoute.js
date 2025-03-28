import express from "express";
import { addCC, registerAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.route("/registerAdmin").post(registerAdmin);
router.route("/addCC").post(addCC);

export default router;
