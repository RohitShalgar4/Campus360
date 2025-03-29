import mongoose from "mongoose";

const adminModel = new mongoose.Schema({
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
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    isFirstLogin: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const Admin = mongoose.model("Admin", adminModel);
