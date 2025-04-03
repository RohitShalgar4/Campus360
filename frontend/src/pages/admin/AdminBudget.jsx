import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  FileText,
  X,
  Image,
  Edit2,
  Check,
  Trash2,
  File,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
} from "../../services/budgetService";

const AdminBudget = () => {
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpenses, setNewExpenses] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
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

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await getAllExpenses();

      if (!response || !Array.isArray(response)) {
        console.error("Invalid response format:", response);
        toast.error("Invalid data received from server");
        return;
      }

      // First, fetch all categories to ensure we have the latest data
      const categoriesResponse = await fetch(
        "http://localhost:8080/api/v1/budget/categories",
        {
          credentials: "include",
        }
      );

      if (!categoriesResponse.ok) {
        throw new Error("Failed to fetch categories");
      }

      const categoriesData = await categoriesResponse.json();
      const categories = categoriesData.data || [];

      // Create a map of category data
      const categoryMap = categories.reduce((acc, category) => {
        acc[category.name] = {
          id: category.name,
          name: category.name,
          allocated: category.allocated || 0,
          spent: 0,
          remaining: category.allocated || 0,
          expenses: [],
        };
        return acc;
      }, {});

      // Group expenses by category
      response.forEach((expense) => {
        if (!categoryMap[expense.category]) {
          // If category doesn't exist in our map, create it
          categoryMap[expense.category] = {
            id: expense.category,
            name: expense.category,
            allocated: 0,
            spent: 0,
            remaining: 0,
            expenses: [],
          };
        }

        // Add expense to category
        categoryMap[expense.category].expenses.push({
          id: expense._id,
          title: expense.title || expense.description,
          description: expense.description,
          amount: expense.amount,
          date: new Date(expense.date).toISOString().split("T")[0],
          billImage: expense.receipt?.url || null,
        });

        // Update spent amount
        categoryMap[expense.category].spent += expense.amount;
      });

      // Convert to array and calculate remaining
      const budgetCategories = Object.values(categoryMap).map((category) => ({
        ...category,
        remaining: category.allocated - category.spent,
      }));

      console.log("Fetched budget categories:", budgetCategories);
      setBudgetCategories(budgetCategories);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error(error.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const getNewExpense = (categoryId) => {
    return (
      newExpenses[categoryId] || {
        title: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        billImage: null,
      }
    );
  };

  const updateNewExpense = (categoryId, updates) => {
    setNewExpenses((prev) => ({
      ...prev,
      [categoryId]: {
        ...getNewExpense(categoryId),
        ...updates,
      },
    }));
    setFormErrors({});
  };

  const validateExpenseForm = (expense) => {
    const errors = {};
    if (!expense.title?.trim()) errors.title = "Title is required";
    if (!expense.description?.trim())
      errors.description = "Description is required";
    if (!expense.amount || expense.amount <= 0)
      errors.amount = "Amount must be greater than 0";
    if (!expense.date) errors.date = "Date is required";
    if (!expense.billImage) errors.billImage = "Bill image is required";
    return errors;
  };

  const totalBudget = budgetCategories.reduce(
    (sum, cat) => sum + (cat.allocated || 0),
    0
  );
  const totalSpent = budgetCategories.reduce(
    (sum, cat) => sum + (cat.spent || 0),
    0
  );
  const totalRemaining = totalBudget - totalSpent;

  const handleAddCategory = () => {
    setEditingCategory({
      id: Date.now(),
      name: categories[0] || "",
      allocated: 0,
      spent: 0,
      remaining: 0,
      expenses: [],
    });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
    setShowModal(true);
  };

  const handleSaveCategory = async () => {
    if (editingCategory) {
      // Show confirmation modal
      setShowConfirmationModal(true);
    }
  };

  const confirmSaveCategory = async () => {
    try {
      setLoading(true);
      const categoryData = {
        name: editingCategory.name,
        allocated: editingCategory.allocated,
      };

      const response = await fetch(
        "http://localhost:8080/api/v1/budget/category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save category");
      }

      const savedCategory = await response.json();
      console.log("Saved category:", savedCategory);

      // Update the budget categories state
      setBudgetCategories((prev) => {
        const exists = prev.find((cat) => cat.name === savedCategory.data.name);
        if (exists) {
          return prev.map((cat) =>
            cat.name === savedCategory.data.name ? savedCategory.data : cat
          );
        }
        // Add the new category with initial values
        return [
          ...prev,
          {
            id: savedCategory.data.name,
            name: savedCategory.data.name,
            allocated: savedCategory.data.allocated,
            spent: 0,
            remaining: savedCategory.data.allocated,
            expenses: [],
          },
        ];
      });

      toast.success("Category saved successfully!");

      // Fetch updated data to ensure everything is in sync
      await fetchExpenses();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.message || "Failed to save category");
    } finally {
      setLoading(false);
      setShowModal(false);
      setShowConfirmationModal(false);
      setEditingCategory(null);
    }
  };

  const handleAddExpense = async (categoryId) => {
    const expense = getNewExpense(categoryId);
    const errors = validateExpenseForm(expense);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill all required fields including bill image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", expense.title);
      formData.append("description", expense.description);
      formData.append("amount", expense.amount);
      const category = budgetCategories.find((cat) => cat.id === categoryId);
      if (!category) {
        throw new Error("Invalid category selected");
      }
      formData.append("category", category.name);
      formData.append("date", expense.date);
      formData.append("receipt", expense.billImage);

      await addExpense(formData);
      toast.success("Expense added successfully!");
      await fetchExpenses();

      updateNewExpense(categoryId, {
        title: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        billImage: null,
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error(error.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (categoryId, expense) => {
    setEditingExpense({ ...expense, categoryId });
    updateNewExpense(categoryId, expense);
  };

  const handleUpdateExpense = async (categoryId) => {
    const updatedExpense = getNewExpense(categoryId);
    const errors = validateExpenseForm(updatedExpense);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill all required fields including bill image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", updatedExpense.title);
      formData.append("description", updatedExpense.description);
      formData.append("amount", updatedExpense.amount);
      formData.append("category", categoryId);
      formData.append("date", updatedExpense.date);
      formData.append("receipt", updatedExpense.billImage);

      await updateExpense(editingExpense.id, formData);
      toast.success("Expense updated successfully!");
      await fetchExpenses();

      setEditingExpense(null);
      updateNewExpense(categoryId, {
        title: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        billImage: null,
      });
    } catch (error) {
      toast.error(error.message || "Failed to update expense");
      console.error("Error updating expense:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBillUpload = (categoryId, event) => {
    if (
      !event ||
      !event.target ||
      !event.target.files ||
      !event.target.files[0]
    ) {
      toast.error("No file selected");
      return;
    }

    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only image files (JPEG, PNG, JPG) are allowed");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    updateNewExpense(categoryId, { billImage: file });
    toast.success("Bill image uploaded successfully!");
  };

  const handleViewBill = (expense) => {
    if (!expense.billImage) {
      toast.error("No bill available");
      return;
    }

    setSelectedBill({
      billImage: expense.billImage,
    });
    setShowBillModal(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/v1/budget/category/${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      // Update the UI state
      setBudgetCategories((prev) =>
        prev.filter((category) => category.id !== id)
      );
      toast.success("Category deleted successfully!");

      // Fetch updated data to ensure everything is in sync
      await fetchExpenses();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = (categoryId, expense) => {
    setExpenseToDelete({ ...expense, categoryId });
    setShowDeleteModal(true);
  };

  const confirmDeleteExpense = async () => {
    const { id } = expenseToDelete;

    try {
      setLoading(true);
      await deleteExpense(id);
      toast.success("Expense deleted successfully!");
      await fetchExpenses();
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete expense");
      console.error("Error deleting expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
        <p className="mt-2 text-gray-600">
          Manage college budget allocations and expenditures
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-green-600">
            <DollarSign className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Total Budget</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ₹{totalBudget.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-blue-600">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Spent</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ₹{totalSpent.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-yellow-600">
            <PieChart className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Remaining</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ₹{totalRemaining.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-purple-600">
            <FileText className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Categories</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {budgetCategories.length}
          </p>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-6">
        {budgetCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {category.name}
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Allocated</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    ₹{category.allocated.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Spent</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    ₹{category.spent.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    ₹{category.remaining.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Add/Edit Expense Form */}
              <div className="mt-6 space-y-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Title"
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      formErrors.title ? "border-red-500" : ""
                    }`}
                    value={getNewExpense(category.id).title}
                    onChange={(e) =>
                      updateNewExpense(category.id, { title: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      formErrors.description ? "border-red-500" : ""
                    }`}
                    value={getNewExpense(category.id).description}
                    onChange={(e) =>
                      updateNewExpense(category.id, {
                        description: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    className={`w-32 px-4 py-2 border rounded-lg ${
                      formErrors.amount ? "border-red-500" : ""
                    }`}
                    value={getNewExpense(category.id).amount}
                    onChange={(e) =>
                      updateNewExpense(category.id, { amount: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    className={`w-40 px-4 py-2 border rounded-lg ${
                      formErrors.date ? "border-red-500" : ""
                    }`}
                    value={getNewExpense(category.id).date}
                    onChange={(e) =>
                      updateNewExpense(category.id, { date: e.target.value })
                    }
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`billUpload-${category.id}`}
                      onChange={(e) => handleBillUpload(category.id, e)}
                    />
                    <label
                      htmlFor={`billUpload-${category.id}`}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center ${
                        formErrors.billImage ? "ring-2 ring-red-500" : ""
                      }`}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      {getNewExpense(category.id).billImage
                        ? "Change Image"
                        : "Upload Image"}
                    </label>
                  </div>
                  {/* Updated button logic */}
                  {editingExpense &&
                  editingExpense.categoryId === category.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateExpense(category.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setEditingExpense(null);
                          updateNewExpense(category.id, {
                            title: "",
                            description: "",
                            amount: "",
                            date: new Date().toISOString().split("T")[0],
                            billImage: null,
                          });
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddExpense(category.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add Expense
                    </button>
                  )}
                </div>
                {Object.keys(formErrors).length > 0 && (
                  <div className="text-red-500 text-sm mt-2">
                    {Object.values(formErrors).map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Expenses Table */}
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(category.expenses || []).map((expense) => (
                    <tr
                      key={expense.id}
                      className={`transition-colors duration-200 ${
                        editingExpense?.id === expense.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {expense.billImage && (
                          <button
                            onClick={() => handleViewBill(expense)}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          >
                            <Image className="h-4 w-4 mr-2" />
                            View Bill
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() =>
                              handleEditExpense(category.id, expense)
                            }
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteExpense(category.id, expense)
                            }
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add New Category
        </button>
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingCategory.id ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Allocated Budget"
                className="w-full px-4 py-2 border rounded-lg"
                value={editingCategory.allocated}
                onChange={(e) =>
                  setEditingCategory((prev) => ({
                    ...prev,
                    allocated: parseFloat(e.target.value),
                  }))
                }
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && expenseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Expense
              </h3>
              <p className="mt-2 text-gray-600">
                Are you sure you want to delete the expense "
                {expenseToDelete.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setExpenseToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                No, Cancel
              </button>
              <button
                onClick={confirmDeleteExpense}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Budget Update</h3>
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Do you want to continue with the budget for{" "}
              {editingCategory?.name} with Budget ₹
              {editingCategory?.allocated?.toLocaleString()}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveCategory}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bill View Modal */}
      {showBillModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bill Viewer</h3>
              <button
                onClick={() => {
                  setShowBillModal(false);
                  setSelectedBill(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative h-[70vh]">
              <img
                src={selectedBill.billImage}
                alt="Bill"
                className="w-full h-full object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  toast.error("Failed to load bill image");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBudget;
