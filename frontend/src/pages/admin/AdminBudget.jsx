import React, { useState } from 'react';
import { DollarSign, TrendingUp, PieChart, FileText } from 'lucide-react';

function AdminBudget() {
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

  const handleAddCategory = () => {
    // Logic to add a new budget category
    console.log('Add new budget category');
  };

  const handleEditCategory = (id) => {
    // Logic to edit a budget category
    console.log(`Edit budget category with ID: ${id}`);
  };

  const handleDeleteCategory = (id) => {
    // Logic to delete a budget category
    setBudgetCategories(budgetCategories.filter(category => category.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
        <p className="mt-2 text-gray-600">Manage college budget allocations and expenditures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-green-600">
            <DollarSign className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Total Budget</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">$150,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-blue-600">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Spent</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">$107,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-yellow-600">
            <PieChart className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Remaining</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">$43,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-purple-600">
            <FileText className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Categories</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">2</p>
        </div>
      </div>

      <div className="space-y-6">
        {budgetCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                <div className="flex items-center space-x-4">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditCategory(category.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Allocated</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">${category.allocated}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Spent</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">${category.spent}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">${category.remaining}</p>
                </div>
              </div>
            </div>
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
                        ${expense.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          onClick={handleAddCategory}
        >
          Add New Category
        </button>
      </div>
    </div>
  );
}

export default AdminBudget;