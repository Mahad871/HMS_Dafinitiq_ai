import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Calendar, Stethoscope, Bot, FileText, Pill, BarChart3 } from 'lucide-react';
import { UserRole } from '../types';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e: any) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">HealthCare</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/ai-assistant"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  <Bot className="h-5 w-5" />
                  <span className="hidden md:inline">AI Assistant</span>
                </Link>

                {user.role === UserRole.PATIENT && (
                  <>
                    <Link
                      to="/patient/appointments"
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                    >
                      <Calendar className="h-5 w-5" />
                      <span className="hidden md:inline">Appointments</span>
                    </Link>
                    <Link
                      to="/medical-records"
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                    >
                      <FileText className="h-5 w-5" />
                      <span className="hidden md:inline">Records</span>
                    </Link>
                    <Link
                      to="/prescriptions"
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                    >
                      <Pill className="h-5 w-5" />
                      <span className="hidden md:inline">Prescriptions</span>
                    </Link>
                  </>
                )}

                {user.role === UserRole.DOCTOR && (
                  <Link
                    to="/doctor/dashboard"
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline">Dashboard</span>
                  </Link>
                )}

                <Link
                  to="/analytics"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="hidden md:inline">Analytics</span>
                </Link>

                <NotificationBell />

                <span className="text-gray-700 hidden md:inline">Hello, {user.name}</span>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
