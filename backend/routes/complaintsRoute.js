import express from 'express';
import {
  getAllComplaints,
  addComplaint,
  updateComplaintStatus,
  upvoteComplaint,
  deleteComplaint,
} from '../controllers/complaintsController.js';

const router = express.Router();

// Get all complaints
router.get('/', getAllComplaints);

// Add a new complaint
router.post('/', addComplaint);

// Update complaint status
router.put('/:id/status', updateComplaintStatus);

// Upvote a complaint
router.put('/:id/upvote', upvoteComplaint);

// Delete a complaint
router.delete('/:id', deleteComplaint);

export default router;