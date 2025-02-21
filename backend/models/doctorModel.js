import mongoose from "mongoose";

const doctorModel = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile_No: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    yearOfPractice: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    } 
}, { timestamps: true });

export const Doctor = mongoose.model("Doctor", doctorModel);
