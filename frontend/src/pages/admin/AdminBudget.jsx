import React, { useState } from 'react';
import { DollarSign, TrendingUp, PieChart, FileText, X, Image, Edit2, Check, Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminBudget = () => {
  const [budgetCategories, setBudgetCategories] = useState([
    {
      id: 1,
      name: 'Student Activities',
      allocated: 50000,
      spent: 32000,
      remaining: 18000,
      expenses: [
        { id: 1, description: 'Annual Cultural Fest', amount: 15000, date: '2024-02-15', billImage: null },
        { id: 2, description: 'Sports Tournament', amount: 12000, date: '2024-03-01', billImage: null },
        { id: 3, description: 'Club Activities', amount: 5000, date: '2024-03-10', billImage: null }
      ]
    },
    {
      id: 2,
      name: 'Infrastructure',
      allocated: 100000,
      spent: 75000,
      remaining: 25000,
      expenses: [
        { id: 4, description: 'Library Renovation', amount: 45000, date: '2024-01-20', billImage: null },
        { id: 5, description: 'Computer Lab Upgrade', amount: 30000, date: '2024-02-05', billImage: null }
      ]
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpenses, setNewExpenses] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const getNewExpense = (categoryId) => {
    return newExpenses[categoryId] || {
      description: '',
      amount: '',
      date: '',
      billImage: null
    };
  };

  const updateNewExpense = (categoryId, updates) => {
    setNewExpenses(prev => ({
      ...prev,
      [categoryId]: {
        ...getNewExpense(categoryId),
        ...updates
      }
    }));
    // Clear any errors when user makes changes
    setFormErrors({});
  };

  const validateExpenseForm = (expense) => {
    const errors = {};
    if (!expense.description) errors.description = 'Description is required';
    if (!expense.amount) errors.amount = 'Amount is required';
    if (!expense.date) errors.date = 'Date is required';
    if (!expense.billImage) errors.billImage = 'Bill image is required';
    return errors;
  };

  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const handleAddCategory = () => {
    setEditingCategory({
      id: Date.now(),
      name: '',
      allocated: 0,
      spent: 0,
      remaining: 0,
      expenses: []
    });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
    setShowModal(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      const updatedCategory = {
        ...editingCategory,
        remaining: editingCategory.allocated - editingCategory.spent
      };

      setBudgetCategories(prev => {
        const exists = prev.find(cat => cat.id === updatedCategory.id);
        if (exists) {
          return prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat);
        }
        return [...prev, updatedCategory];
      });
    }
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleAddExpense = (categoryId) => {
    const expense = getNewExpense(categoryId);
    const errors = validateExpenseForm(expense);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill all required fields including bill image');
      return;
    }

    setBudgetCategories(prev => {
      return prev.map(category => {
        if (category.id === categoryId) {
          const newExpense = {
            id: Date.now(),
            ...expense,
            amount: parseFloat(expense.amount)
          };
          const updatedExpenses = [...category.expenses, newExpense];
          const spent = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          
          return {
            ...category,
            expenses: updatedExpenses,
            spent,
            remaining: category.allocated - spent
          };
        }
        return category;
      });
    });

    // Clear only the form for this specific category
    updateNewExpense(categoryId, {
      description: '',
      amount: '',
      date: '',
      billImage: null
    });
    
    toast.success('Expense added successfully!');
  };

  const handleEditExpense = (categoryId, expense) => {
    setEditingExpense({ ...expense, categoryId });
    updateNewExpense(categoryId, expense);
  };

  const handleUpdateExpense = (categoryId) => {
    const updatedExpense = getNewExpense(categoryId);
    const errors = validateExpenseForm(updatedExpense);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill all required fields including bill image');
      return;
    }

    setBudgetCategories(prev => {
      return prev.map(category => {
        if (category.id === categoryId) {
          const updatedExpenses = category.expenses.map(exp => 
            exp.id === editingExpense.id 
              ? { ...exp, ...updatedExpense, amount: parseFloat(updatedExpense.amount) }
              : exp
          );
          const spent = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          
          return {
            ...category,
            expenses: updatedExpenses,
            spent,
            remaining: category.allocated - spent
          };
        }
        return category;
      });
    });

    setEditingExpense(null);
    updateNewExpense(categoryId, {
      description: '',
      amount: '',
      date: '',
      billImage: null
    });
    
    toast.success('Expense updated successfully!');
  };

  const handleBillUpload = (categoryId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateNewExpense(categoryId, { billImage: reader.result });
        toast.success('Bill image uploaded successfully!');
      };
      reader.onerror = () => {
        toast.error('Failed to upload bill image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowBillModal(true);
  };

  const handleDeleteCategory = (id) => {
    setBudgetCategories(prev => prev.filter(category => category.id !== id));
  };

  const handleDeleteExpense = (categoryId, expense) => {
    setExpenseToDelete({ ...expense, categoryId });
    setShowDeleteModal(true);
  };

  const confirmDeleteExpense = () => {
    const { categoryId, id } = expenseToDelete;
    
    setBudgetCategories(prev => {
      return prev.map(category => {
        if (category.id === categoryId) {
          const updatedExpenses = category.expenses.filter(exp => exp.id !== id);
          const spent = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          
          return {
            ...category,
            expenses: updatedExpenses,
            spent,
            remaining: category.allocated - spent
          };
        }
        return category;
      });
    });

    setShowDeleteModal(false);
    setExpenseToDelete(null);
    toast.success('Expense deleted successfully!');
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
        <p className="mt-2 text-gray-600">Manage college budget allocations and expenditures</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-green-600">
            <DollarSign className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Total Budget</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">₹{totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-blue-600">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Spent</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-yellow-600">
            <PieChart className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Remaining</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">₹{totalRemaining.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-purple-600">
            <FileText className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Categories</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{budgetCategories.length}</p>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-6">
        {budgetCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
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
                  <p className="mt-1 text-lg font-semibold text-gray-900">₹{category.allocated.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Spent</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">₹{category.spent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">₹{category.remaining.toLocaleString()}</p>
                </div>
              </div>

              {/* Add/Edit Expense Form */}
              <div className="mt-6 space-y-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Description"
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      formErrors.description ? 'border-red-500' : ''
                    }`}
                    value={getNewExpense(category.id).description}
                    onChange={(e) => updateNewExpense(category.id, { description: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    className={`w-32 px-4 py-2 border rounded-lg ${
                      formErrors.amount ? 'border-red-500' : ''
                    }`}
                    value={getNewExpense(category.id).amount}
                    onChange={(e) => updateNewExpense(category.id, { amount: e.target.value })}
                  />
                  <input
                    type="date"
                    className={`w-40 px-4 py-2 border rounded-lg ${
                      formErrors.date ? 'border-red-500' : ''
                    }`}
                    value={getNewExpense(category.id).date}
                    onChange={(e) => updateNewExpense(category.id, { date: e.target.value })}
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
                        formErrors.billImage ? 'ring-2 ring-red-500' : ''
                      }`}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      {getNewExpense(category.id).billImage ? 'Change Bill' : 'Upload Bill'}
                    </label>
                  </div>
                  {editingExpense?.categoryId === category.id ? (
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
                            description: '',
                            amount: '',
                            date: '',
                            billImage: null
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
                  {category.expenses.map((expense) => (
                    <tr key={expense.id} className={`transition-colors duration-200 ${
                      editingExpense?.id === expense.id ? 'bg-blue-50' : ''
                    }`}>
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
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          >
                            View Bill
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => handleEditExpense(category.id, expense)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(category.id, expense)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingCategory.id ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                className="w-full px-4 py-2 border rounded-lg"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Allocated Budget"
                className="w-full px-4 py-2 border rounded-lg"
                value={editingCategory.allocated}
                onChange={(e) => setEditingCategory(prev => ({ ...prev, allocated: parseFloat(e.target.value) }))}
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
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bill View Modal */}
      {showBillModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bill Image</h3>
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
            <div className="relative">
              <img
                src={selectedBill.billImage}
                alt="Bill"
                className="w-full h-auto rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && expenseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Expense</h3>
              <p className="mt-2 text-gray-600">
                Are you sure you want to delete the expense "{expenseToDelete.description}"? This action cannot be undone.
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
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBudget;