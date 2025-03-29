import express from 'express';
import { updatePassword } from '../controllers/passwordController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/update-password', isAuthenticated, updatePassword);

export default router; 