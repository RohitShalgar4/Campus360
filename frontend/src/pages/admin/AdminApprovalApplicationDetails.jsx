import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, FileText, MessageSquare, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ApplicationDetails() {
  const { id } = useParams();

  // Mock data for demonstration
  const application = {
    id,
    title: 'Spring Festival 2024',
    type: 'event',
    status: 'pending',
    submittedBy: 'John Doe',
    submittedAt: '2024-03-10T10:00:00Z',
    deadline: '2024-04-01T00:00:00Z',
    description: 'Annual spring festival featuring local artists, food vendors, and community activities.',
    priority: 2,
    comments: [
      {
        id: '1',
        author: 'Jane Smith',
        text: 'Please provide more details about the budget allocation.',
        createdAt: '2024-03-11T14:30:00Z',
      },
      {
        id: '2',
        author: 'Mike Johnson',
        text: 'Venue availability confirmed for the proposed dates.',
        createdAt: '2024-03-12T09:15:00Z',
      },
    ],
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    revision_requested: 'bg-purple-100 text-purple-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{application.title}</h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className="text-sm text-gray-500">Submitted by {application.submittedBy}</span>
              <span className="text-sm text-gray-500">
                {format(new Date(application.submittedAt), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[application.status]}`}
          >
            {application.status.replace('_', ' ')}
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-sm text-gray-900 capitalize">{application.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Deadline</p>
              <p className="text-sm text-gray-900">
                {format(new Date(application.deadline), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Priority</p>
              <p className="text-sm text-gray-900">Level {application.priority}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700">{application.description}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
          <div className="space-y-4">
            {application.comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700">{comment.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="flex justify-end space-x-4">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Request Revision
            </button>
            <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Approve Application
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
