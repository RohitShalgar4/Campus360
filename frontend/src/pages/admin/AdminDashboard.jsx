import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Users, Calendar, FileText, AlertTriangle, DollarSign, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // State for modal visibility
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  // State for student form
  const [studentForm, setStudentForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile_No: '',
    parentEmail: '',
    student_id: '',
    class: '',
    department: '',
    passoutYear: '',
    gender: ''
  });

  const [loading, setLoading] = useState(false);

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

  const handleBudgetClick = () => {
    navigate('/budget');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/student/register',
        studentForm,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Student registered successfully');
        setIsStudentModalOpen(false);
        // Reset form
        setStudentForm({
          full_name: '',
          email: '',
          password: '',
          confirmPassword: '',
          mobile_No: '',
          parentEmail: '',
          student_id: '',
          class: '',
          department: '',
          passoutYear: '',
          gender: ''
        });
      } else {
        toast.error(response.data.message || 'Failed to register student');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Error registering student';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    // Add admin submission logic here
    setIsAdminModalOpen(false);
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    // Add doctor submission logic here
    setIsDoctorModalOpen(false);
  };

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
            {/* Student Modal */}
            {isStudentModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add New Student</h3>
                    <button 
                      onClick={() => setIsStudentModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleStudentSubmit} className="space-y-4">
                    <input 
                      type="text" 
                      name="full_name"
                      value={studentForm.full_name}
                      onChange={handleInputChange}
                      placeholder="Full Name" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="email" 
                      name="email"
                      value={studentForm.email}
                      onChange={handleInputChange}
                      placeholder="Email" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="password" 
                      name="password"
                      value={studentForm.password}
                      onChange={handleInputChange}
                      placeholder="Password" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={studentForm.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm Password" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="tel" 
                      name="mobile_No"
                      value={studentForm.mobile_No}
                      onChange={handleInputChange}
                      placeholder="Mobile Number" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="email" 
                      name="parentEmail"
                      value={studentForm.parentEmail}
                      onChange={handleInputChange}
                      placeholder="Parent Email" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="text" 
                      name="student_id"
                      value={studentForm.student_id}
                      onChange={handleInputChange}
                      placeholder="Student ID" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <select 
                      name="class"
                      value={studentForm.class}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      required
                    >
                      <option value="">Select Class</option>
                      {["1st", "2nd", "3rd", "4th"].map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                    <input 
                      type="text" 
                      name="department"
                      value={studentForm.department}
                      onChange={handleInputChange}
                      placeholder="Department" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="text" 
                      name="passoutYear"
                      value={studentForm.passoutYear}
                      onChange={handleInputChange}
                      placeholder="Passout Year" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <select 
                      name="gender"
                      value={studentForm.gender}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      required
                    >
                      <option value="">Select Gender</option>
                      {["Male", "Female", "Other"].map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                    <div className="flex justify-end space-x-2">
                      <button 
                        type="button"
                        onClick={() => setIsStudentModalOpen(false)}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {loading ? 'Adding...' : 'Add Student'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Admin Modal */}
            {isAdminModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add New Admin</h3>
                    <button 
                      onClick={() => setIsAdminModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="tel" 
                      placeholder="Mobile Number" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Designation" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                      <option value="">Select Gender</option>
                      {["Male", "Female", "Other"].map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                    <div className="flex justify-end space-x-2">
                      <button 
                        type="button"
                        onClick={() => setIsAdminModalOpen(false)}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Add Admin
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Doctor Modal */}
            {isDoctorModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add New Doctor</h3>
                    <button 
                      onClick={() => setIsDoctorModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleDoctorSubmit} className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="tel" 
                      placeholder="Mobile Number" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Qualification" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Years of Practice" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                      <option value="">Select Gender</option>
                      {["Male", "Female", "Other"].map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                    <div className="flex justify-end space-x-2">
                      <button 
                        type="button"
                        onClick={() => setIsDoctorModalOpen(false)}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Add Doctor
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <button 
              className="p-4 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100"
              onClick={handleBudgetClick}
            >
              Manage Budget
            </button>
            <button 
              className="p-4 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100"
              onClick={() => setIsStudentModalOpen(true)}
            >
              Add Student
            </button>
            <button 
              className="p-4 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100"
              onClick={() => setIsAdminModalOpen(true)}
            >
              Add Admin
            </button>
            <button 
              className="p-4 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100"
              onClick={() => setIsDoctorModalOpen(true)}
            >
              Add Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;