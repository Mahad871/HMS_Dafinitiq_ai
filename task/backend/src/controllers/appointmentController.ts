import { Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import User from '../models/User';
import { AuthRequest, AppointmentStatus } from '../types';
import { emailService } from '../services/emailService';
import { format } from 'date-fns';

export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    });

    if (existingAppointment) {
      res.status(400).json({ message: 'This time slot is already booked' });
      return;
    }

    const appointment = await Appointment.create({
      patient: req.user?._id,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      reason,
      status: AppointmentStatus.PENDING,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', '-password')
      .populate('patient', '-password');

    const doctor = await User.findById(doctorId);
    const patient = await User.findById(req.user?._id);

    if (!doctor || !patient) {
      res.status(404).json({ message: 'Doctor or patient not found' });
      return;
    }

    emailService.sendAppointmentBookedEmail(
      patient.email,
      doctor.email,
      {
        doctorName: doctor.name,
        patientName: patient.name,
        date: format(new Date(date), 'PPP'),
        timeSlot,
        reason,
      }
    );

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: populatedAppointment,
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      res.status(400).json({ message: 'This time slot is already booked' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPatientAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    
    let query: any = { patient: req.user?._id };
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', '-password')
      .sort({ date: -1, timeSlot: 1 });

    const appointmentsWithDoctorDetails = await Promise.all(
      appointments.map(async (apt: any) => {
        const doctorProfile = await Doctor.findOne({ userId: apt.doctor._id });
        return {
          ...apt.toObject(),
          doctorProfile,
        };
      })
    );

    res.json({ appointments: appointmentsWithDoctorDetails });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      _id: id,
      patient: req.user?._id,
    });

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      res.status(400).json({ message: 'Cannot cancel completed appointment' });
      return;
    }

    appointment.status = AppointmentStatus.CANCELLED;
    await appointment.save();

    res.json({
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAppointmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate('doctor', '-password')
      .populate('patient', '-password');

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    const isAuthorized =
      appointment.patient._id.toString() === req.user?._id ||
      appointment.doctor._id.toString() === req.user?._id;

    if (!isAuthorized) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
