import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

// Add new expense
export const addExpense = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/budget/add`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error in addExpense service:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message };
    }
};

// Get all expenses
export const getAllExpenses = async () => {
    try {
        const response = await fetch(`${API_URL}/budget/all`, {
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch expenses');
        }

        const data = await response.json();
        
        // Check if data exists and has the expected structure
        if (!data || !data.data) {
            throw new Error('Invalid response format from server');
        }

        return data.data;
    } catch (error) {
        console.error('Error in getAllExpenses service:', error);
        throw error;
    }
};

// Get expense by ID
export const getExpenseById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/budget/${id}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error in getExpenseById service:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message };
    }
};

// Update expense
export const updateExpense = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}/budget/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error in updateExpense service:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message };
    }
};

// Delete expense
export const deleteExpense = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/budget/${id}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error in deleteExpense service:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message };
    }
};

export const getStudentBudget = async () => {
  try {
    const response = await fetch(`${API_URL}/budget/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch budget data');
    }

    const data = await response.json();
    console.log('Raw budget data:', data); // Debug log
    
    if (!data || !data.data) {
      throw new Error('Invalid response format from server');
    }

    // Group expenses by category for student view
    const categories = {};
    data.data.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = {
          _id: expense.category,
          name: expense.category,
          allocated: expense.allocated || 0,
          spent: 0,
          remaining: expense.allocated || 0,
          expenses: []
        };
      }
      
      categories[expense.category].expenses.push({
        _id: expense._id,
        description: expense.description,
        amount: expense.amount,
        date: expense.date
      });
      
      categories[expense.category].spent += expense.amount;
      categories[expense.category].remaining = 
        categories[expense.category].allocated - 
        categories[expense.category].spent;
    });

    // Ensure all categories have the correct allocated amount
    const categoryResponse = await fetch(`${API_URL}/budget/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (categoryResponse.ok) {
      const categoryData = await categoryResponse.json();
      if (categoryData && categoryData.data) {
        categoryData.data.forEach(category => {
          if (categories[category.name]) {
            categories[category.name].allocated = category.allocated;
            categories[category.name].remaining = category.allocated - categories[category.name].spent;
          }
        });
      }
    }

    const result = Object.values(categories);
    console.log('Processed budget data:', result); // Debug log
    return { data: result };
  } catch (error) {
    console.error('Error in getStudentBudget service:', error);
    throw error;
  }
}; 