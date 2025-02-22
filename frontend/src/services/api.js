import axios from 'axios';

const API_URL = 'http://localhost:8080/api/complaints';

// Fetch all complaints
export const fetchComplaints = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

// Add a new complaint
export const addComplaint = async (complaint) => {
  try {
    const response = await axios.post(API_URL, complaint);
    return response.data;
  } catch (error) {
    console.error('Error adding complaint:', error);
    throw error;
  }
};

// Update complaint status
export const updateComplaintStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating complaint status:', error);
    throw error;
  }
};

// Upvote a complaint
export const upvoteComplaint = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/upvote`);
    return response.data;
  } catch (error) {
    console.error('Error upvoting complaint:', error);
    throw error;
  }
};

// Delete a complaint
export const deleteComplaint = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting complaint:', error);
    throw error;
  }
};