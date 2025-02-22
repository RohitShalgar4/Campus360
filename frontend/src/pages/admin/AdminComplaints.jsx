import React, { useState, useEffect } from 'react';
import { MessageSquare, Shield, Eye, ThumbsUp } from 'lucide-react';
import {
  fetchComplaints,
  updateComplaintStatus,
} from '../../services/api';

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  // Fetch complaints from the backend
  useEffect(() => {
    const getComplaints = async () => {
      try {
        const data = await fetchComplaints();
        setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };
    getComplaints();
  }, []);

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedComplaint = await updateComplaintStatus(id, newStatus);
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === id ? updatedComplaint : complaint
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Calculate total votes
  const totalVotes = complaints.reduce((sum, complaint) => sum + complaint.votes, 0);

  // Sort complaints by votes in descending order
  const sortedComplaints = [...complaints].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
        <p className="mt-2 text-gray-600">Manage and resolve student complaints</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <MessageSquare className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Active Complaints</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {complaints.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-green-600">
            <Shield className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Resolved</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {complaints.filter(c => c.status === 'Resolved').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-yellow-600">
            <Eye className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Under Review</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {complaints.filter(c => c.status === 'Under Review').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="divide-y divide-gray-200">
          {sortedComplaints.map((complaint) => (
            <div key={complaint._id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                  <p className="mt-1 text-gray-600">{complaint.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">Submitted: {new Date(complaint.date).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {complaint.status}
                    </span>
                    <span className="flex items-center text-blue-600">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {complaint.votes} upvotes
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg"
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminComplaints;