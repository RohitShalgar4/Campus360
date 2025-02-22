import express from 'express';
import {
  getFacilities,
  addFacility,
  updateFacility,
  deleteFacility,
} from '../controllers/facilityController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Fetch all facilities
router.get('/', getFacilities);

// Add a new facility (Admin-only)
router.post('/', authenticateToken, addFacility);

// Update a facility (Admin-only)
router.put('/:id', authenticateToken, updateFacility);

// Delete a facility (Admin-only)
router.delete('/:id', authenticateToken, deleteFacility);

export default router;