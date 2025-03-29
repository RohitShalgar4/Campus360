import mongoose from "mongoose";

const studentModel = new mongoose.Schema({
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
    parentEmail: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true,
        unique: true
    },
    class: {
        type: String,
        enum: ["1st", "2nd", "3rd", "4th"],
        required: true
    },
    department: {
        type: String,
        required: true
    },
    passoutYear: {
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

export const Student = mongoose.model("Student", studentModel);
