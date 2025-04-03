// controllers/electionController.js
import { Election } from "../models/electionModel.js";
import { Student } from "../models/studentModel.js";

// Create a new election
export const createElection = async (req, res) => {
  try {
    const {
      title,
      description,
      deadline,
      candidates,
      level,
      department,
      year,
    } = req.body;
    const createdBy = "admin1"; // Replace with actual admin ID

    console.log("Creating election with data:", {
      title,
      level,
      department,
      year,
    });

    // Validate level-based requirements
    if (level === "College Level" && (department || year)) {
      return res.status(400).json({
        message:
          "Department and year should not be provided for College Level elections",
      });
    }

    if (level === "Departmental Level" && !department) {
      return res.status(400).json({
        message: "Department is required for Departmental Level elections",
      });
    }

    if (level === "Class Level" && (!department || !year)) {
      return res.status(400).json({
        message:
          "Both department and year are required for Class Level elections",
      });
    }

    // Validate department value
    if (
      department &&
      !["CSE", "ENTC", "Electrical", "Mechanical", "Civil"].includes(department)
    ) {
      return res.status(400).json({
        message:
          "Invalid department. Must be one of: CSE, ENTC, Electrical, Mechanical, Civil",
        receivedDepartment: department,
      });
    }

    // Validate year value for Class Level elections
    if (level === "Class Level" && !["FY", "SY", "TY", "BE"].includes(year)) {
      return res.status(400).json({
        message: "Invalid year. Must be one of: FY, SY, TY, BE",
        receivedYear: year,
      });
    }

    const election = new Election({
      title,
      description,
      deadline,
      candidates: candidates || [],
      level,
      department,
      year,
      totalVoters: 0,
      voted: 0,
      boysVoted: 0,
      girlsVoted: 0,
      departmentStats: {},
      createdBy,
      votedStudents: [],
    });

    console.log("Saving election:", election);

    await election.save();
    res.status(201).json(election);
  } catch (error) {
    console.error("Error creating election:", error);
    res
      .status(500)
      .json({ message: "Error creating election", error: error.message });
  }
};

// Get all elections (admin only)
export const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find({ createdBy: "admin1" });
    res.status(200).json(elections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching elections", error });
  }
};

// Get elections for a student based on their eligibility
export const getStudentElections = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Student details:", {
      id: student._id,
      department: student.department,
      class: student.class,
      name: student.full_name,
    });

    // Get current date for active elections
    const currentDate = new Date();

    // First, get all active elections
    const allActiveElections = await Election.find({
      deadline: { $gt: currentDate },
    });

    console.log(
      "All active elections:",
      allActiveElections.map((e) => ({
        title: e.title,
        level: e.level,
        department: e.department,
        year: e.year,
        deadline: e.deadline,
        _id: e._id,
        isActive: new Date(e.deadline) > currentDate,
      }))
    );

    // Build query for active elections based on student eligibility
    const query = {
      deadline: { $gt: currentDate }, // Only show active elections
      $or: [
        // College Level elections are visible to all students
        { level: "College Level" },

        // Departmental Level elections are visible to students of that department
        {
          level: "Departmental Level",
          department: student.department,
        },

        // Class Level elections are visible to students of that department and year
        {
          level: "Class Level",
          department: student.department,
          year: student.class,
        },
      ],
    };

    console.log("Query for elections:", JSON.stringify(query, null, 2));

    // Fetch elections and populate necessary fields
    const elections = await Election.find(query)
      .select({
        title: 1,
        description: 1,
        deadline: 1,
        level: 1,
        department: 1,
        year: 1,
        candidates: 1,
        votedStudents: 1,
        totalVoters: 1,
        voted: 1,
        departmentStats: 1,
      })
      .sort({ deadline: 1 }); // Sort by closest deadline first

    console.log(
      "Found elections:",
      elections.map((e) => ({
        title: e.title,
        level: e.level,
        department: e.department,
        year: e.year,
        deadline: e.deadline,
        _id: e._id,
        matchesDepartment: e.department === student.department,
        matchesYear: e.year === student.class,
      }))
    );

    // Add student eligibility info to each election
    const electionsWithEligibility = elections.map((election) => {
      let isEligible = false;
      let eligibilityMessage = "";

      switch (election.level) {
        case "College Level":
          isEligible = true;
          eligibilityMessage =
            "All students are eligible for college-level elections";
          break;
        case "Departmental Level":
          isEligible = election.department === student.department;
          eligibilityMessage = isEligible
            ? `You are eligible to vote in this ${student.department} department election`
            : `Only ${election.department} department students can vote in this election`;
          break;
        case "Class Level":
          isEligible =
            election.department === student.department &&
            election.year === student.class;
          eligibilityMessage = isEligible
            ? `You are eligible to vote in this ${student.department} ${student.class} election`
            : `Only ${election.department} ${election.year} students can vote in this election`;
          break;
      }

      console.log("Election eligibility check:", {
        electionTitle: election.title,
        electionLevel: election.level,
        electionDepartment: election.department,
        electionYear: election.year,
        studentDepartment: student.department,
        studentClass: student.class,
        isEligible,
        eligibilityMessage,
        matchesDepartment: election.department === student.department,
        matchesYear: election.year === student.class,
      });

      return {
        ...election.toObject(),
        isEligible,
        eligibilityMessage,
        studentDepartment: student.department,
        studentYear: student.class,
      };
    });

    // Filter out ineligible elections
    const eligibleElections = electionsWithEligibility.filter(
      (election) => election.isEligible
    );

    console.log(
      "Final eligible elections:",
      eligibleElections.map((e) => ({
        title: e.title,
        level: e.level,
        department: e.department,
        year: e.year,
        isEligible: e.isEligible,
        eligibilityMessage: e.eligibilityMessage,
        studentDepartment: e.studentDepartment,
        studentYear: e.studentYear,
        _id: e._id,
      }))
    );

    res.status(200).json(eligibleElections);
  } catch (error) {
    console.error("Error fetching student elections:", error);
    res
      .status(500)
      .json({ message: "Error fetching elections", error: error.message });
  }
};

