import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './stores/authStore';
import StudentComplaints from './pages/student/StudentComplaints';
import AdminComplaints from './pages/admin/AdminComplaints';
import StudentBudget from './pages/student/StudentBudget';
import AdminBudget from './pages/admin/AdminBudget';
import StudentElections from './pages/student/StudentElections';
import AdminElections from './pages/admin/AdminElections';
import StudentFacilities from './pages/student/StudentFacilities';
import AdminFacilities from './pages/admin/AdminFacilities';
import LandingPage from './components/LandingPage'; // Ensure this import is correct

function App() {
  const { role } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Route: Landing Page (Default Route) */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Route: Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
                </ProtectedRoute>
              }
            />

            {/* Elections Page */}
            <Route
              path="/elections"
              element={
                <ProtectedRoute>
                  {role === 'admin' ? <AdminElections /> : <StudentElections />}
                </ProtectedRoute>
              }
            />

            {/* Facilities Page */}
            <Route
              path="/facilities"
              element={
                <ProtectedRoute>
                  {role === 'admin' ? <AdminFacilities /> : <StudentFacilities />}
                </ProtectedRoute>
              }
            />

            {/* Complaints Page */}
            <Route
              path="/complaints"
              element={
                <ProtectedRoute>
                  {role === 'admin' ? <AdminComplaints /> : <StudentComplaints />}
                </ProtectedRoute>
              }
            />

            {/* Budget Page (Admin Only) */}
            <Route
              path="/budget"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  {role === 'admin' ? <AdminBudget /> : <Navigate to="/" />}
                </ProtectedRoute>
              }
            />

            {/* Fallback Route: Redirect to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;