import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDocument extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'message' | 'system';
  read: boolean;
  link?: string;
}

const notificationSchema = new Schema<INotificationDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['appointment', 'reminder', 'message', 'system'],
      default: 'system',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, read: 1 });

export default mongoose.model<INotificationDocument>('Notification', notificationSchema);
