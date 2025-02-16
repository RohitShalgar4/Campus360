import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Users, Calendar, FileText, AlertTriangle, DollarSign, Bell } from 'lucide-react';

function AdminDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { name: 'Total Students', value: '1,234', icon: Users },
    { name: 'Pending Approvals', value: '23', icon: Calendar },
    { name: 'New Applications', value: '45', icon: FileText },
    { name: 'Active Complaints', value: '12', icon: AlertTriangle },
    { name: 'Budget Requests', value: '8', icon: DollarSign },
    { name: 'System Alerts', value: '5', icon: Bell },
  ];

  const recentActivities = [
    { id: 1, type: 'Application', title: 'New Event Request', status: 'Pending', time: '5 minutes ago' },
    { id: 2, type: 'Complaint', title: 'Anonymous Complaint Filed', status: 'New', time: '15 minutes ago' },
    { id: 3, type: 'Budget', title: 'Sports Department Budget Request', status: 'Under Review', time: '1 hour ago' },
    { id: 4, type: 'Election', title: 'Student Council Election Started', status: 'Active', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <Icon className="h-12 w-12 text-indigo-600" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-l-4 border-indigo-500 pl-4">
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.type} • {activity.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'New' ? 'bg-green-100 text-green-800' :
                    activity.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                    'bg-indigo-100 text-indigo-800'}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100">
              Manage Elections
            </button>
            <button className="p-4 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100">
              Review Applications
            </button>
            <button className="p-4 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100">
              Moderate Complaints
            </button>
            <button className="p-4 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100">
              Manage Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;