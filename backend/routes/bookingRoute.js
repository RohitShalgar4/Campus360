import express from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Create a booking request (Student-only)
router.post('/', authenticateToken, createBooking);

// Get all bookings for the authenticated student
router.get('/', authenticateToken, getBookings);

// Approve or reject a booking (Admin-only)
router.put('/:id', authenticateToken, updateBookingStatus);

export default router;
