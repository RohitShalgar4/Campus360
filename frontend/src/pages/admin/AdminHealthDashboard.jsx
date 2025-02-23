import React from 'react';
import { Users, UserCheck, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function AdminHealthDashboard() {
  const [statistics, setStatistics] = React.useState({
    patientsVisited: 0,
    studentsTreated: 0,
    leaveGranted: 0
  });
  const [recentActivity, setRecentActivity] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await fetch('/api/admin/statistics');
        const statsData = await statsResponse.json();
        setStatistics(statsData);

        const activityResponse = await fetch('/api/admin/recent-activity');
        const activityData = await activityResponse.json();
        setRecentActivity(activityData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Health & Leave Management Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Patients Visited"
          value={statistics.patientsVisited}
          Icon={Users}
        />
        <StatCard
          title="Students Treated"
          value={statistics.studentsTreated}
          Icon={UserCheck}
        />
        <StatCard
          title="Leave Granted"
          value={statistics.leaveGranted}
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
              {recentActivity.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.student}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}