import express from "express";
import {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
  voteForCandidate,
  getStudentElections,
} from "../controllers/electionController.js";
import { authenticateToken, isAdmin } from "../middleware/authenticateToken.js";

const router = express.Router();

// Admin routes (protected)
router.post("/", authenticateToken, isAdmin, createElection);
router.get("/", authenticateToken, isAdmin, getAllElections);
router.put("/:id", authenticateToken, isAdmin, updateElection);
router.delete("/:id", authenticateToken, isAdmin, deleteElection);

// Student routes (require authentication but not admin)
router.get("/student/:studentId", authenticateToken, getStudentElections);
router.get("/:id", authenticateToken, getElectionById);
router.post(
  "/:electionId/vote/:candidateId",
  authenticateToken,
  voteForCandidate
);

export { router as electionRouter };
