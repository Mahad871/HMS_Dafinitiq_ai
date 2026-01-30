import { Request } from 'express';

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin'
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface IUser {
  _id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  googleId?: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
}

export interface IDoctor extends IUser {
  specialization: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  availability: IAvailability[];
  rating?: number;
  bio?: string;
}

export interface IAvailability {
  day: string;
  slots: ITimeSlot[];
}

export interface ITimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface IAppointment {
  _id: string;
  patient: string | IUser;
  doctor: string | IDoctor;
  date: Date;
  timeSlot: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: any;
}
