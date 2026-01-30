import { Response } from 'express';
import Review from '../models/Review';
import Doctor from '../models/Doctor';
import Appointment from '../models/Appointment';
import { AuthRequest, AppointmentStatus } from '../types';

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId, rating, comment } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: req.user?._id,
      status: AppointmentStatus.COMPLETED,
    });

    if (!appointment) {
      res.status(404).json({ message: 'Completed appointment not found' });
      return;
    }

    const existingReview = await Review.findOne({
      patient: req.user?._id,
      appointment: appointmentId,
    });

    if (existingReview) {
      res.status(400).json({ message: 'You have already reviewed this appointment' });
      return;
    }

    const review = await Review.create({
      patient: req.user?._id,
      doctor: appointment.doctor,
      appointment: appointmentId,
      rating,
      comment,
    });

    // Update doctor's average rating
    const reviews = await Review.find({ doctor: appointment.doctor });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Doctor.findOneAndUpdate({ userId: appointment.doctor }, { rating: avgRating });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDoctorReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { doctorId } = req.params;

    const reviews = await Review.find({ doctor: doctorId })
      .populate('patient', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const respondToReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;

    const review = await Review.findOne({ _id: reviewId, doctor: req.user?._id });

    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    review.response = response;
    await review.save();

    res.json({ message: 'Response added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
