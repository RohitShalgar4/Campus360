import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";
import StudentComplaints from "./pages/student/StudentComplaints";
import AdminComplaints from "./pages/admin/AdminComplaints";
import StudentBudget from "./pages/student/StudentBudget";
import AdminBudget from "./pages/admin/AdminBudget";
import StudentElections from "./pages/student/StudentElections";
import AdminElections from "./pages/admin/AdminElections";
import StudentFacilities from "./pages/student/StudentFacilities";
import AdminFacilities from "./pages/admin/AdminFacilities";
import LandingPage from "./components/LandingPage";
import Applications from "./pages/admin/AdminApprovalApplication";
import AdminApprovalDashboard from "./pages/admin/AdminApprovalDashboard";
import SubmitApplication from "./pages/student/StudentApprovalSubmit";
import ApplicationDetails from "./pages/admin/AdminApprovalApplicationDetails";
import AdminViolation from "./pages/admin/AdminViolation";
import StudentViolation from "./pages/student/StudentViolation";
import DoctorDashboard from "./pages/admin/DoctorDashboard";

// Academic Integrity System Component
const AcademicIntegritySystem = () => {
  const { role } = useAuthStore();
  const isAdmin = role === "admin";

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
  const { role, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    // Validate authentication on app initialization
    checkAuth();
  }, []);

  // Redirect unauthenticated users to login
  const RequireAuth = ({ children }) => {
    const location = useLocation();
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login />
              } 
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <ProtectedRoute>
                    {role === "admin" ? (
                      <AdminDashboard />
                    ) : role === "doctor" ? (
                      <DoctorDashboard />
                    ) : (
                      <StudentDashboard />
                    )}
                  </ProtectedRoute>
                </RequireAuth>
              }
            />

            {/* Elections Page */}
            <Route
              path="/elections"
              element={
                <RequireAuth>
                  <ProtectedRoute>
                    {role === "admin" ? (
                      <AdminElections />
                    ) : role === "student" ? (
                      <StudentElections />
                    ) : (
                      <Navigate to="/" />
                    )}
                  </ProtectedRoute>
                </RequireAuth>
              }
            />

            {/* Facilities Page */}
            <Route
              path="/facilities"
              element={
                <RequireAuth>
                  <ProtectedRoute>
                    {role === "admin" ? (
                      <AdminFacilities />
                    ) : role === "student" ? (
                      <StudentFacilities />
                    ) : (
                      <Navigate to="/" />
                    )}
                  </ProtectedRoute>
                </RequireAuth>
              }
            />

            {/* Complaints Page */}
            <Route
              path="/complaints"
              element={
                <RequireAuth>
                  <ProtectedRoute>
                    {role === "admin" ? (
                      <AdminComplaints />
                    ) : role === "student" ? (
                      <StudentComplaints />
                    ) : (
                      <Navigate to="/" />
                    )}
                  </ProtectedRoute>
                </RequireAuth>
              }
            />

            <Route
              path="/budget"
              element={
                <RequireAuth>
                  <ProtectedRoute>
                    {role === "admin" ? (
                      <AdminBudget />
                    ) : role === "student" ? (
                      <StudentBudget />
                    ) : (
                      <Navigate to="/" />
                    )}
                  </ProtectedRoute>
                </RequireAuth>
              }
            />

            {/* Approval Portal Routes */}
            <Route
              path="/approvaldashboard"
              element={
                <RequireAuth>
                  <ProtectedRoute allowedRoles={["admin" ,"student"]}>
                    <AdminApprovalDashboard />
                  </ProtectedRoute>
                </RequireAuth>
              }
            />
            <Route
              path="/applications"
              element={
                <RequireAuth>
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Applications />
                  </ProtectedRoute>
                </RequireAuth>
              }
            />
            <Route
              path="/applications/:id"
              element={
                <RequireAuth>
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ApplicationDetails />
                  </ProtectedRoute>
                </RequireAuth>
              }
            />
            <Route
              path="/submit"
              element={
                <RequireAuth>
                  <ProtectedRoute allowedRoles={["admin","student"]}>
                    <SubmitApplication />
                  </ProtectedRoute>
                </RequireAuth>
              }
            />

            {/* Academic Integrity System Page */}
            <Route
              path="/academic-integrity"
              element={
                <RequireAuth>
                  <ProtectedRoute>
                    {role !== "doctor" ? (
                      <AcademicIntegritySystem />
                    ) : (
                      <Navigate to="/" />
                    )}
                  </ProtectedRoute>
                </RequireAuth>
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