// Get a single election by ID
export const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    res.status(200).json(election);
  } catch (error) {
    res.status(500).json({ message: "Error fetching election", error });
  }
};

// Update an election
export const updateElection = async (req, res) => {
  try {
    const { title, description, deadline, level, department, year } = req.body;

    // Validate level-based requirements
    if (level === "College Level" && (department || year)) {
      return res.status(400).json({
        message:
          "Department and year should not be provided for College Level elections",
      });
    }

    if (level === "Departmental Level" && !department) {
      return res.status(400).json({
        message: "Department is required for Departmental Level elections",
      });
    }

    if (level === "Class Level" && (!department || !year)) {
      return res.status(400).json({
        message:
          "Both department and year are required for Class Level elections",
      });
    }

    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { title, description, deadline, level, department, year },
      { new: true }
    );
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    res.status(200).json(election);
  } catch (error) {
    res.status(500).json({ message: "Error updating election", error });
  }
};

// Delete an election
export const deleteElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    res.status(200).json({ message: "Election deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting election", error });
  }
};

// Vote for a candidate
export const voteForCandidate = async (req, res) => {
  try {
    const { electionId, candidateId } = req.params;
    const { studentId } = req.body;

    // Fetch student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    // Check if election is still active
    if (new Date(election.deadline) < new Date()) {
      return res
        .status(400)
        .json({ message: "Voting is closed for this election" });
    }

    // Check if student has already voted
    if (election.votedStudents.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "You have already voted in this election" });
    }

    // Check student eligibility based on election level
    if (
      election.level === "Departmental Level" &&
      election.department !== student.department
    ) {
      return res
        .status(403)
        .json({ message: "You are not eligible to vote in this election" });
    }

    if (
      election.level === "Class Level" &&
      (election.department !== student.department ||
        election.year !== student.class)
    ) {
      return res
        .status(403)
        .json({ message: "You are not eligible to vote in this election" });
    }

    // Find the candidate and update their votes
    const candidate = election.candidates.id(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.votes += 1;
    election.votedStudents.push(studentId);
    election.voted += 1;

    // Update department stats
    const currentDeptVotes =
      election.departmentStats.get(student.department) || 0;
    election.departmentStats.set(student.department, currentDeptVotes + 1);

    // Update gender stats
    if (student.gender === "Male") {
      election.boysVoted += 1;
    } else if (student.gender === "Female") {
      election.girlsVoted += 1;
    }

    await election.save();

    res.status(200).json({
      message: "Vote recorded successfully",
      election,
    });
  } catch (error) {
    res.status(500).json({ message: "Error recording vote", error });
  }
};
