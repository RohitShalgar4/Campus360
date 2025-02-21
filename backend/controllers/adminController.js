import bcrypt from "bcryptjs";
import { Admin } from "../models/adminModel.js"; 

export const registerAdmin = async (req, res) => {
    try {
        const { 
            full_name, email, password, confirmPassword, mobile_No, designation, gender 
        } = req.body;
        
        // Ensure all required fields are included in the request
        if (!full_name || !email || !password || !confirmPassword || !mobile_No || !designation || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the email ends with @college.edu (or any other domain you want)
        if (!email.endsWith('@college.edu')) {
            return res.status(400).json({ message: "Email must end with @college.edu" });
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        
        // Check if email already exists
        const admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: "Email already exists, try a different one" });
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
            gender
        });
        
        return res.status(201).json({
            message: "Admin account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};