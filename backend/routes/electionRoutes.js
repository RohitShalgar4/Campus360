import express from 'express';
import {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
  voteForCandidate,
} from '../controllers/electionController.js';

const router = express.Router();

// Create a new election
router.post('/', createElection); // Changed from '/elections'

// Get all elections
router.get('/', getAllElections); // Changed from '/elections'

// Get a single election by ID
router.get('/:id', getElectionById);

// Update an election
router.put('/:id', updateElection);

// Delete an election
router.delete('/:id', deleteElection);

// Vote for a candidate in an election
router.post('/:electionId/vote/:candidateId', voteForCandidate);

export { router as electionRouter };