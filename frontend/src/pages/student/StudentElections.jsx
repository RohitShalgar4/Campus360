import React, { useState, useEffect } from 'react';
import { Vote, Users, Award } from 'lucide-react';

function StudentElections() {
  const [activeElections, setActiveElections] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch('/api/v1/elections'); // Proxied to 8080
        if (!response.ok) throw new Error('Failed to fetch elections');
        const data = await response.json();
        setActiveElections(data);
      } catch (error) {
        console.error('Error fetching elections:', error);
      }
    };
    fetchElections();
  }, []);

  const handleVote = async (electionId, candidateId) => {
    try {
      const response = await fetch(`/api/v1/elections/${electionId}/vote/${candidateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // If auth is implemented
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to record vote');
      }

      const updatedElection = await response.json();
      setActiveElections((prevElections) =>
        prevElections.map((election) =>
          election._id === updatedElection.election._id ? updatedElection.election : election
        )
      );
      alert('Vote recorded successfully!');
    } catch (error) {
      console.error('Error recording vote:', error);
      alert(error.message);
    }
  };

  const totalCandidates = activeElections.reduce(
    (sum, election) => sum + election.candidates.length,
    0
  );
  const totalPositions = activeElections.reduce(
    (sum, election) => sum + new Set(election.candidates.map((c) => c.position)).size,
    0
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Student Elections</h1>
        <p className="mt-2 text-gray-600">Cast your vote for student leadership positions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Vote className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Active Elections</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{activeElections.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Users className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Total Candidates</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalCandidates}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Award className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Positions</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalPositions}</p>
        </div>
      </div>

      <div className="space-y-6">
        {activeElections.map((election) => (
          <div key={election._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">{election.title}</h2>
              <p className="mt-1 text-gray-600">{election.description}</p>
              <p className="mt-2 text-sm text-indigo-600">
                Deadline: {new Date(election.deadline).toLocaleDateString()}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Votes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {election.candidates.map((candidate) => (
                    <tr key={candidate._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {candidate.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {candidate.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate.votes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleVote(election._id, candidate._id)}
                          className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Vote
                        </button>
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

export default StudentElections;