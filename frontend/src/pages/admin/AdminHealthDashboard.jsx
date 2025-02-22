import { Users, UserCheck, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';
import { mockStatistics } from '../mockData';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Health & Leave Management Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Patients Visited"
          value={mockStatistics.patientsVisited}
          Icon={Users}
        />
        <StatCard
          title="Students Treated"
          value={mockStatistics.studentsTreated}
          Icon={UserCheck}
        />
        <StatCard
          title="Leave Granted"
          value={mockStatistics.leaveGranted}
          Icon={Clock}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Mock data rows */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-03-15</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Doe</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Leave Granted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}