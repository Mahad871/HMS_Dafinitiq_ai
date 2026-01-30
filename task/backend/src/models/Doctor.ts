import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types';

export interface IDoctorDocument extends Document {
  userId: mongoose.Types.ObjectId;
  specialization: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  availability: Array<{
    day: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      isBooked: boolean;
    }>;
  }>;
  rating: number;
  bio: string;
}

const doctorSchema = new Schema<IDoctorDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    qualification: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        slots: [
          {
            startTime: String,
            endTime: String,
            isBooked: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    bio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDoctorDocument>('Doctor', doctorSchema);
