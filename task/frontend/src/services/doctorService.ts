import api from './api';
import { Doctor, Appointment } from '../types';

export const doctorService = {
  getAllDoctors: async (params?: { specialization?: string; search?: string }) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  getDoctorById: async (id: string): Promise<{ doctor: Doctor }> => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  createProfile: async (data: any) => {
    const response = await api.post('/doctors/profile', data);
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/doctors/profile', data);
    return response.data;
  },

  getProfile: async (): Promise<{ doctor: Doctor }> => {
    const response = await api.get('/doctors/profile');
    return response.data;
  },

  getAppointments: async (status?: string): Promise<{ appointments: Appointment[] }> => {
    const response = await api.get('/doctors/appointments/list', { params: { status } });
    return response.data.appointments;
  },

  updateAppointmentStatus: async (id: string, status: string, notes?: string) => {
    const response = await api.put(`/doctors/appointments/${id}`, { status, notes });
    return response.data;
  },
};
