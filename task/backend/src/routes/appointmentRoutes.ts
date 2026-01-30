import express from 'express';
import {
  createAppointment,
  getPatientAppointments,
  cancelAppointment,
  getAppointmentById,
} from '../controllers/appointmentController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = express.Router();

router.post('/', authenticate as any, authorize(UserRole.PATIENT) as any, createAppointment as any);
router.get('/my-appointments', authenticate as any, authorize(UserRole.PATIENT) as any, getPatientAppointments as any);
router.put('/:id/cancel', authenticate as any, authorize(UserRole.PATIENT) as any, cancelAppointment as any);
router.get('/:id', authenticate as any, getAppointmentById as any);

export default router;
