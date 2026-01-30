import mongoose, { Schema, Document } from 'mongoose';
import { AppointmentStatus } from '../types';

export interface IAppointmentDocument extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
}

const appointmentSchema = new Schema<IAppointmentDocument>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING,
    },
    reason: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index(
  { doctor: 1, date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    },
  }
);

export default mongoose.model<IAppointmentDocument>('Appointment', appointmentSchema);
