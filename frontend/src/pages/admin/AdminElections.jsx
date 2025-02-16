import React, { useState } from 'react';
import { Vote, Users, Award } from 'lucide-react';

function AdminElections() {
  const [elections, setElections] = useState([
    {
      id: 1,
      title: 'Student Council President',
      description: 'Vote for your next student council president',
      deadline: '2024-03-25',
      candidates: [
        { id: 1, name: 'Sarah Johnson', votes: 145, position: 'President' },
        { id: 2, name: 'Michael Chen', votes: 132, position: 'President' },
        { id: 3, name: 'Emily Rodriguez', votes: 128, position: 'President' }
      ]
    },
    {
      id: 2,
      title: 'Department Representatives',
      description: 'Select your department representatives',
      deadline: '2024-03-28',
      candidates: [
        { id: 4, name: 'David Kim', votes: 78, position: 'CS Rep' },
        { id: 5, name: 'Lisa Patel', votes: 82, position: 'CS Rep' }
      ]
    }
  ]);

  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  const handleCreateElection = () => {
    const election = {
      id: elections.length + 1,
      ...newElection,
      candidates: []
    };
    setElections([...elections, election]);
    setNewElection({ title: '', description: '', deadline: '' });
  };

  const handleDeleteElection = (id) => {
    setElections(elections.filter(election => election.id !== id));
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
          <p className="mt-2 text-3xl font-bold text-gray-900">2</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Users className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Total Candidates</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Award className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Positions</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">2</p>
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
          <button
            onClick={handleCreateElection}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Election
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {elections.map((election) => (
          <div key={election.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{election.title}</h2>
                  <p className="mt-1 text-gray-600">{election.description}</p>
                  <p className="mt-2 text-sm text-indigo-600">Deadline: {election.deadline}</p>
                </div>
                <button
                  onClick={() => handleDeleteElection(election.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Votes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {election.candidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{candidate.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{candidate.votes}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminElections;