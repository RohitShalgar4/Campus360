import express from "express";
import { getAllStudents, register } from "../controllers/studentController.js";
// import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/students").get(getAllStudents);

export default router;
