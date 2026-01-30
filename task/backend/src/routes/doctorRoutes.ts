import express from 'express';
import {
  createDoctorProfile,
  updateDoctorProfile,
  getDoctorProfile,
  getAllDoctors,
  getDoctorById,
  getDoctorAppointments,
  updateAppointmentStatus,
} from '../controllers/doctorController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = express.Router();

router.post('/profile', authenticate as any, authorize(UserRole.DOCTOR) as any, createDoctorProfile as any);
router.put('/profile', authenticate as any, authorize(UserRole.DOCTOR) as any, updateDoctorProfile as any);
router.get('/profile', authenticate as any, authorize(UserRole.DOCTOR) as any, getDoctorProfile as any);

router.get('/', authenticate as any, getAllDoctors as any);
router.get('/:id', authenticate as any, getDoctorById as any);

router.get('/appointments/list', authenticate as any, authorize(UserRole.DOCTOR) as any, getDoctorAppointments as any);
router.put('/appointments/:id', authenticate as any, authorize(UserRole.DOCTOR) as any, updateAppointmentStatus as any);

export default router;
