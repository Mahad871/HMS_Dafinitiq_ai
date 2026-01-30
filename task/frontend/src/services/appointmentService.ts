import api from './api';
import { Appointment } from '../types';

export const appointmentService = {
  createAppointment: async (data: {
    doctorId: string;
    date: string;
    timeSlot: string;
    reason: string;
  }): Promise<{ appointment: Appointment; message: string }> => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  getMyAppointments: async (status?: string): Promise<{ appointments: Appointment[] }> => {
    const response = await api.get('/appointments/my-appointments', { params: { status } });
    return response.data;
  },

  cancelAppointment: async (id: string) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data.appointment;
  },

  getAppointmentById: async (id: string): Promise<{ appointment: Appointment }> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
};
