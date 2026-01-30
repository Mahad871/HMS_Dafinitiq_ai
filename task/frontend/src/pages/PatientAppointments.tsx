import { useEffect, useState } from 'react';
import { appointmentService } from '../services/appointmentService';
import { Appointment, AppointmentStatus } from '../types';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, X } from 'lucide-react';
import { format } from 'date-fns';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      const { appointments } = await appointmentService.getMyAppointments(filter);
      setAppointments(appointments);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    setLoading(true);
    try {
      await appointmentService.cancelAppointment(id);
      toast.success('Appointment cancelled');
      setLoading(false);
    } catch (error) {
      toast.error('Failed to cancel appointment');
      setLoading(false);
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return 'bg-green-100 text-green-800';
      case AppointmentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case AppointmentStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case AppointmentStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Appointments</h1>

        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-lg ${!filter ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter(AppointmentStatus.PENDING)}
            className={`px-4 py-2 rounded-lg ${filter === AppointmentStatus.PENDING ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter(AppointmentStatus.CONFIRMED)}
            className={`px-4 py-2 rounded-lg ${filter === AppointmentStatus.CONFIRMED ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Confirmed
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-gray-600 mr-2" />
                      <h3 className="text-lg font-semibold">Dr. {appointment.doctor.name}</h3>
                    </div>
                    
                    {appointment.doctorProfile && (
                      <p className="text-gray-600 mb-2">{appointment.doctorProfile.specialization}</p>
                    )}

                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{format(new Date(appointment.date), 'PPP')}</span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{appointment.timeSlot}</span>
                    </div>

                    <p className="text-gray-700 mt-2">
                      <span className="font-medium">Reason:</span> {appointment.reason}
                    </p>

                    {appointment.notes && (
                      <p className="text-gray-700 mt-2">
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>

                    {appointment.status === AppointmentStatus.PENDING && (
                      <button
                        onClick={() => handleCancel(appointment._id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {appointments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No appointments found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;
