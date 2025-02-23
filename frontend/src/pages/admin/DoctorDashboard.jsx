import React, { useState } from 'react';
import { Search, Mail } from 'lucide-react';

export default function DoctorDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Predefined list of students
  const studentsData = [
    { _id: '1', name: 'Aarav Sharma', enrollmentNumber: 'STU001' },
    { _id: '2', name: 'Priya Patel', enrollmentNumber: 'STU002' },
    { _id: '3', name: 'Rohan Gupta', enrollmentNumber: 'STU003' },
    { _id: '4', name: 'Sneha Singh', enrollmentNumber: 'STU004' },
    { _id: '5', name: 'Vikram Iyer', enrollmentNumber: 'STU005' },
    { _id: '6', name: 'Ananya Nair', enrollmentNumber: 'STU006' },
    { _id: '7', name: 'Karan Malhotra', enrollmentNumber: 'STU007' },
    { _id: '8', name: 'Pooja Desai', enrollmentNumber: 'STU008' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    // Filter students based on search term (name or enrollment number)
    const filteredStudents = studentsData.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredStudents);
    setLoading(false);
  };

  const handleHealthCheckup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const healthData = {
      studentId: selectedStudent._id,
      symptoms: formData.get('symptoms'),
      diagnosis: formData.get('diagnosis'),
      recommendations: formData.get('recommendations'),
      bedRest: formData.get('bedRest') === 'on',
      leaveRequired: formData.get('leaveRequired') === 'on',
    };

    try {
      console.log('Health checkup data:', healthData);
      // Uncomment and modify the fetch request if you have an actual API endpoint
      /*
      const response = await fetch('http://localhost:5000/api/v1/doctor/health-checkup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(healthData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit health checkup');
      }
      */

      alert('Health checkup submitted successfully');
      setSelectedStudent(null);
      e.target.reset();
    } catch (error) {
      console.error('Error submitting health checkup:', error);
      alert('An error occurred while submitting the health checkup. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Student Health Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Search Student by ID or Name</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter Student ID or Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Real-time filtering as user types
                  const filtered = studentsData.filter(
                    (student) =>
                      student.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                      student.enrollmentNumber.toLowerCase().includes(e.target.value.toLowerCase())
                  );
                  setSearchResults(filtered);
                }}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2 disabled:bg-gray-400"
              disabled={loading}
            >
              <Search className="h-5 w-5" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Search Results</h3>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : searchResults.length === 0 && searchTerm ? (
              <p className="text-gray-500">No students found.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto border rounded-lg">
                {searchResults.map((student) => (
                  <div
                    key={student._id}
                    className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.enrollmentNumber}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedStudent && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Health Checkup</h2>
            <form onSubmit={handleHealthCheckup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student</label>
                <p className="mt-1">
                  {selectedStudent.name} ({selectedStudent.enrollmentNumber})
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Symptoms</label>
                <textarea
                  name="symptoms"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                <textarea
                  name="diagnosis"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Recommendations</label>
                <textarea
                  name="recommendations"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bedRest"
                    name="bedRest"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="bedRest" className="ml-2 block text-sm text-gray-900">
                    Bed Rest Required
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="leaveRequired"
                    name="leaveRequired"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="leaveRequired" className="ml-2 block text-sm text-gray-900">
                    Leave Required
                  </label>
                </div>
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