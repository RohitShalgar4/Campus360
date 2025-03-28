import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        ref: 'BudgetCategory'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    receipt: {
        url: String,
        publicId: String
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }
}, { timestamps: true });

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget; 