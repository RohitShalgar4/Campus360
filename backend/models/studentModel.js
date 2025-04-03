import mongoose from "mongoose";

const studentModel = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile_No: {
      type: String,
      required: true,
    },
    parentEmail: {
      type: String,
      required: true,
    },
    student_id: {
      type: String,
      required: true,
      unique: true,
    },
    class: {
      type: String,
      enum: ["FY", "SY", "TY", "BE"],
      required: true,
    },
    department: {
      type: String,
      enum: ["CSE", "ENTC", "Electrical", "Mechanical", "Civil"],
      required: true,
      uppercase: true,
    },
    passoutYear: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
  },
  { timestamps: true }
);

// Add a pre-save middleware to ensure department is uppercase
studentModel.pre("save", function (next) {
  if (this.department) {
    this.department = this.department.toUpperCase();
  }
  next();
});

export const Student = mongoose.model("Student", studentModel);
