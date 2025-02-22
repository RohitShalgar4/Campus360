import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Shield, Eye } from 'lucide-react';
import {
  fetchComplaints,
  addComplaint,
  upvoteComplaint,
} from '../../services/api';

function StudentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);

  const categories = [
    "Academic",
    "Facilities",
    "Administrative",
    "Food Services",
    "Transportation",
    "Technology",
    "Other",
  ];

  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

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

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setNewComplaint({ ...newComplaint, imageUrl: previewUrl });
    }
  };

  // Handle submitting a new complaint
  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      const addedComplaint = await addComplaint(newComplaint);
      setComplaints([addedComplaint, ...complaints]);
      setNewComplaint({ title: '', description: '', category: '', imageUrl: null });
      setImagePreview(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding complaint:', error);
    }
  };

  // Handle upvoting a complaint
  const handleVote = async (id) => {
    try {
      const updatedComplaint = await upvoteComplaint(id);
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === id ? updatedComplaint : complaint
        )
      );
    } catch (error) {
      console.error('Error upvoting complaint:', error);
    }
  };

  // Close dialog when clicking outside
  const handleClickOutside = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Anonymous Complaints</h1>
        <p className="mt-2 text-gray-600">View and vote on anonymous complaints</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <MessageSquare className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Active Complaints</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{complaints.length}</p>
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
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add New Complaint
          </button>
        </div>

        {/* Custom Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleClickOutside}>
            <div ref={dialogRef} className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Submit New Complaint</h2>
              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    placeholder="Enter complaint title"
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    placeholder="Describe your complaint"
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Attach Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-40 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setNewComplaint({ ...newComplaint, imageUrl: null });
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Submit Complaint
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full mb-2">
                    {complaint.category}
                  </span>
                  <p className="mt-1 text-gray-600">{complaint.description}</p>
                  {complaint.imageUrl && (
                    <img
                      src={complaint.imageUrl}
                      alt="Complaint attachment"
                      className="mt-2 max-h-40 rounded-lg object-cover"
                    />
                  )}
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">Submitted: {new Date(complaint.date).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <button
                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                    onClick={() => handleVote(complaint._id)}
                    aria-label="Upvote complaint"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <span className="text-gray-900 font-medium">{complaint.votes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentComplaints;