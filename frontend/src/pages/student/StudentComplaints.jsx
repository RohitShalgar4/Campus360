import React, { useState } from 'react';
import { MessageSquare, Shield, Eye } from 'lucide-react';

function StudentComplaints() {
  const [complaints] = useState([
    {
      id: 1,
      title: 'Library Hours Extension',
      description: 'Request to extend library hours during exam weeks',
      status: 'Under Review',
      date: '2024-03-18',
      votes: 45
    },
    {
      id: 2,
      title: 'Cafeteria Food Quality',
      description: 'Concerns about the quality of food served in the cafeteria',
      status: 'Investigating',
      date: '2024-03-17',
      votes: 32
    },
    {
      id: 3,
      title: 'Parking Space Allocation',
      description: 'Need more designated parking spaces for students',
      status: 'Resolved',
      date: '2024-03-15',
      votes: 28
    }
  ]);

  const handleVote = (id) => {
    // Handle vote logic here
    console.log(`Voted for complaint ${id}`);
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
          <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-green-600">
            <Shield className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Resolved</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">1</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-yellow-600">
            <Eye className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Under Review</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">2</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="divide-y divide-gray-200">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                  <p className="mt-1 text-gray-600">{complaint.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">Submitted: {complaint.date}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <button 
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => handleVote(complaint.id)}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <span className="text-gray-900 font-medium">{complaint.votes}</span>
                  </div>
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