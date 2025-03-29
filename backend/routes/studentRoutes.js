import express from "express";
import { register, getAllStudents } from "../controllers/studentController.js";

const router = express.Router();

router.post("/register", register);
router.get("/all", getAllStudents);

export default router; 