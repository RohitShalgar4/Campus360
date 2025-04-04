import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  FileText,
  LogOut,
  Moon,
  PieChart,
  School,
  Sun,
  Shield,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

function Navbar() {
  const { isAuthenticated, logout, role, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint to clear cookies
      await axios.get('http://localhost:8080/api/v1/auth/logout', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      
      // Clear frontend state
      logout();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear frontend state even if backend call fails
      logout();
      navigate("/login");
    }
  };

  // Approval navigation items based on role
  const approvalNav = role === "admin" 
    ? [
        { name: "Approval Dashboard", href: "/approvaldashboard", icon: PieChart },
        { name: "Applications", href: "/applications", icon: FileText },
      ]
    : role === "student"
    ? [
        // Students have access to both Approval Dashboard and Submit
        { name: "Approval Dashboard", href: "/approvaldashboard", icon: PieChart },
        { name: "Submit", href: "/submit", icon: Building2 },
      ]
    : [];

  // Dark Mode Persistence
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Check if the current path matches the link
  const isActiveLink = (path) => location.pathname === path;

  return (
    <nav className="bg-indigo-600 text-white shadow-lg m-2 relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <School className="h-8 w-8" />
            <span className="font-bold text-xl">Campus360</span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && role !== "doctor" && (
            <div className="hidden md:flex space-x-8">
              <Link
                to="/elections"
                className={`hover:text-indigo-200 ${
                  isActiveLink("/elections")
                    ? "text-white font-semibold"
                    : "text-indigo-100"
                }`}
              >
                Elections
              </Link>
              <Link
                to="/facilities"
                className={`hover:text-indigo-200 ${
                  isActiveLink("/facilities")
                    ? "text-white font-semibold"
                    : "text-indigo-100"
                }`}
              >
                Facilities
              </Link>
              <Link
                to="/complaints"
                className={`hover:text-indigo-200 ${
                  isActiveLink("/complaints")
                    ? "text-white font-semibold"
                    : "text-indigo-100"
                }`}
              >
                Complaints
              </Link>
              <Link
                to="/budget"
                className={`hover:text-indigo-200 ${
                  isActiveLink("/budget")
                    ? "text-white font-semibold"
                    : "text-indigo-100"
                }`}
              >
                Budget
              </Link>

              {/* Academic Integrity System Link */}
              <Link
                to="/academic-integrity"
                className={`flex items-center space-x-2 hover:text-indigo-200 ${
                  isActiveLink("/academic-integrity")
                    ? "text-white font-semibold"
                    : "text-indigo-100"
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>
                  {role === "admin" ? "Violation Records" : "Violation Notice"}
                </span>
              </Link>

              {/* Dropdown for Approval Portal */}
              {(role === "admin" || role === "student") && (
                <div className="relative group">
                  <button className="hover:text-indigo-200">
                    Approval Portal
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-indigo-700 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                    {approvalNav.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`block px-4 py-2 text-sm ${
                          isActiveLink(item.href)
                            ? "bg-indigo-800 text-white"
                            : "text-indigo-200 hover:bg-indigo-800"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-6">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Show Login if User is Not Authenticated */}
            {!isAuthenticated && (
              <Link to="/login">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Login
                </button>
              </Link>
            )}

            {/* Show Logout if User is Authenticated */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-800"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;