import express from 'express';
import {
  getDoctorAnalytics,
  getPatientAnalytics,
  getAdminAnalytics,
} from '../controllers/analyticsController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = express.Router();

router.get('/doctor', authenticate as any, authorize(UserRole.DOCTOR) as any, getDoctorAnalytics as any);
router.get('/patient', authenticate as any, authorize(UserRole.PATIENT) as any, getPatientAnalytics as any);
router.get('/admin', authenticate as any, authorize(UserRole.ADMIN) as any, getAdminAnalytics as any);

export default router;
