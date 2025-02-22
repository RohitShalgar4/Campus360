const API_BASE_URL = 'http://localhost:8080';
import React, { useState, useEffect } from 'react';
import { Vote, Users, Award } from 'lucide-react';

function AdminElections() {
  const [elections, setElections] = useState([]);
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    deadline: '',
    candidates: [],
  });
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    position: '',
  });

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/elections`);
        if (!response.ok) throw new Error('Failed to fetch elections');
        const data = await response.json();
        setElections(data);
      } catch (error) {
        console.error('Error fetching elections:', error);
      }
    };
    fetchElections();
  }, []);

  const handleCreateElection = async () => {
    try {
      console.log('Sending new election:', newElection);
      const response = await fetch(`${API_BASE_URL}/api/v1/elections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newElection),
      });
      if (!response.ok) throw new Error('Failed to create election');
      const data = await response.json();
      setElections([...elections, data]);
      setNewElection({ title: '', description: '', deadline: '', candidates: [] });
    } catch (error) {
      console.error('Error creating election:', error);
    }
  };

  const handleAddCandidate = () => {
    if (newCandidate.name && newCandidate.position) {
      setNewElection({
        ...newElection,
        candidates: [...newElection.candidates, newCandidate],
      });
      setNewCandidate({ name: '', position: '' });
    }
  };

  const handleDeleteElection = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/elections/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete election');
      setElections(elections.filter((election) => election._id !== id));
    } catch (error) {
      console.error('Error deleting election:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Election Management</h1>
        <p className="mt-2 text-gray-600">Create and manage student elections</p>
      </div>

      {/* Create Election Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900">Create New Election</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newElection.title}
              onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={newElection.description}
              onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              value={newElection.deadline}
              onChange={(e) => setNewElection({ ...newElection, deadline: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Candidates</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
              <input
                type="text"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                value={newCandidate.position}
                onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleAddCandidate}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Add Candidate
            </button>
          </div>
          <div>
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
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Create Election
          </button>
        </div>
      </div>

      {/* Election History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900">Election History</h2>
        <div className="mt-4 space-y-4">
          {elections.length === 0 ? (
            <p className="text-gray-600">No elections created yet.</p>
          ) : (
            elections.map((election) => (
              <div key={election._id} className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold">{election.title}</h3>
                <p className="text-gray-600">{election.description}</p>
                <p className="text-sm text-indigo-600">
                  Deadline: {new Date(election.deadline).toLocaleDateString()}
                </p>
                <h4 className="mt-2 font-medium">Candidates & Votes:</h4>
                <ul className="mt-1 space-y-1">
                  {election.candidates.map((candidate) => (
                    <li key={candidate._id} className="text-sm">
                      {candidate.name} ({candidate.position}) - {candidate.votes} votes
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleDeleteElection(election._id)}
                  className="mt-2 inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminElections;