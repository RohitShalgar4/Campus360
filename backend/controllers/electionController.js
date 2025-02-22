// controllers/electionController.js
import { Election } from '../models/electionModel.js';

// Create a new election
export const createElection = async (req, res) => {
  try {
    const { title, description, deadline, candidates } = req.body; // Include candidates in the destructuring

    // Create a new election object with candidates
    const election = new Election({
      title,
      description,
      deadline,
      candidates: candidates || [], // Use the provided candidates or default to an empty array
      totalVoters: 0,
      voted: 0,
      boysVoted: 0,
      girlsVoted: 0,
      departmentStats: {}
    });

    // Save the election to the database
    await election.save();

    // Return the created election
    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ message: 'Error creating election', error });
  }
};
// Get all elections
export const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find();
    res.status(200).json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching elections', error });
  }
};

// Get a single election by ID
export const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.status(200).json(election);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching election', error });
  }
};

// Update an election
export const updateElection = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { title, description, deadline },
      { new: true }
    );
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.status(200).json(election);
  } catch (error) {
    res.status(500).json({ message: 'Error updating election', error });
  }
};

// Delete an election
export const deleteElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.status(200).json({ message: 'Election deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting election', error });
  }
};

// Handle voting for a candidate
export const voteForCandidate = async (req, res) => {
  try {
    const { electionId, candidateId } = req.params;
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    const candidate = election.candidates.id(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    candidate.votes += 1;
    election.voted += 1;
    await election.save();
    res.status(200).json({ message: 'Vote recorded successfully', election });
  } catch (error) {
    res.status(500).json({ message: 'Error recording vote', error });
  }
};