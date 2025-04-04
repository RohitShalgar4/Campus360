import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

function AdminViolation() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newRecord, setNewRecord] = useState({
    studentName: '',
    reason: '',
    punishment: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch all violations from the backend
  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/students/violations'); // Updated URL
        if (!response.ok) {
          throw new Error('Failed to fetch violations');
        }
        const data = await response.json();
        setRecords(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  // Handle form submission to create a new violation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/v1/students/violations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecord),
      });

      if (!response.ok) {
        throw new Error('Failed to create violation');
      }

      const data = await response.json();
      setRecords([...records, data]); // Add the new violation to the list
      setNewRecord({
        studentName: '',
        reason: '',
        punishment: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add New Record</h2>
          <Plus size={20} className="text-indigo-600" />
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
            <input
              type="text"
              required
              value={newRecord.studentName}
              onChange={(e) => setNewRecord({ ...newRecord, studentName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={newRecord.date}
              onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Violation</label>
            <textarea
              required
              value={newRecord.reason}
              onChange={(e) => setNewRecord({ ...newRecord, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Punishment</label>
            <textarea
              required
              value={newRecord.punishment}
              onChange={(e) => setNewRecord({ ...newRecord, punishment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add Record
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Academic Integrity Violations</h2>
          <p className="text-sm text-gray-600 mt-1">Complete list of academic integrity violations and their consequences</p>
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
              {records.map((record, index) => (
                <tr key={record._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.studentName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.punishment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminViolation;