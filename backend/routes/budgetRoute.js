import express from "express";
import multer from "multer";
import { authenticateToken, isAdmin } from "../middleware/authenticateToken.js";
import {
    addExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
} from "../controllers/budgetController.js";
import {
    addBudgetCategory,
    getAllBudgetCategories
} from "../controllers/budgetCategoryController.js";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and PDF files are allowed.'), false);
    }
};

// Configure upload limits
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Protected routes (require authentication and admin access)
router.use(authenticateToken);
router.use(isAdmin);

// Budget category routes
router.post("/category", addBudgetCategory);
router.get("/categories", getAllBudgetCategories);

// Expense routes
router.post("/add", upload.single('receipt'), addExpense);
router.get("/all", getAllExpenses);
router.get("/:id", getExpenseById);
router.put("/:id", upload.single('receipt'), updateExpense);
router.delete("/:id", deleteExpense);

// Allow students to access the /budget/all endpoint
router.use(authenticateToken);
router.get("/all", getAllExpenses);

export default router; 