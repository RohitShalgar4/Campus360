import React, { useState } from 'react';
import { DollarSign, TrendingUp, PieChart, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StudentBudget = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const budgetCategories = [
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
  ];

  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const chartData = budgetCategories.map(category => ({
    name: category.name,
    Allocated: category.allocated,
    Spent: category.spent,
    Remaining: category.remaining
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Budget Overview</h1>
        <p className="mt-2 text-gray-600">View college budget allocations and expenditures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-2 text-green-600">
            <DollarSign className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Total Budget</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">₹{totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-2 text-blue-600">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Spent</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-2 text-yellow-600">
            <PieChart className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Remaining</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">₹{totalRemaining.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-2 text-purple-600">
            <FileText className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Categories</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{budgetCategories.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Budget Distribution</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Allocated" fill="#10B981" />
              <Bar dataKey="Spent" fill="#3B82F6" />
              <Bar dataKey="Remaining" fill="#FBBF24" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-6">
        {budgetCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                {expandedCategory === category.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Allocated</p>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    ₹{category.allocated.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Spent</p>
                  <p className="mt-1 text-lg font-semibold text-blue-600">
                    ₹{category.spent.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="mt-1 text-lg font-semibold text-yellow-600">
                    ₹{category.remaining.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            {expandedCategory === category.id && (
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
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
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expense.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString('en-IN', { 
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentBudget;