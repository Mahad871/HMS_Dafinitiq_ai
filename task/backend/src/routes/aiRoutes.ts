import express from 'express';
import {
  getHealthAdvice,
  getDoctorRecommendation,
  getHealthTips,
  analyzeMedicalReport,
} from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/health-advice', authenticate as any, getHealthAdvice as any);
router.post('/doctor-recommendation', authenticate as any, getDoctorRecommendation as any);
router.get('/health-tips', authenticate as any, getHealthTips as any);
router.post('/analyze-report', authenticate as any, analyzeMedicalReport as any);

export default router;
