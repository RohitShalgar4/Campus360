import bcrypt from "bcryptjs";
import { Doctor } from "../models/doctorModel.js";

export const registerDoctor = async (req, res) => {
    try {
        const { 
            full_name, email, password, confirmPassword, mobile_No, qualification, yearOfPractice, gender 
        } = req.body;
        
        // Ensure all required fields are included in the request
        if (!full_name || !email || !password || !confirmPassword || !mobile_No || !qualification || !yearOfPractice || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the email ends with a specific domain (e.g., @college.edu)
        if (!email.endsWith('@college.edu')) {
            return res.status(400).json({ message: "Email must end with @college.edu" });
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        
        // Check if email already exists
        const doctor = await Doctor.findOne({ email });
        if (doctor) {
            return res.status(400).json({ message: "Email already exists, try a different one" });
        }
        
        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new doctor with the provided fields
        await Doctor.create({
            full_name,
            email,
            password: hashedPassword,
            mobile_No,
            qualification,
            yearOfPractice,
            gender
        });
        
        return res.status(201).json({
            message: "Doctor account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};