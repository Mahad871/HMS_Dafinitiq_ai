import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BookAppointment from './pages/BookAppointment';
import PatientAppointments from './pages/PatientAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import AuthCallback from './pages/AuthCallback';
import AIHealthAssistant from './pages/AIHealthAssistant';
import MedicalRecords from './pages/MedicalRecords';
import Reviews from './pages/Reviews';
import Prescriptions from './pages/Prescriptions';
import Analytics from './pages/Analytics';
import { UserRole } from './types';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIHealthAssistant />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/book-appointment/:doctorId"
          element={
            <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
              <PatientAppointments />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/medical-records"
          element={
            <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
              <MedicalRecords />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
              <Prescriptions />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/reviews/:doctorId"
          element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
