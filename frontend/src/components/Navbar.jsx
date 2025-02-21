import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Moon, School, Sun } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <School className="h-8 w-8" />
            <span className="font-bold text-xl">Campus360</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/elections" className="hover:text-indigo-200">Elections</Link>
            <Link to="/facilities" className="hover:text-indigo-200">Facilities</Link>
            <Link to="/complaints" className="hover:text-indigo-200">Complaints</Link>
            <Link to="/budget" className="hover:text-indigo-200">Budget</Link>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Login
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-800"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;