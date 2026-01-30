import { Response } from 'express';
import Prescription from '../models/Prescription';
import Appointment from '../models/Appointment';
import { AuthRequest, UserRole } from '../types';
import { createNotification } from './notificationController';

export const createPrescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId, medications, diagnosis, notes, validUntil, refillsAllowed } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: req.user?._id,
    });

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    const prescription = await Prescription.create({
      patient: appointment.patient,
      doctor: req.user?._id,
      appointment: appointmentId,
      medications,
      diagnosis,
      notes,
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      refillsAllowed: refillsAllowed || 0,
    });

    // Create notification for patient
    await createNotification(
      appointment.patient.toString(),
      'New Prescription',
      'Your doctor has issued a new prescription',
      'appointment',
      `/prescriptions/${prescription._id}`
    );

    res.status(201).json({ message: 'Prescription created successfully', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPatientPrescriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const query: any = { patient: req.user?._id };
    
    if (status) {
      query.status = status;
    }

    const prescriptions = await Prescription.find(query)
      .populate('doctor', 'name')
      .sort({ createdAt: -1 });

    res.json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDoctorPrescriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({
      doctor: req.user?._id,
      patient: patientId,
    })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });

    res.json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const requestRefill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findOne({
      _id: prescriptionId,
      patient: req.user?._id,
    });

    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    if (prescription.refillsUsed >= prescription.refillsAllowed) {
      res.status(400).json({ message: 'No refills remaining. Please contact your doctor.' });
      return;
    }

    if (new Date() > prescription.validUntil) {
      res.status(400).json({ message: 'Prescription has expired. Please book a new appointment.' });
      return;
    }

    prescription.refillsUsed += 1;
    await prescription.save();

    // Notify doctor
    await createNotification(
      prescription.doctor.toString(),
      'Refill Request',
      'A patient has requested a prescription refill',
      'appointment',
      `/prescriptions/${prescription._id}`
    );

    res.json({ message: 'Refill requested successfully', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updatePrescriptionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { prescriptionId } = req.params;
    const { status } = req.body;

    const prescription = await Prescription.findOneAndUpdate(
      { _id: prescriptionId, doctor: req.user?._id },
      { status },
      { new: true }
    );

    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    res.json({ message: 'Prescription updated successfully', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
