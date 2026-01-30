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

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export interface Doctor {
  _id: string;
  userId: any;
  specialization: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  availability: Availability[];
  rating: number;
  bio: string;
}

export interface Availability {
  day: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Appointment {
  _id: string;
  patient: User;
  doctor: User;
  doctorProfile?: Doctor;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}
