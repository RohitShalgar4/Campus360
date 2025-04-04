import { Student } from "../models/studentModel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      confirmPassword,
      mobile_No,
      parentEmail,
      student_id,
      class: studentClass,
      department,
      passoutYear,
      gender,
    } = req.body;

    // Ensure all required fields are included in the request
    if (
      !full_name ||
      !email ||
      !password ||
      !confirmPassword ||
      !mobile_No ||
      !parentEmail ||
      !student_id ||
      !studentClass ||
      !department ||
      !passoutYear ||
      !gender
    ) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Check if the email ends with @college.edu
    if (!email.endsWith("@college.edu")) {
      return res.status(400).json({ 
        success: false,
        message: "Email must end with @college.edu" 
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Passwords do not match" 
      });
    }

    // Check if email already exists
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false,
        message: "Email already exists, try a different one" 
      });
    }

    // Check if student_id already exists
    const existingStudentId = await Student.findOne({ student_id });
    if (existingStudentId) {
      return res.status(400).json({ 
        success: false,
        message: "Student ID already exists, try a different one" 
      });
    }

    // Validate class
    if (!["FY", "SY", "TY", "BE"].includes(studentClass.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid class. Must be one of: FY, SY, TY, BE"
      });
    }

    // Validate department
    if (!["CSE", "ENTC", "Electrical", "Mechanical", "Civil"].includes(department.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid department. Must be one of: CSE, ENTC, Electrical, Mechanical, Civil"
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with the updated fields
    const newStudent = await Student.create({
      full_name,
      email,
      password: hashedPassword,
      mobile_No,
      parentEmail,
      student_id,
      class: studentClass.toUpperCase(),
      department: department.toUpperCase(),
      passoutYear,
      gender,
      isFirstLogin: true
    });

    if (!newStudent) {
      return res.status(500).json({ 
        success: false,
        message: "Failed to create student account" 
      });
    }

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        id: newStudent._id,
        full_name: newStudent.full_name,
        email: newStudent.email,
        student_id: newStudent.student_id,
        department: newStudent.department,
        class: newStudent.class,
        gender: newStudent.gender
      }
    });
  } catch (error) {
    console.error("Student registration error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error while registering student",
      error: error.message 
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching students",
      error: error.message 
    });
  }
};
