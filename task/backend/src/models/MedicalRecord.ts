import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalRecordDocument extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointment: mongoose.Types.ObjectId;
  diagnosis: string;
  prescription: string;
  labResults?: string;
  notes: string;
  attachments: string[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
}

const medicalRecordSchema = new Schema<IMedicalRecordDocument>(
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
    diagnosis: {
      type: String,
      required: true,
    },
    prescription: {
      type: String,
      required: true,
    },
    labResults: {
      type: String,
    },
    notes: {
      type: String,
      default: '',
    },
    attachments: [{
      type: String,
    }],
    vitalSigns: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      weight: Number,
      height: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMedicalRecordDocument>('MedicalRecord', medicalRecordSchema);
