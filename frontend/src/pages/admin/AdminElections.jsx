const API_BASE_URL = 'http://localhost:8080'; // Changed from 8080
import React, { useState, useEffect } from 'react';
import { Vote, Users, Award, User, UserCheck, UserX } from 'lucide-react';

// Rest of the code remains the same...

function AdminElections() {
  const [elections, setElections] = useState([]); // Fetch elections from the backend
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    deadline: '',
    candidates: [] // Add candidates array to the newElection state
  });
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    position: ''
  });

  // Fetch elections from the backend
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/elections`);
        if (!response.ok) {
          throw new Error('Failed to fetch elections');
        }
        const data = await response.json();
        setElections(data);
      } catch (error) {
        console.error('Error fetching elections:', error);
      }
    };
  
    fetchElections();
  }, []);
  
  // Create a new election
  const handleCreateElection = async () => {
    try {
      console.log('Sending new election:', newElection); // Debug: Log the data being sent
      const response = await fetch(`${API_BASE_URL}/api/v1/elections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newElection),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create election');
      }
  
      const data = await response.json();
      console.log('Election created:', data); // Debug: Log the response from the backend
      setElections([...elections, data]); // Update local state with the new election
      setNewElection({ title: '', description: '', deadline: '', candidates: [] }); // Reset form
    } catch (error) {
      console.error('Error creating election:', error);
    }
  };

  // Add a new candidate to the newElection
  const handleAddCandidate = () => {
    if (newCandidate.name && newCandidate.position) {
      setNewElection({
        ...newElection,
        candidates: [...newElection.candidates, newCandidate]
      });
      setNewCandidate({ name: '', position: '' }); // Reset candidate form
    }
  };

  // Delete an election
  const handleDeleteElection = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/elections/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete election');
      }

      setElections(elections.filter(election => election.id !== id)); // Update local state
    } catch (error) {
      console.error('Error deleting election:', error);
    }
  };

  // Helper function to calculate percentages
  const calculatePercentage = (part, total) => {
    return total === 0 ? 0 : ((part / total) * 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Election Management</h1>
        <p className="mt-2 text-gray-600">Create and manage student elections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Vote className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Active Elections</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{elections.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Users className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Total Candidates</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {elections.reduce((sum, election) => sum + election.candidates.length, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Award className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Positions</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {elections.reduce((sum, election) => sum + new Set(election.candidates.map(c => c.position)).size, 0)}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900">Create New Election</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newElection.title}
              onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={newElection.description}
              onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              value={newElection.deadline}
              onChange={(e) => setNewElection({ ...newElection, deadline: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* Add Candidate Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Candidates</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
              <input
                type="text"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                value={newCandidate.position}
                onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <button
              onClick={handleAddCandidate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Candidate
            </button>
          </div>

          {/* Display Added Candidates */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">Candidates</h3>
            <ul className="mt-2 space-y-2">
              {newElection.candidates.map((candidate, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {candidate.name} - {candidate.position}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleCreateElection}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Election
          </button>
        </div>
      </div>

      {/* Existing JSX for displaying elections remains the same */}
    </div>
  );
}

export default AdminElections;
