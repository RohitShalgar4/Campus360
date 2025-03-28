import bcrypt from "bcryptjs";
import { Admin } from "../models/adminModel.js";
import CC from "../models/ccModel.js";

export const registerAdmin = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      confirmPassword,
      mobile_No,
      designation,
      gender,
    } = req.body;

    // Ensure all required fields are included in the request
    if (
      !full_name ||
      !email ||
      !password ||
      !confirmPassword ||
      !mobile_No ||
      !designation ||
      !gender
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email ends with @college.edu (or any other domain you want)
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
    const admin = await Admin.findOne({ email });
    if (admin) {
      return res
        .status(400)
        .json({ message: "Email already exists, try a different one" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new admin with the updated fields
    await Admin.create({
      full_name,
      email,
      password: hashedPassword,
      mobile_No,
      designation,
      gender,
    });

    return res.status(201).json({
      message: "Admin account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addCC = async (req, res) => {
  try {
    // Use className instead of class since class is a reserved keyword
    const { email, name, className, department, password } = req.body;
    if (!email || !name || !className || !department || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const cc = await CC.create({
      email,
      name,
      className, // Map className to class field in model
      department,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "CC added successfully",
      data: cc,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
