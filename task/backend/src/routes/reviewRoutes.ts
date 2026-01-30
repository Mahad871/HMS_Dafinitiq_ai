import express from 'express';
import {
  createReview,
  getDoctorReviews,
  respondToReview,
} from '../controllers/reviewController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = express.Router();

router.post('/', authenticate as any, authorize(UserRole.PATIENT) as any, createReview as any);
router.get('/doctor/:doctorId', authenticate as any, getDoctorReviews as any);
router.put('/:reviewId/respond', authenticate as any, authorize(UserRole.DOCTOR) as any, respondToReview as any);

export default router;
