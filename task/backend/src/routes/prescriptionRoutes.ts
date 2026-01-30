import express from 'express';
import {
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  requestRefill,
  updatePrescriptionStatus,
} from '../controllers/prescriptionController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = express.Router();

router.post('/', authenticate as any, authorize(UserRole.DOCTOR) as any, createPrescription as any);
router.get('/patient', authenticate as any, authorize(UserRole.PATIENT) as any, getPatientPrescriptions as any);
router.get('/doctor/:patientId', authenticate as any, authorize(UserRole.DOCTOR) as any, getDoctorPrescriptions as any);
router.post('/:prescriptionId/refill', authenticate as any, authorize(UserRole.PATIENT) as any, requestRefill as any);
router.put('/:prescriptionId/status', authenticate as any, authorize(UserRole.DOCTOR) as any, updatePrescriptionStatus as any);

export default router;
