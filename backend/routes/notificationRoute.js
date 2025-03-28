import express from "express";
import { sendMail } from "../controllers/notificationController.js";

const router = express.Router();

router.route("/send-email-notification").post(sendMail);

export default router;
