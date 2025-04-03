import Budget from "../models/budgetModel.js";
import { uploadMedia, deleteMedia } from "../config/cloudinary.js";
import { Student } from "../models/studentModel.js";
import { updateCategorySpent } from "./budgetCategoryController.js";
import BudgetCategory from "../models/budgetCategoryModel.js";

// Validate file type and size
const validateFile = (file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, JPG, and PDF files are allowed"
    );
  }

  const maxSize =
    file.mimetype === "application/pdf" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    const maxSizeMB = file.mimetype === "application/pdf" ? "10MB" : "5MB";
    throw new Error(
      `File size must be less than ${maxSizeMB} for ${
        file.mimetype === "application/pdf" ? "PDF" : "image"
      } files`
    );
  }
};

// Validate category
const validateCategory = (category) => {
  const validCategories = [
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
    "Other",
  ];

  if (!validCategories.includes(category)) {
    throw new Error(
      "Invalid category. Must be one of the valid categories defined in the system"
    );
  }
};

// Add new expense
export const addExpense = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received file:", req.file);
    console.log("Authenticated user:", req.user);

    // Validate required fields
    const { title, description, amount, category, date } = req.body;
    if (!title || !description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        missingFields: {
          title: !title,
          description: !description,
          amount: !amount,
          category: !category,
          date: !date,
        },
      });
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    // Validate category
    try {
      validateCategory(category);
    } catch (error) {
      console.error("Category validation error:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Receipt file is required",
      });
    }

    try {
      validateFile(req.file);
    } catch (error) {
      console.error("File validation error:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Upload file to Cloudinary
    let receipt;
    try {
      console.log("Starting Cloudinary upload...");
      receipt = await uploadMedia(req.file);
      console.log("Cloudinary upload successful:", receipt);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(500).json({
        success: false,
        message: "Error uploading file to Cloudinary",
        error: error.message,
      });
    }

    // Create new expense
    const newExpense = new Budget({
      title,
      description,
      amount: parsedAmount,
      category,
      date: new Date(date),
      receipt: {
        url: receipt.url,
        publicId: receipt.publicId,
      },
      addedBy: req.user.id,
    });

    await newExpense.save();
    console.log("Expense saved successfully:", newExpense);

    // Update category spent amount
    try {
      await updateCategorySpent(category, parsedAmount);
    } catch (error) {
      console.error("Error updating category spent:", error);
      // Don't fail the request if category update fails
    }

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: newExpense,
    });
  } catch (error) {
    console.error("Error in addExpense:", error);
    res.status(500).json({
      success: false,
      message: "Error adding expense",
      error: error.message,
    });
  }
};

// Get all expenses
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Budget.find().sort({ date: -1 });

    // Get category allocations
    const categories = await BudgetCategory.find();
    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category.name] = {
        allocated: category.allocated,
        spent: category.spent,
        remaining: category.remaining,
      };
    });

    // Add category data to each expense
    const expensesWithCategory = expenses.map((expense) => {
      const categoryData = categoryMap[expense.category] || {
        allocated: 0,
        spent: 0,
        remaining: 0,
      };
      return {
        ...expense.toObject(),
        allocated: categoryData.allocated,
        spent: categoryData.spent,
        remaining: categoryData.remaining,
      };
    });

    res.status(200).json({
      success: true,
      data: expensesWithCategory,
    });
  } catch (error) {
    console.error("Error in getAllExpenses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching expenses",
      error: error.message,
    });
  }
};

// Get expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Budget.findById(req.params.id).populate(
      "addedBy",
      "name email"
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error("Error in getExpenseById:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching expense",
      error: error.message,
    });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  try {
    const { title, description, amount, category, date } = req.body;
    const expense = await Budget.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Validate category if provided
    if (category) {
      validateCategory(category);
    }

    // Handle file upload if new file is provided
    if (req.file) {
      validateFile(req.file);

      // Delete old file from Cloudinary
      if (expense.receipt?.publicId) {
        await deleteMedia(expense.receipt.publicId);
      }

      // Upload new file
      const uploadResult = await uploadMedia(req.file);
      expense.receipt = {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    }

    // Update other fields
    expense.title = title || expense.title;
    expense.description = description || expense.description;
    expense.amount = amount ? parseFloat(amount) : expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;

    await expense.save();

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    console.error("Error in updateExpense:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Error updating expense",
    });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Budget.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Delete file from Cloudinary
    if (expense.receipt?.publicId) {
      await deleteMedia(expense.receipt.publicId);
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteExpense:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting expense",
      error: error.message,
    });
  }
};
