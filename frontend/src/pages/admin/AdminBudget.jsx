import React, { useState } from 'react';
import { DollarSign, TrendingUp, PieChart, FileText, X } from 'lucide-react';

const AdminBudget = () => {
  const [budgetCategories, setBudgetCategories] = useState([
    {
      id: 1,
      name: 'Student Activities',
      allocated: 50000,
      spent: 32000,
      remaining: 18000,
      expenses: [
        { id: 1, description: 'Annual Cultural Fest', amount: 15000, date: '2024-02-15' },
        { id: 2, description: 'Sports Tournament', amount: 12000, date: '2024-03-01' },
        { id: 3, description: 'Club Activities', amount: 5000, date: '2024-03-10' }
      ]
    },
    {
      id: 2,
      name: 'Infrastructure',
      allocated: 100000,
      spent: 75000,
      remaining: 25000,
      expenses: [
        { id: 4, description: 'Library Renovation', amount: 45000, date: '2024-01-20' },
        { id: 5, description: 'Computer Lab Upgrade', amount: 30000, date: '2024-02-05' }
      ]
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: ''
  });

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
    if (!newExpense.description || !newExpense.amount || !newExpense.date) return;

    setBudgetCategories(prev => {
      return prev.map(category => {
        if (category.id === categoryId) {
          const expense = {
            id: Date.now(),
            ...newExpense,
            amount: parseFloat(newExpense.amount)
          };
          const updatedExpenses = [...category.expenses, expense];
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

    setNewExpense({ description: '', amount: '', date: '' });
  };

  const handleDeleteCategory = (id) => {
    setBudgetCategories(prev => prev.filter(category => category.id !== id));
  };

  return (
    <div className="space-y-6">
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

              {/* Add Expense Form */}
              <div className="mt-6 flex space-x-4">
                <input
                  type="text"
                  placeholder="Description"
                  className="flex-1 px-4 py-2 border rounded-lg"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-32 px-4 py-2 border rounded-lg"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                />
                <input
                  type="date"
                  className="w-40 px-4 py-2 border rounded-lg"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                />
                <button
                  onClick={() => handleAddExpense(category.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Expense
                </button>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {category.expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ₹{expense.amount.toLocaleString()}
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
    </div>
  );
};

export default AdminBudget;