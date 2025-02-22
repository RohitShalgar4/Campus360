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
import LandingPage from './components/LandingPage';
import Applications from './pages/admin/AdminApprovalApplication';
import AdminApprovalDashboard from './pages/admin/AdminApprovalDashboard';
import SubmitApplication from './pages/student/StudentApprovalSubmit';
import ApplicationDetails from './pages/admin/AdminApprovalApplicationDetails';
import AdminViolation from './pages/admin/AdminViolation';
import StudentViolation from './pages/student/StudentViolation';
import { Shield, LogOut } from 'lucide-react';

// Academic Integrity System Component
const AcademicIntegritySystem = () => {
  const { role } = useAuthStore();
  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {isAdmin ? <AdminViolation /> : <StudentViolation />}
      </main>
    </div>
  );
};

// Main App component
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
                <ProtectedRoute>
                  {role === 'admin' ? <AdminBudget /> : <StudentBudget />}
                </ProtectedRoute>
              }
            />

            {/* Approval Portal Routes */}
            <Route
              path="/approvaldashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminApprovalDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ApplicationDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SubmitApplication />
                </ProtectedRoute>
              }
            />

            {/* Academic Integrity System Page */}
            <Route
              path="/academic-integrity"
              element={
                <ProtectedRoute>
                  <AcademicIntegritySystem />
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