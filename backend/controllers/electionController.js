// controllers/electionController.js
import { Election } from '../models/electionModel.js';

// Create a new election
export const createElection = async (req, res) => {
  try {
    const { title, description, deadline, candidates } = req.body;
    const createdBy = "admin1"; // Replace with actual admin ID
    const election = new Election({
      title,
      description,
      deadline,
      candidates: candidates || [],
      totalVoters: 0,
      voted: 0,
      boysVoted: 0,
      girlsVoted: 0,
      departmentStats: {},
      createdBy,
      votedStudents: [],
    });
    await election.save();
    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ message: 'Error creating election', error });
  }
};

// Get all elections
export const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find({ createdBy: "admin1" });
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

// Vote for a candidate
export const voteForCandidate = async (req, res) => {
  try {
    const { electionId, candidateId } = req.params;
    const studentId = "student1"; // Replace with actual student ID
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    const candidate = election.candidates.id(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    const position = candidate.position;
    const hasVotedForPosition = election.candidates.some(
      (c) => c.position === position && election.votedStudents.includes(studentId)
    );
    if (hasVotedForPosition) {
      return res.status(400).json({ message: 'You have already voted for this position' });
    }
    candidate.votes += 1;
    election.voted += 1;
    election.votedStudents.push(studentId);
    await election.save();
    res.status(200).json({ message: 'Vote recorded successfully', election });
  } catch (error) {
    res.status(500).json({ message: 'Error recording vote', error });
  }
};