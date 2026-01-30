import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicationDocument {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface IPrescriptionDocument extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointment: mongoose.Types.ObjectId;
  medications: IMedicationDocument[];
  diagnosis: string;
  notes: string;
  validUntil: Date;
  status: 'active' | 'completed' | 'cancelled';
  refillsAllowed: number;
  refillsUsed: number;
}

const prescriptionSchema = new Schema<IPrescriptionDocument>(
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
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: { type: String, default: '' },
      },
    ],
    diagnosis: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    validUntil: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    refillsAllowed: {
      type: Number,
      default: 0,
    },
    refillsUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

prescriptionSchema.index({ patient: 1, status: 1 });

export default mongoose.model<IPrescriptionDocument>('Prescription', prescriptionSchema);
