import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageDocument {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: string[];
}

export interface IChatDocument extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  messages: IMessageDocument[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: {
    patient: number;
    doctor: number;
  };
}

const chatSchema = new Schema<IChatDocument>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    messages: [
      {
        sender: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
        attachments: [String],
      },
    ],
    lastMessage: String,
    lastMessageTime: Date,
    unreadCount: {
      patient: { type: Number, default: 0 },
      doctor: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ patient: 1, doctor: 1 });

export default mongoose.model<IChatDocument>('Chat', chatSchema);
