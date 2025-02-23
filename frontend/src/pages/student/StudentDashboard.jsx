import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Calendar, Users, BookOpen, FileText, PieChart, MessageSquare } from 'lucide-react';

function StudentDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const stats = [
    { name: 'Active Elections', value: '2', icon: Users },
    { name: 'Facility Bookings', value: '15', icon: Calendar },
    { name: 'Pending Applications', value: '8', icon: FileText },
    { name: 'Course Resources', value: '124', icon: BookOpen },
    { name: 'Budget Utilization', value: '75%', icon: PieChart },
    { name: 'Active Complaints', value: '3', icon: MessageSquare },
  ];

  const quickActions = [
    { 
      name: 'Book Facility', 
      path: '/facilities',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      textColor: 'text-indigo-700'
    },  
    { 
      name: 'File Complaint', 
      path: '/complaints',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      textColor: 'text-indigo-700'
    },
    { 
      name: 'View Budget', 
      path: '/budget',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      textColor: 'text-indigo-700'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.email}</h1>
        <p className="mt-2 text-gray-600">Here's what's happening in your college today</p>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <p className="font-medium">Student Council Elections</p>
              <p className="text-sm text-gray-600">Nominations open until March 25th</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium">Library Extended Hours</p>
              <p className="text-sm text-gray-600">Now open until 11 PM during exam week</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={() => handleNavigation(action.path)}
                className={`p-4 rounded-lg transition-colors duration-200 
                  ${action.bgColor} ${action.textColor} ${action.hoverColor}
                  flex items-center justify-center text-center
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
              >
                {action.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;