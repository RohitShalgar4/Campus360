import React, { useState, useEffect } from 'react';

function StudentViolationPage() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/students/violations'); // Updated URL
        if (!response.ok) {
          throw new Error('Failed to fetch violations');
        }
        const data = await response.json();
        setViolations(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Academic Integrity Violations</h2>
        <p className="text-sm text-gray-600 mt-1">List of academic integrity violations and their consequences</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Violation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consequence</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {violations.map((record) => (
              <tr key={record._id} className={violations.indexOf(record) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {record.studentName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{record.reason}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{record.punishment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentViolationPage;