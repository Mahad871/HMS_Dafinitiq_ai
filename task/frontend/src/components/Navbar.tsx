import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  LogOut,
  User,
  Calendar,
  Stethoscope,
  Bot,
  FileText,
  Pill,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { UserRole } from "../types";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = (e: any) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={closeMobile}
            >
              <Stethoscope className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">
                HealthCare
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              className="md:hidden p-2 text-gray-700 hover:text-primary-600"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <div className="hidden md:flex items-center space-x-4">
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
                  {user.role === UserRole.DOCTOR && (
                    <Link
                      to="/analytics"
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span className="hidden md:inline">Analytics</span>
                    </Link>
                  )}

                  <NotificationBell />

                  <span className="text-gray-700 hidden md:inline">
                    Hello, {user.name}
                  </span>

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
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600"
                  >
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
        {mobileOpen && (
          <div className="md:hidden border-t py-3 space-y-2">
            {user ? (
              <>
                <Link
                  to="/ai-assistant"
                  onClick={closeMobile}
                  className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-primary-600"
                >
                  <Bot className="h-5 w-5" />
                  <span>AI Assistant</span>
                </Link>

                {user.role === UserRole.PATIENT && (
                  <>
                    <Link
                      to="/patient/appointments"
                      onClick={closeMobile}
                      className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-primary-600"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Appointments</span>
                    </Link>
                    <Link
                      to="/medical-records"
                      onClick={closeMobile}
                      className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-primary-600"
                    >
                      <FileText className="h-5 w-5" />
                      <span>Records</span>
                    </Link>
                    <Link
                      to="/prescriptions"
                      onClick={closeMobile}
                      className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-primary-600"
                    >
                      <Pill className="h-5 w-5" />
                      <span>Prescriptions</span>
                    </Link>
                  </>
                )}

                {user.role === UserRole.DOCTOR && (
                  <Link
                    to="/doctor/dashboard"
                    onClick={closeMobile}
                    className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-primary-600"
                  >
                    <User className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {user.role === UserRole.DOCTOR && (
                  <Link
                    to="/analytics"
                    onClick={closeMobile}
                    className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-primary-600"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Analytics</span>
                  </Link>
                )}

                <div className="px-2 py-2">
                  <NotificationBell />
                </div>

                <div className="px-2 py-2 text-sm text-gray-600">
                  Hello, {user.name}
                </div>

                <button
                  onClick={(e) => {
                    handleLogout(e);
                    closeMobile();
                  }}
                  className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-red-600 w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="block px-2 py-2 text-gray-700 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="block px-2 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
