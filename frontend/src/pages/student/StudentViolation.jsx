import React from 'react';

function StudentPage() {
  const records = [
    {
      id: 1,
      studentName: "John Smith",
      reason: "Using unauthorized materials during final exam",
      punishment: "F grade in course, academic probation",
      date: "2024-03-15"
    },
    {
      id: 2,
      studentName: "Sarah Johnson",
      reason: "Plagiarism in research paper",
      punishment: "Zero on assignment, ethics course requirement",
      date: "2024-03-10"
    }
  ];

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
            {records.map((record, index) => (
              <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm text-gray-500">{record.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.studentName}</td>
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

export default StudentPage;