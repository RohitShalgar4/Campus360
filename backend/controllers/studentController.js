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
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email ends with @college.edu
    if (!email.endsWith("@college.edu")) {
      return res
        .status(400)
        .json({ message: "Email must end with @college.edu" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists
    const user = await Student.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Email already exists, try a different one" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with the updated fields
    await Student.create({
      full_name,
      email,
      password: hashedPassword,
      mobile_No,
      parentEmail,
      student_id,
      class: studentClass,
      department,
      passoutYear,
      gender,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
