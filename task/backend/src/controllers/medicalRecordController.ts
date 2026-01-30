import { Response } from 'express';
import MedicalRecord from '../models/MedicalRecord';
import Appointment from '../models/Appointment';
import { AuthRequest, UserRole } from '../types';

export const createMedicalRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId, diagnosis, prescription, labResults, notes, vitalSigns } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: req.user?._id,
    });

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    const record = await MedicalRecord.create({
      patient: appointment.patient,
      doctor: req.user?._id,
      appointment: appointmentId,
      diagnosis,
      prescription,
      labResults,
      notes,
      vitalSigns,
    });

    res.status(201).json({ message: 'Medical record created successfully', record });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPatientRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const records = await MedicalRecord.find({ patient: req.user?._id })
      .populate('doctor', 'name')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({ records });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDoctorRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;

    const records = await MedicalRecord.find({
      doctor: req.user?._id,
      patient: patientId,
    })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });

    res.json({ records });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateMedicalRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { recordId } = req.params;
    const updates = req.body;

    const record = await MedicalRecord.findOneAndUpdate(
      { _id: recordId, doctor: req.user?._id },
      updates,
      { new: true }
    );

    if (!record) {
      res.status(404).json({ message: 'Medical record not found' });
      return;
    }

    res.json({ message: 'Record updated successfully', record });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
