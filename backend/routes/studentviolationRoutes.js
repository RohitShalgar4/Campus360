// routes/studentviolationroute.js (rename if needed to match your file)
import express from 'express';
import { getAllViolations, createViolation } from '../controllers/studentviolationController.js';

const router = express.Router();

// GET all violations
router.get('/violations', getAllViolations);

// POST a new violation
router.post('/violations', createViolation);

export default router;