import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewDocument extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointment: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  response?: string;
}

const reviewSchema = new Schema<IReviewDocument>(
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
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    response: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ doctor: 1 });
reviewSchema.index({ patient: 1, appointment: 1 }, { unique: true });

export default mongoose.model<IReviewDocument>('Review', reviewSchema);
