import React, { useState } from 'react';
import { Search, Mail } from 'lucide-react';
import { mockStudents } from '../mockData';
import { Student } from '../types';

export default function DoctorDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
  };

  const handleHealthCheckup = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement health checkup submission
    alert('Health checkup submitted and notifications sent');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Student Health Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Search Student</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search by name or enrollment number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Search Results</h3>
            <div className="space-y-2">
              {mockStudents.map(student => (
                <div
                  key={student.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedStudent(student)}
                >
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.enrollmentNumber}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health Checkup Form */}
        {selectedStudent && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Health Checkup</h2>
            <form onSubmit={handleHealthCheckup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student</label>
                <p className="mt-1">{selectedStudent.name} ({selectedStudent.enrollmentNumber})</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Symptoms</label>
                <textarea
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                <textarea
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Recommendations</label>
                <textarea
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="leaveRequired"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="leaveRequired" className="ml-2 block text-sm text-gray-900">
                  Leave Required
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2"
              >
                <Mail className="h-5 w-5" />
                <span>Submit and Send Notifications</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}