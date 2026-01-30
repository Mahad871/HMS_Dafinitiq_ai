import { Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import Review from '../models/Review';
import User from '../models/User';
import { AuthRequest, AppointmentStatus, UserRole } from '../types';

export const getDoctorAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctorId = req.user?._id;

    // Total appointments
    const totalAppointments = await Appointment.countDocuments({ doctor: doctorId });

    // Appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      { $match: { doctor: doctorId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent appointments
    const recentAppointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name email')
      .sort({ date: -1 })
      .limit(10);

    // Average rating
    const reviews = await Review.find({ doctor: doctorId });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Monthly appointments (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyAppointments = await Appointment.aggregate([
      {
        $match: {
          doctor: doctorId,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Revenue estimation (if consultation fee is available)
    const doctorProfile = await Doctor.findOne({ userId: doctorId });
    const completedAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: AppointmentStatus.COMPLETED,
    });
    const estimatedRevenue = completedAppointments * (doctorProfile?.consultationFee || 0);

    res.json({
      totalAppointments,
      appointmentsByStatus,
      recentAppointments,
      avgRating: avgRating.toFixed(1),
      totalReviews: reviews.length,
      monthlyAppointments,
      completedAppointments,
      estimatedRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPatientAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patientId = req.user?._id;

    // Total appointments
    const totalAppointments = await Appointment.countDocuments({ patient: patientId });

    // Appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      { $match: { patient: patientId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Upcoming appointments
    const upcomingAppointments = await Appointment.find({
      patient: patientId,
      date: { $gte: new Date() },
      status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    })
      .populate('doctor', 'name')
      .sort({ date: 1 })
      .limit(5);

    // Doctors visited
    const doctorsVisited = await Appointment.distinct('doctor', {
      patient: patientId,
      status: AppointmentStatus.COMPLETED,
    });

    // Total spent
    const completedAppointments = await Appointment.find({
      patient: patientId,
      status: AppointmentStatus.COMPLETED,
    }).populate({
      path: 'doctor',
      populate: { path: 'userId' },
    });

    let totalSpent = 0;
    for (const apt of completedAppointments) {
      const doctorProfile = await Doctor.findOne({ userId: apt.doctor });
      if (doctorProfile) {
        totalSpent += doctorProfile.consultationFee;
      }
    }

    res.json({
      totalAppointments,
      appointmentsByStatus,
      upcomingAppointments,
      doctorsVisited: doctorsVisited.length,
      completedAppointments: completedAppointments.length,
      totalSpent,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAdminAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Total users
    const totalPatients = await User.countDocuments({ role: UserRole.PATIENT });
    const totalDoctors = await User.countDocuments({ role: UserRole.DOCTOR });

    // Total appointments
    const totalAppointments = await Appointment.countDocuments();

    // Appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent registrations
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Top rated doctors
    const topDoctors = await Doctor.find()
      .populate('userId', 'name email')
      .sort({ rating: -1 })
      .limit(5);

    // Monthly growth
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            role: '$role',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      appointmentsByStatus,
      recentUsers,
      topDoctors,
      monthlyGrowth,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
