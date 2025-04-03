import bcrypt from "bcryptjs";
import { Admin } from "../models/adminModel.js";
import { Student } from "../models/studentModel.js";
import jwt from "jsonwebtoken";
import { Doctor } from "../models/doctorModel.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!email.endsWith("@college.edu")) {
      return res
        .status(400)
        .json({ message: "Email must end with @college.edu" });
    }

    // Check in Student schema
    let user = await Student.findOne({ email });
    let role = "student";

    if (!user) {
      // If not a student, check in Admin schema
      user = await Admin.findOne({ email });
      role = "admin";
    }

    if (!user) {
      // If not an admin, check in Doctor schema
      user = await Doctor.findOne({ email });
      role = "doctor";
    }

    // If no user is found in any schema
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password" });
    }

    // Check if the password matches
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password" });
    }

    // Generate a JWT token
    const tokenData = {
      id: user._id,
      role,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Prepare user data based on role
    let userData = {
      id: user._id,
      fullName: user.full_name,
      email: user.email,
    };

    // Add role-specific data
    if (role === "student") {
      userData = {
        ...userData,
        department: user.department,
        class: user.class,
        studentId: user.student_id,
      };
    } else if (role === "admin") {
      userData = {
        ...userData,
        designation: user.designation,
      };
    } else if (role === "doctor") {
      userData = {
        ...userData,
        qualification: user.qualification,
      };
    }

    console.log("Login response user data:", userData);

    // Send the response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        token,
        role,
        user: userData,
        message: "Logged in successfully",
      });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    // Clear the token cookie with all necessary options
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
};

export const validateToken = async (req, res) => {
  try {
    // If we reach here, it means the token is valid (checked by authenticateToken middleware)
    // We can optionally fetch fresh user data here if needed
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      user: {
        id: req.user.id,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
