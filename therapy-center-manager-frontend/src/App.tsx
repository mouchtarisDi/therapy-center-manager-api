import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { useAuth } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import PaymentsPage from "./pages/PaymentsPage";
import SessionsPage from "./pages/SessionsPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import StudentsPage from "./pages/StudentsPage";
import CreateStudentPage from "./pages/CreateStudentPage";

function ProtectedApp() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/:id" element={<StudentDetailsPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/students/new" element={<CreateStudentPage />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? <ProtectedApp /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}