import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { School } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import UpdatePasswordPopup from '../components/UpdatePasswordPopup';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // If already authenticated, redirect to the saved location or dashboard
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    console.log('showPasswordPopup state changed:', showPasswordPopup);
  }, [showPasswordPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.endsWith('@college.edu')) {
      toast.error('Please use your college email address');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/auth/login`, 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Login response:', res.data); // Debug log

      const { token, role, fullName, isFirstLogin } = res.data;
      console.log('isFirstLogin:', isFirstLogin); // Debug log

      // If it's first login, show the password update popup before logging in
      if (isFirstLogin) {
        console.log('Showing password popup'); // Debug log
        setShowPasswordPopup(true);
        return;
      }

      // Only login and redirect if it's not first login
      login({ email, fullName, isFirstLogin }, token, role);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      toast.success(`Welcome ${role}!`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdateClose = () => {
    console.log('Closing password popup'); // Debug log
    setShowPasswordPopup(false);
    // Redirect to the saved location or dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <School className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to Campus360
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Use admin@college.edu for admin access<br />
              Use student@college.edu for student access
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="College Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showPasswordPopup && (
        <>
          {console.log('Rendering UpdatePasswordPopup')}
          <UpdatePasswordPopup onClose={handlePasswordUpdateClose} />
        </>
      )}
    </>
  );
}

export default Login;