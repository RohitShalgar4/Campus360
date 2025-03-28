import mongoose from "mongoose";

// Define the CC Schema
const ccSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
      enum: ["FY", "SY", "TY", "BE"],
    },
    department: {
      type: String,
      required: true,
      enum: ["CSE", "ENTC", "MECH", "ELE", "CIVIL"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CC = mongoose.model("CC", ccSchema);

export default CC;
