import { Response } from 'express';
import { AuthRequest } from '../types';
import { geminiService } from '../services/geminiService';

export const getHealthAdvice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { symptoms, medicalHistory } = req.body;

    if (!symptoms) {
      res.status(400).json({ message: 'Symptoms are required' });
      return;
    }

    const advice = await geminiService.getHealthAdvice(symptoms, medicalHistory);

    res.json({
      advice,
      disclaimer: 'This is AI-generated advice. Please consult a healthcare professional for proper diagnosis and treatment.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get health advice' });
  }
};

export const getDoctorRecommendation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      res.status(400).json({ message: 'Symptoms are required' });
      return;
    }

    const recommendation = await geminiService.getDoctorRecommendation(symptoms);

    res.json({ recommendation });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get recommendation' });
  }
};

export const getHealthTips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category } = req.query;

    const tips = await geminiService.getHealthTips(category as string || 'general wellness');

    res.json({ tips });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get health tips' });
  }
};

export const analyzeMedicalReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reportText } = req.body;

    if (!reportText) {
      res.status(400).json({ message: 'Report text is required' });
      return;
    }

    const analysis = await geminiService.analyzeMedicalReport(reportText);

    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ message: 'Failed to analyze report' });
  }
};
