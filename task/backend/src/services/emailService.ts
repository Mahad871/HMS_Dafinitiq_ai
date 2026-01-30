import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const emailService = {
  sendAppointmentBookedEmail: async (
    patientEmail: string,
    doctorEmail: string,
    appointmentDetails: any
  ) => {
    const patientMailOptions = {
      from: process.env.EMAIL_USER,
      to: patientEmail,
      subject: 'Appointment Booked Successfully',
      html: `
        <h1>Appointment Confirmation</h1>
        <p>Your appointment has been booked successfully!</p>
        <p><strong>Doctor:</strong> ${appointmentDetails.doctorName}</p>
        <p><strong>Date:</strong> ${appointmentDetails.date}</p>
        <p><strong>Time:</strong> ${appointmentDetails.timeSlot}</p>
        <p><strong>Status:</strong> Pending Confirmation</p>
      `,
    };

    const doctorMailOptions = {
      from: process.env.EMAIL_USER,
      to: doctorEmail,
      subject: 'New Appointment Request',
      html: `
        <h1>New Appointment Request</h1>
        <p>You have a new appointment request!</p>
        <p><strong>Patient:</strong> ${appointmentDetails.patientName}</p>
        <p><strong>Date:</strong> ${appointmentDetails.date}</p>
        <p><strong>Time:</strong> ${appointmentDetails.timeSlot}</p>
        <p><strong>Reason:</strong> ${appointmentDetails.reason}</p>
      `,
    };

    await transporter.sendMail(patientMailOptions);
    await transporter.sendMail(doctorMailOptions);
  },

  sendAppointmentConfirmedEmail: async (
    patientEmail: string,
    appointmentDetails: any
  ) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patientEmail,
      subject: 'Appointment Confirmed',
      html: `
        <h1>Appointment Confirmed!</h1>
        <p>Your appointment has been confirmed by the doctor.</p>
        <p><strong>Doctor:</strong> ${appointmentDetails.doctorName}</p>
        <p><strong>Date:</strong> ${appointmentDetails.date}</p>
        <p><strong>Time:</strong> ${appointmentDetails.timeSlot}</p>
        <p>Please arrive 10 minutes early.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  },

  sendAppointmentCancelledEmail: async (
    email: string,
    appointmentDetails: any
  ) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Cancelled',
      html: `
        <h1>Appointment Cancelled</h1>
        <p>Your appointment has been cancelled.</p>
        <p><strong>Date:</strong> ${appointmentDetails.date}</p>
        <p><strong>Time:</strong> ${appointmentDetails.timeSlot}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  },
};
