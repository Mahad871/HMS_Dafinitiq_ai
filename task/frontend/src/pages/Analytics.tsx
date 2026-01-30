import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppointmentStatus, UserRole } from '../types';
import {
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Star,
  Activity,
  BarChart3,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let endpoint = '/analytics/patient';
      if (user?.role === UserRole.DOCTOR) {
        endpoint = '/analytics/doctor';
      } else if (user?.role === UserRole.ADMIN) {
        endpoint = '/analytics/admin';
      }

      const { data } = await api.get(endpoint);
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  const safeAnalytics = useMemo(() => {
    return {
      totalAppointments: analytics?.totalAppointments ?? 0,
      completedAppointments: analytics?.completedAppointments ?? 0,
      avgRating: analytics?.avgRating ?? '0.0',
      estimatedRevenue: analytics?.estimatedRevenue ?? 0,
      doctorsVisited: analytics?.doctorsVisited ?? 0,
      totalSpent: analytics?.totalSpent ?? 0,
      appointmentsByStatus: analytics?.appointmentsByStatus ?? [],
      monthlyAppointments: analytics?.monthlyAppointments ?? [],
    };
  }, [analytics]);

  const statusOrder = [
    AppointmentStatus.PENDING,
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.COMPLETED,
  ];

  const appointmentsByStatus = useMemo(() => {
    const raw = safeAnalytics.appointmentsByStatus;
    const fallbackAppointments = analytics?.appointments || analytics?.recentAppointments || [];

    const computeFromAppointments = (items: any[]) => {
      const counts = new Map<string, number>();
      items.forEach((apt: any) => {
        const key = String(apt?.status ?? '');
        if (!key) return;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      });
      return statusOrder.map((status) => ({
        _id: status,
        count: counts.get(status) ?? 0,
      }));
    };

    if ((!raw || (Array.isArray(raw) && raw.length === 0)) && fallbackAppointments.length > 0) {
      return computeFromAppointments(fallbackAppointments);
    }

    const normalized = Array.isArray(raw)
      ? raw
      : Object.entries(raw || {}).map(([key, value]) => ({ _id: key, count: value }));

    const counts = new Map<string, number>();
    normalized.forEach((entry: any) => {
      const key = String(entry?._id ?? '');
      const count = Number(entry?.count ?? 0);
      counts.set(key, count);
    });

    return statusOrder.map((status) => ({
      _id: status,
      count: counts.get(status) ?? 0,
    }));
  }, [safeAnalytics.appointmentsByStatus, analytics?.appointments, analytics?.recentAppointments]);

  const hasStatusData = appointmentsByStatus.some((entry) => entry.count > 0);

  const monthlyAppointments = safeAnalytics.monthlyAppointments.map((item: any) => ({
    ...item,
    monthLabel: item?._id?.month ? `${item._id.month}/${item._id.year}` : 'Unknown',
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your healthcare journey</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user?.role === UserRole.DOCTOR && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="h-8 w-8" />
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{safeAnalytics.totalAppointments}</p>
                <p className="text-blue-100">Total Appointments</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-8 w-8" />
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{safeAnalytics.completedAppointments}</p>
                <p className="text-purple-100">Completed</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-8 w-8" />
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{safeAnalytics.avgRating}</p>
                <p className="text-green-100">Average Rating</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8" />
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">${safeAnalytics.estimatedRevenue}</p>
                <p className="text-yellow-100">Estimated Revenue</p>
              </motion.div>
            </>
          )}

          {user?.role === UserRole.PATIENT && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="h-8 w-8" />
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{safeAnalytics.totalAppointments}</p>
                <p className="text-blue-100">Total Appointments</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8" />
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{safeAnalytics.doctorsVisited}</p>
                <p className="text-purple-100">Doctors Visited</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-8 w-8" />
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{safeAnalytics.completedAppointments}</p>
                <p className="text-green-100">Completed</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8" />
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">${safeAnalytics.totalSpent}</p>
                <p className="text-yellow-100">Total Spent</p>
              </motion.div>
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments by Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
              Appointments by Status
            </h3>
            {hasStatusData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={appointmentsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${String(entry._id ?? 'Unknown')}: ${entry.count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {appointmentsByStatus.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No status data yet
              </div>
            )}
          </motion.div>

          {/* Monthly Trend */}
          {user?.role === UserRole.DOCTOR && monthlyAppointments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                Monthly Appointments
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthLabel" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
