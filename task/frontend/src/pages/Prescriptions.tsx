import { useEffect, useState } from 'react';
import { Pill, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  _id: string;
  doctor: {
    name: string;
  };
  medications: Medication[];
  diagnosis: string;
  notes: string;
  validUntil: string;
  status: string;
  refillsAllowed: number;
  refillsUsed: number;
  createdAt: string;
}

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    fetchPrescriptions();
  }, [filter]);

  const fetchPrescriptions = async () => {
    try {
      const { data } = await api.get(`/prescriptions/patient?status=${filter}`);
      setPrescriptions(data.prescriptions);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const requestRefill = async (prescriptionId: string) => {
    try {
      await api.post(`/prescriptions/${prescriptionId}/refill`);
      toast.success('Refill requested successfully');
      fetchPrescriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request refill');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Prescriptions</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'active'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'completed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded-lg ${
                filter === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              All
            </button>
          </div>
        </motion.div>

        {prescriptions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No prescriptions found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((prescription, index) => (
              <motion.div
                key={prescription._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Dr. {prescription.doctor.name}
                    </h3>
                    <p className="text-gray-600">{prescription.diagnosis}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Issued: {format(new Date(prescription.createdAt), 'PPP')}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>Valid until: {format(new Date(prescription.validUntil), 'PPP')}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Medications:</h4>
                  <div className="space-y-3">
                    {prescription.medications.map((med, idx) => (
                      <div key={idx} className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <Pill className="h-5 w-5 text-primary-600 mr-2 mt-1" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{med.name}</p>
                            <p className="text-sm text-gray-600">
                              Dosage: {med.dosage} | Frequency: {med.frequency}
                            </p>
                            <p className="text-sm text-gray-600">Duration: {med.duration}</p>
                            {med.instructions && (
                              <p className="text-sm text-gray-700 mt-1">
                                <span className="font-medium">Instructions:</span> {med.instructions}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {prescription.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Doctor's Notes:</span> {prescription.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Refills: {prescription.refillsUsed} / {prescription.refillsAllowed} used
                  </div>
                  {prescription.status === 'active' &&
                    prescription.refillsUsed < prescription.refillsAllowed &&
                    new Date() < new Date(prescription.validUntil) && (
                      <button
                        onClick={() => requestRefill(prescription._id)}
                        className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Request Refill</span>
                      </button>
                    )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
