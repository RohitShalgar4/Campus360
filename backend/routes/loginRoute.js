import express from "express";
import {login, logout, validateToken} from "../controllers/loginController.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/validate").get(authenticateToken, validateToken);

export default router;