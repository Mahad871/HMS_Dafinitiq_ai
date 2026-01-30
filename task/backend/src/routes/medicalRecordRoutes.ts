import express from 'express';
import {
  createMedicalRecord,
  getPatientRecords,
  getDoctorRecords,
  updateMedicalRecord,
} from '../controllers/medicalRecordController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = express.Router();

router.post('/', authenticate as any, authorize(UserRole.DOCTOR) as any, createMedicalRecord as any);
router.get('/patient', authenticate as any, authorize(UserRole.PATIENT) as any, getPatientRecords as any);
router.get('/doctor/:patientId', authenticate as any, authorize(UserRole.DOCTOR) as any, getDoctorRecords as any);
router.put('/:recordId', authenticate as any, authorize(UserRole.DOCTOR) as any, updateMedicalRecord as any);

export default router;
