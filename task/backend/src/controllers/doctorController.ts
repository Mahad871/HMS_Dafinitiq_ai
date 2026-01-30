import { Response } from 'express';
import Doctor from '../models/Doctor';
import User from '../models/User';
import Appointment from '../models/Appointment';
import { AuthRequest, UserRole, AppointmentStatus } from '../types';
import { emailService } from '../services/emailService';
import { format } from 'date-fns';

export const createDoctorProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const { specialization, experience, qualification, consultationFee, bio, availability } = req.body;

    if (req.user?.role !== UserRole.DOCTOR) {
      res.status(403).json({ message: 'Only users with doctor role can create doctor profile' });
      return;
    }

    const existingProfile = await Doctor.findOne({ userId: req.user._id });
    if (existingProfile) {
      res.status(400).json({ message: 'Doctor profile already exists' });
      return;
    }

    const doctorProfile = await Doctor.create({
      userId: req.user._id,
      specialization,
      experience,
      qualification,
      consultationFee,
      bio,
      availability: availability || [],
    });

    res.status(201).json({
      message: 'Doctor profile created successfully',
      doctor: doctorProfile,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDoctorProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updates = req.body;

    const doctorProfile = await Doctor.findOneAndUpdate(
      { userId: req.user?._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!doctorProfile) {
      res.status(404).json({ message: 'Doctor profile not found' });
      return;
    }

    res.json({
      message: 'Profile updated successfully',
      doctor: doctorProfile,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDoctorProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctorProfile = await Doctor.findOne({ userId: req.user?._id }).populate('userId', '-password');

    if (!doctorProfile) {
      res.status(404).json({ message: 'Doctor profile not found' });
      return;
    }

    res.json({ doctor: doctorProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllDoctors = async (req: AuthRequest, res: Response) => {
  try {
    const { specialization, search } = req.query;
    
    let query: any = {};
    
    if (specialization) {
      query.specialization = specialization;
    }

    const doctors = await Doctor.find(query).populate('userId', '-password');

    let filteredDoctors = doctors;
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredDoctors = doctors.filter((doc: any) => 
        doc.userId.name.toLowerCase().includes(searchLower) ||
        doc.specialization.toLowerCase().includes(searchLower)
      );
    }

    res.json({ doctors: filteredDoctors });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDoctorById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findOne({ userId: id }).populate('userId', '-password');

    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDoctorAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    
    let query: any = { doctor: req.user?._id };
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', '-password')
      .sort({ date: 1, timeSlot: 1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!Object.values(AppointmentStatus).includes(status)) {
    res.status(400).json({ message: 'Invalid appointment status' });
    return;
  }

  const appointment = await Appointment.findOne({ _id: id, doctor: req.user?._id });

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    if (status === AppointmentStatus.CONFIRMED) {
      const populatedAppointment = await Appointment.findById(id)
        .populate('patient')
        .populate('doctor');

      if (populatedAppointment) {
        const patient = populatedAppointment.patient;
        const doctor = populatedAppointment.doctor;

        if (
          patient &&
          doctor &&
          typeof patient === 'object' &&
          typeof doctor === 'object' &&
          'email' in patient &&
          'name' in doctor
        ) {
          const patientEmail = (patient as { email: string }).email;
          const doctorName = (doctor as { name: string }).name;

          emailService.sendAppointmentConfirmedEmail(
            patientEmail,
            {
              doctorName,
              date: format(new Date(appointment.date), 'PPP'),
              timeSlot: appointment.timeSlot,
            }
          );
        }
      }
    }

    res.json({
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
