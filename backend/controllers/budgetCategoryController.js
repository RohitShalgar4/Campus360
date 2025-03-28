import BudgetCategory from '../models/budgetCategoryModel.js';
import Budget from '../models/budgetModel.js';

// Add or update budget category
export const addBudgetCategory = async (req, res) => {
    try {
        const { name, allocated } = req.body;

        // Find existing category or create new one
        let category = await BudgetCategory.findOne({ name });

        if (category) {
            // Update existing category
            category.allocated = allocated;
            await category.save();
        } else {
            // Create new category
            category = await BudgetCategory.create({
                name,
                allocated,
                spent: 0,
                remaining: allocated
            });
        }

        // Update spent amount based on existing expenses
        const expenses = await Budget.find({ category: name });
        const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        category.spent = totalSpent;
        category.remaining = category.allocated - totalSpent;
        await category.save();

        res.status(201).json({
            success: true,
            message: 'Budget category saved successfully',
            data: category
        });
    } catch (error) {
        console.error('Error in addBudgetCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving budget category',
            error: error.message
        });
    }
};

// Get all budget categories
export const getAllBudgetCategories = async (req, res) => {
    try {
        const categories = await BudgetCategory.find();
        
        // Calculate spent amount for each category
        for (let category of categories) {
            const expenses = await Budget.find({ category: category.name });
            category.spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            category.remaining = category.allocated - category.spent;
            await category.save();
        }

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error in getAllBudgetCategories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching budget categories',
            error: error.message
        });
    }
};

// Update category spent amount when expense is added
export const updateCategorySpent = async (categoryName, amount) => {
    try {
        const category = await BudgetCategory.findOne({ name: categoryName });
        if (category) {
            category.spent += amount;
            category.remaining = category.allocated - category.spent;
            await category.save();
        }
    } catch (error) {
        console.error('Error updating category spent:', error);
        throw error;
    }
}; 