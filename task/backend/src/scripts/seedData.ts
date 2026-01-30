import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Doctor from '../models/Doctor';
import { UserRole } from '../types';

dotenv.config();

const pakistaniDoctors = [
  {
    name: 'Dr. Ahmed Hassan',
    email: 'ahmed.hassan@hospital.pk',
    password: 'doctor123',
    specialization: 'Cardiologist',
    experience: 18,
    qualification: 'MBBS, FCPS (Cardiology), FRCP',
    consultationFee: 3000,
    bio: 'Senior Cardiologist with expertise in interventional cardiology. Trained at Aga Khan University Hospital, Karachi.',
  },
  {
    name: 'Dr. Fatima Malik',
    email: 'fatima.malik@hospital.pk',
    password: 'doctor123',
    specialization: 'Dermatologist',
    experience: 12,
    qualification: 'MBBS, FCPS (Dermatology)',
    consultationFee: 2500,
    bio: 'Specialist in skin diseases, cosmetic dermatology, and laser treatments. Practicing in Lahore.',
  },
  {
    name: 'Dr. Muhammad Asif',
    email: 'muhammad.asif@hospital.pk',
    password: 'doctor123',
    specialization: 'Pediatrician',
    experience: 15,
    qualification: 'MBBS, FCPS (Pediatrics), MRCPCH',
    consultationFee: 2000,
    bio: 'Experienced pediatrician specializing in child healthcare and vaccination. Based in Islamabad.',
  },
  {
    name: 'Dr. Ayesha Khan',
    email: 'ayesha.khan@hospital.pk',
    password: 'doctor123',
    specialization: 'Gynecologist',
    experience: 14,
    qualification: 'MBBS, FCPS (Gynecology & Obstetrics)',
    consultationFee: 2800,
    bio: 'Expert in women\'s health, pregnancy care, and gynecological surgeries. Practicing in Karachi.',
  },
  {
    name: 'Dr. Imran Ali',
    email: 'imran.ali@hospital.pk',
    password: 'doctor123',
    specialization: 'Orthopedic Surgeon',
    experience: 16,
    qualification: 'MBBS, FCPS (Orthopedics), FRCS',
    consultationFee: 3500,
    bio: 'Specialist in joint replacement, sports injuries, and trauma surgery. Senior consultant in Lahore.',
  },
  {
    name: 'Dr. Sana Tariq',
    email: 'sana.tariq@hospital.pk',
    password: 'doctor123',
    specialization: 'Psychiatrist',
    experience: 10,
    qualification: 'MBBS, FCPS (Psychiatry)',
    consultationFee: 2200,
    bio: 'Mental health specialist focusing on depression, anxiety, and stress management. Based in Islamabad.',
  },
  {
    name: 'Dr. Bilal Ahmed',
    email: 'bilal.ahmed@hospital.pk',
    password: 'doctor123',
    specialization: 'Neurologist',
    experience: 13,
    qualification: 'MBBS, FCPS (Neurology)',
    consultationFee: 3200,
    bio: 'Expert in treating neurological disorders, headaches, and epilepsy. Practicing in Karachi.',
  },
  {
    name: 'Dr. Zainab Hussain',
    email: 'zainab.hussain@hospital.pk',
    password: 'doctor123',
    specialization: 'General Physician',
    experience: 8,
    qualification: 'MBBS, FCPS (Medicine)',
    consultationFee: 1500,
    bio: 'General physician providing comprehensive primary healthcare services. Available in Lahore.',
  },
  {
    name: 'Dr. Usman Farooq',
    email: 'usman.farooq@hospital.pk',
    password: 'doctor123',
    specialization: 'ENT Specialist',
    experience: 11,
    qualification: 'MBBS, FCPS (ENT)',
    consultationFee: 2400,
    bio: 'Ear, Nose, and Throat specialist with expertise in sinus and hearing disorders. Based in Islamabad.',
  },
  {
    name: 'Dr. Hina Iqbal',
    email: 'hina.iqbal@hospital.pk',
    password: 'doctor123',
    specialization: 'Dentist',
    experience: 9,
    qualification: 'BDS, FCPS (Dentistry)',
    consultationFee: 1800,
    bio: 'Dental surgeon specializing in cosmetic dentistry and root canal treatments. Practicing in Karachi.',
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor-appointment');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ role: UserRole.DOCTOR });
    await Doctor.deleteMany({});
    console.log('🗑️  Cleared existing doctor data');

    // Create doctors
    for (const doctorData of pakistaniDoctors) {
      const user = await User.create({
        name: doctorData.name,
        email: doctorData.email,
        password: doctorData.password,
        role: UserRole.DOCTOR,
      });

      await Doctor.create({
        userId: user._id,
        specialization: doctorData.specialization,
        experience: doctorData.experience,
        qualification: doctorData.qualification,
        consultationFee: doctorData.consultationFee,
        bio: doctorData.bio,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '09:00 AM', endTime: '10:00 AM', isBooked: false },
              { startTime: '10:00 AM', endTime: '11:00 AM', isBooked: false },
              { startTime: '02:00 PM', endTime: '03:00 PM', isBooked: false },
              { startTime: '03:00 PM', endTime: '04:00 PM', isBooked: false },
            ],
          },
          {
            day: 'Tuesday',
            slots: [
              { startTime: '09:00 AM', endTime: '10:00 AM', isBooked: false },
              { startTime: '11:00 AM', endTime: '12:00 PM', isBooked: false },
              { startTime: '02:00 PM', endTime: '03:00 PM', isBooked: false },
            ],
          },
          {
            day: 'Wednesday',
            slots: [
              { startTime: '09:00 AM', endTime: '10:00 AM', isBooked: false },
              { startTime: '10:00 AM', endTime: '11:00 AM', isBooked: false },
              { startTime: '04:00 PM', endTime: '05:00 PM', isBooked: false },
            ],
          },
          {
            day: 'Thursday',
            slots: [
              { startTime: '10:00 AM', endTime: '11:00 AM', isBooked: false },
              { startTime: '02:00 PM', endTime: '03:00 PM', isBooked: false },
              { startTime: '03:00 PM', endTime: '04:00 PM', isBooked: false },
            ],
          },
          {
            day: 'Friday',
            slots: [
              { startTime: '10:00 AM', endTime: '11:00 AM', isBooked: false },
              { startTime: '03:00 PM', endTime: '04:00 PM', isBooked: false },
              { startTime: '04:00 PM', endTime: '05:00 PM', isBooked: false },
            ],
          },
          {
            day: 'Saturday',
            slots: [
              { startTime: '09:00 AM', endTime: '10:00 AM', isBooked: false },
              { startTime: '10:00 AM', endTime: '11:00 AM', isBooked: false },
              { startTime: '11:00 AM', endTime: '12:00 PM', isBooked: false },
            ],
          },
        ],
      });

      console.log(`✅ Created doctor: ${doctorData.name}`);
    }

    console.log('\n🎉 Database seeded successfully with Pakistani doctors!');
    console.log('\n📋 Sample Doctor Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    pakistaniDoctors.forEach((doc) => {
      console.log(`👨‍⚕️  ${doc.name} (${doc.specialization})`);
      console.log(`   📧 Email: ${doc.email}`);
      console.log(`   🔑 Password: doctor123`);
      console.log(`   💰 Fee: Rs. ${doc.consultationFee}`);
      console.log('');
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 You can now login with any of these credentials!');
    console.log('🚀 Start the servers: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
