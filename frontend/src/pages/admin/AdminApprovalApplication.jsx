import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

const applications = [
  {
    id: '1',
    title: 'Spring Festival 2024',
    type: 'event',
    status: 'pending',
    submittedBy: 'John Doe',
    submittedAt: '2024-03-10T10:00:00Z',
    deadline: '2024-04-01T00:00:00Z',
  },
  // Add more mock data as needed
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  revision_requested: 'bg-purple-100 text-purple-800',
};

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white shadow-sm rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <motion.tr
                  key={application.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#F9FAFB' }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/applications/${application.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {application.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize">{application.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[application.status]}`}
                    >
                      {application.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.submittedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(application.deadline), 'MMM d, yyyy')}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
