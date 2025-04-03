import React, { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import {
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  DollarSign,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // State for modal visibility
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  // State for form data
  const [studentFormData, setStudentFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile_No: "",
    parentEmail: "",
    student_id: "",
    class: "",
    department: "",
    passoutYear: "",
    gender: "",
  });

  const [adminFormData, setAdminFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile_No: "",
    designation: "",
    gender: "",
  });

  const [doctorFormData, setDoctorFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile_No: "",
    qualification: "",
    yearOfPractice: "",
    gender: "",
  });

  const stats = [
    { name: "Total Students", value: "1,234", icon: Users },
    { name: "Pending Approvals", value: "23", icon: Calendar },
    { name: "New Applications", value: "45", icon: FileText },
    { name: "Active Complaints", value: "12", icon: AlertTriangle },
    { name: "Budget Requests", value: "8", icon: DollarSign },
    { name: "System Alerts", value: "5", icon: Bell },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Application",
      title: "New Event Request",
      status: "Pending",
      time: "5 minutes ago",
    },
    {
      id: 2,
      type: "Complaint",
      title: "Anonymous Complaint Filed",
      status: "New",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "Budget",
      title: "Sports Department Budget Request",
      status: "Under Review",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "Election",
      title: "Student Council Election Started",
      status: "Active",
      time: "2 hours ago",
    },
  ];

  const handleBudgetClick = () => {
    navigate("/budget");
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    switch (formType) {
      case "student":
        setStudentFormData((prev) => ({ ...prev, [name]: value }));
        break;
      case "admin":
        setAdminFormData((prev) => ({ ...prev, [name]: value }));
        break;
      case "doctor":
        setDoctorFormData((prev) => ({ ...prev, [name]: value }));
        break;
      default:
        break;
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/student/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentFormData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add student");
      }

      toast.success("Student added successfully!");
      setIsStudentModalOpen(false);
      setStudentFormData({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile_No: "",
        parentEmail: "",
        student_id: "",
        class: "",
        department: "",
        passoutYear: "",
        gender: "",
      });
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error(error.message || "Failed to add student");
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/admin/registerAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminFormData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add admin");
      }

      toast.success("Admin added successfully!");
      setIsAdminModalOpen(false);
      setAdminFormData({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile_No: "",
        designation: "",
        gender: "",
      });
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error(error.message || "Failed to add admin");
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/doctor/registerDoctor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doctorFormData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add doctor");
      }

      toast.success("Doctor added successfully!");
      setIsDoctorModalOpen(false);
      setDoctorFormData({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile_No: "",
        qualification: "",
        yearOfPractice: "",
        gender: "",
      });
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast.error(error.message || "Failed to add doctor");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-50 rounded-full">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">{activity.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.status}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
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
                      value={studentFormData.full_name}
                      onChange={(e) => handleInputChange(e, "student")}
                      placeholder="Full Name"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={studentFormData.email}
                      onChange={(e) => handleInputChange(e, "student")}
                      placeholder="Email"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      value={studentFormData.password}
                      onChange={(e) => handleInputChange(e, "student")}
                      placeholder="Password"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={studentFormData.confirmPassword}
                      onChange={(e) => handleInputChange(e, "student")}
                      placeholder="Confirm Password"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="tel"
                      name="mobile_No"
                      value={studentFormData.mobile_No}
                      onChange={(e) => handleInputChange(e, "student")}
                      placeholder="Mobile Number"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="email"
                      name="parentEmail"
                      value={studentFormData.parentEmail}
                      onChange={(e) => handleInputChange(e, "student")}
                      placeholder="Parent Email"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      name="student_id"
                      value={studentFormData.student_id}
                      onChange={(e) => handleInputChange(e, "student")}
                      placeholder="Student ID"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <select
                      name="class"
                      value={studentFormData.class}
                      onChange={(e) => handleInputChange(e, "student")}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Class</option>
                      {["FY", "SY", "TY", "BE"].map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                    <select
                      name="department"
                      value={studentFormData.department}
                      onChange={(e) => handleInputChange(e, "student")}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Department</option>
                      {["CSE", "ENTC", "Electrical", "Mechanical", "Civil"].map(
                        (dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        )
                      )}
                    </select>
                    <input
                      type="text"
                      name="passoutYear"
                      value={studentFormData.passoutYear}
                      onChange={(e) => handleInputChange(e, "student")}
                      placeholder="Passout Year"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <select
                      name="gender"
                      value={studentFormData.gender}
                      onChange={(e) => handleInputChange(e, "student")}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      {["Male", "Female", "Other"].map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
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
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Add Student
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
                      name="full_name"
                      value={adminFormData.full_name}
                      onChange={(e) => handleInputChange(e, "admin")}
                      placeholder="Full Name"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={adminFormData.email}
                      onChange={(e) => handleInputChange(e, "admin")}
                      placeholder="Email"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      value={adminFormData.password}
                      onChange={(e) => handleInputChange(e, "admin")}
                      placeholder="Password"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={adminFormData.confirmPassword}
                      onChange={(e) => handleInputChange(e, "admin")}
                      placeholder="Confirm Password"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="tel"
                      name="mobile_No"
                      value={adminFormData.mobile_No}
                      onChange={(e) => handleInputChange(e, "admin")}
                      placeholder="Mobile Number"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      name="designation"
                      value={adminFormData.designation}
                      onChange={(e) => handleInputChange(e, "admin")}
                      placeholder="Designation"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <select
                      name="gender"
                      value={adminFormData.gender}
                      onChange={(e) => handleInputChange(e, "admin")}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      {["Male", "Female", "Other"].map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
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
                      name="full_name"
                      value={doctorFormData.full_name}
                      onChange={(e) => handleInputChange(e, "doctor")}
                      placeholder="Full Name"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={doctorFormData.email}
                      onChange={(e) => handleInputChange(e, "doctor")}
                      placeholder="Email"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      value={doctorFormData.password}
                      onChange={(e) => handleInputChange(e, "doctor")}
                      placeholder="Password"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={doctorFormData.confirmPassword}
                      onChange={(e) => handleInputChange(e, "doctor")}
                      placeholder="Confirm Password"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="tel"
                      name="mobile_No"
                      value={doctorFormData.mobile_No}
                      onChange={(e) => handleInputChange(e, "doctor")}
                      placeholder="Mobile Number"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      name="qualification"
                      value={doctorFormData.qualification}
                      onChange={(e) => handleInputChange(e, "doctor")}
                      placeholder="Qualification"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      name="yearOfPractice"
                      value={doctorFormData.yearOfPractice}
                      onChange={(e) => handleInputChange(e, "doctor")}
                      placeholder="Years of Practice"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <select
                      name="gender"
                      value={doctorFormData.gender}
                      onChange={(e) => handleInputChange(e, "doctor")}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      {["Male", "Female", "Other"].map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
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
