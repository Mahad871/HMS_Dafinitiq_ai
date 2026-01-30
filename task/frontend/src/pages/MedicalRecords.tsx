import { useEffect, useState } from 'react';
import { FileText, Calendar, User, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { format } from 'date-fns';

interface MedicalRecord {
  _id: string;
  doctor: {
    name: string;
  };
  diagnosis: string;
  prescription: string;
  labResults?: string;
  notes: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
  createdAt: string;
}

const MedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [selectedRecord]);

  const fetchRecords = async () => {
    try {
      const { data } = await api.get('/medical-records/patient');
      setRecords(data.records);
    } catch (error) {
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Medical Records</h1>

        {records.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No medical records yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {records.map((record) => (
                <div
                  key={record._id}
                  onClick={() => setSelectedRecord(record)}
                  className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition ${
                    selectedRecord?._id === record._id ? 'ring-2 ring-primary-600' : ''
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-900">{record.doctor.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{format(new Date(record.createdAt), 'PPP')}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 line-clamp-2">{record.diagnosis}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedRecord ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Record Details</h2>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{format(new Date(selectedRecord.createdAt), 'PPP')}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Doctor</h3>
                      <p className="text-gray-700">{selectedRecord.doctor.name}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Diagnosis</h3>
                      <p className="text-gray-700">{selectedRecord.diagnosis}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Prescription</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedRecord.prescription}</p>
                    </div>

                    {selectedRecord.labResults && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Lab Results</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedRecord.labResults}</p>
                      </div>
                    )}

                    {selectedRecord.vitalSigns && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                          <Activity className="h-5 w-5 mr-2" />
                          Vital Signs
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedRecord.vitalSigns.bloodPressure && (
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-sm text-gray-600">Blood Pressure</p>
                              <p className="text-lg font-semibold">{selectedRecord.vitalSigns.bloodPressure}</p>
                            </div>
                          )}
                          {selectedRecord.vitalSigns.heartRate && (
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-sm text-gray-600">Heart Rate</p>
                              <p className="text-lg font-semibold">{selectedRecord.vitalSigns.heartRate} bpm</p>
                            </div>
                          )}
                          {selectedRecord.vitalSigns.temperature && (
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-sm text-gray-600">Temperature</p>
                              <p className="text-lg font-semibold">{selectedRecord.vitalSigns.temperature}°F</p>
                            </div>
                          )}
                          {selectedRecord.vitalSigns.weight && (
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-sm text-gray-600">Weight</p>
                              <p className="text-lg font-semibold">{selectedRecord.vitalSigns.weight} kg</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedRecord.notes && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Notes</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedRecord.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a record to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
