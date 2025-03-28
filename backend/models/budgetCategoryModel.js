import mongoose from 'mongoose';

const budgetCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: [
            "Utilities",
            "Maintenance",
            "Supplies",
            "Salaries",
            "Academic",
            "Research",
            "Student Services",
            "Library",
            "Sports",
            "Events",
            "Marketing",
            "IT Services",
            "Security",
            "Transportation",
            "Other"
        ]
    },
    allocated: {
        type: Number,
        required: true,
        default: 0
    },
    spent: {
        type: Number,
        default: 0
    },
    remaining: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate remaining budget before saving
budgetCategorySchema.pre('save', function(next) {
    this.remaining = this.allocated - this.spent;
    next();
});

const BudgetCategory = mongoose.model('BudgetCategory', budgetCategorySchema);

export default BudgetCategory; 