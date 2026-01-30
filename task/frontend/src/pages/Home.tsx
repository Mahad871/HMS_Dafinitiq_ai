import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { Doctor } from '../types';
import { Search, Star, Calendar, Filter, MapPin, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Home = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [loading, setLoading] = useState(true);

  const specializations = [
    'All Specializations',
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Neurologist',
    'Orthopedic',
    'Psychiatrist',
    'General Physician',
  ];

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedSpecialization && selectedSpecialization !== 'All Specializations') {
        params.specialization = selectedSpecialization;
      }
      const { doctors } = await doctorService.getAllDoctors(params);
      setDoctors(doctors);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, [selectedSpecialization]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.userId.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Find Your Perfect Doctor</h1>
            <p className="text-xl mb-8 text-blue-100">Book appointments with the best healthcare professionals</p>
            
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor name or specialization..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-primary-300 shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filter by Specialization</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec === 'All Specializations' ? '' : spec)}
                className={`px-4 py-2 rounded-full transition ${
                  (spec === 'All Specializations' && !selectedSpecialization) ||
                  selectedSpecialization === spec
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-primary-600">{filteredDoctors.length}</span> doctors
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="bg-gradient-to-r from-primary-500 to-purple-500 h-24"></div>
                <div className="p-6 -mt-12">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-primary-600 shadow-lg mx-auto mb-4 border-4 border-white">
                    {doctor.userId.name.charAt(0)}
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.userId.name}</h3>
                    <p className="text-primary-600 font-medium">{doctor.specialization}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Award className="h-4 w-4 mr-2 text-primary-600" />
                      <span className="text-sm">{doctor.qualification}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                      <span className="text-sm">{doctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-semibold text-gray-700">
                          {doctor.rating || 'New'}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-primary-600">${doctor.consultationFee}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/book-appointment/${doctor.userId._id || doctor.userId.id}`}
                      className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition group-hover:shadow-lg"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Book Now</span>
                    </Link>
                    <Link
                      to={`/reviews/${doctor.userId._id || doctor.userId.id}`}
                      className="px-4 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition"
                    >
                      <Star className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-20 w-20 mx-auto" />
            </div>
            <p className="text-gray-600 text-xl">No doctors found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
