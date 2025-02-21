import express from "express";
import {login, logout} from "../controllers/loginController.js";
// import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/logout").get(logout);

export default router;