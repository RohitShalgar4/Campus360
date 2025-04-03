// models/electionModel.js
import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  votes: { type: Number, default: 0 },
  position: { type: String, required: true },
});

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  level: {
    type: String,
    required: true,
    enum: ["College Level", "Departmental Level", "Class Level"],
  },
  department: {
    type: String,
    enum: ["CSE", "ENTC", "Electrical", "Mechanical", "Civil"],
    required: function () {
      return this.level !== "College Level";
    },
  },
  year: {
    type: String,
    enum: ["FY", "SY", "TY", "BE"],
    required: function () {
      return this.level === "Class Level";
    },
  },
  candidates: [candidateSchema],
  totalVoters: { type: Number, default: 0 },
  voted: { type: Number, default: 0 },
  boysVoted: { type: Number, default: 0 },
  girlsVoted: { type: Number, default: 0 },
  departmentStats: { type: Map, of: Number, default: {} },
  createdBy: { type: String, required: true }, // Track admin who created it
  votedStudents: [{ type: String }], // Track student IDs who voted
});

// Add a pre-save middleware to ensure data consistency
electionSchema.pre("save", function (next) {
  // Ensure department is uppercase
  if (this.department) {
    this.department = this.department.toUpperCase();
  }

  // Ensure year is uppercase
  if (this.year) {
    this.year = this.year.toUpperCase();
  }

  next();
});

const Election = mongoose.model("Election", electionSchema);

export { Election };
