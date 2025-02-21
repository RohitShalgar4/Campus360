import { Student } from "../models/studentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { 
            full_name, email, password, confirmPassword, mobile_No, parentEmail, student_id, 
            class: studentClass, department, passoutYear, gender 
        } = req.body;
        
        // Ensure all required fields are included in the request
        if (!full_name || !email || !password || !confirmPassword || !mobile_No || !parentEmail || 
            !student_id || !studentClass || !department || !passoutYear || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the email ends with @college.edu
        if (!email.endsWith('@college.edu')) {
            return res.status(400).json({ message: "Email must end with @college.edu" });
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        
        // Check if email already exists
        const user = await Student.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists, try a different one" });
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
            gender
        });
        
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };

        // Check if the email ends with @college.edu
        if (!email.endsWith('@college.edu')) {
            return res.status(400).json({ message: "Email must end with @college.edu" });
        }
        
        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            message: "Logged in successfully.",
            success: true,
            role: user.role || "student"
        });
        
    } catch (error) {
        console.log(error);
    }
}
export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully."
        })
    } catch (error) {
        console.log(error);
    }
}