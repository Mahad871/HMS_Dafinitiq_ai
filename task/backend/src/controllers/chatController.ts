import { Response } from 'express';
import Chat from '../models/Chat';
import { AuthRequest } from '../types';

export const getChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: any = {
      $or: [{ patient: req.user?._id }, { doctor: req.user?._id }],
    };

    const chats = await Chat.find(query)
      .populate('patient', 'name avatar')
      .populate('doctor', 'name avatar')
      .sort({ lastMessageTime: -1 });

    res.json({ chats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getChatById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('patient', 'name avatar')
      .populate('doctor', 'name avatar');

    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    // Verify user is part of this chat
    const isParticipant =
      chat.patient._id.toString() === req.user?._id ||
      chat.doctor._id.toString() === req.user?._id;

    if (!isParticipant) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.json({ chat });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { content, attachments } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    const message = {
      sender: req.user?._id!,
      content,
      timestamp: new Date(),
      read: false,
      attachments: attachments || [],
    };

    chat.messages.push(message as any);
    chat.lastMessage = content;
    chat.lastMessageTime = new Date();

    // Update unread count
    if (req.user?._id === chat.patient.toString()) {
      chat.unreadCount.doctor += 1;
    } else {
      chat.unreadCount.patient += 1;
    }

    await chat.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    const recipientId = req.user?._id === chat.patient.toString() 
      ? chat.doctor.toString() 
      : chat.patient.toString();
    
    io.to(recipientId).emit('new-message', {
      chatId: chat._id,
      message,
    });

    res.json({ message: 'Message sent', chat });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const markMessagesAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    // Mark messages as read
    chat.messages.forEach((msg: any) => {
      if (msg.sender.toString() !== req.user?._id) {
        msg.read = true;
      }
    });

    // Reset unread count
    if (req.user?._id === chat.patient.toString()) {
      chat.unreadCount.patient = 0;
    } else {
      chat.unreadCount.doctor = 0;
    }

    await chat.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { doctorId, appointmentId } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      patient: req.user?._id,
      doctor: doctorId,
    });

    if (chat) {
      res.json({ chat });
      return;
    }

    // Create new chat
    chat = await Chat.create({
      patient: req.user?._id,
      doctor: doctorId,
      appointment: appointmentId,
      messages: [],
      unreadCount: { patient: 0, doctor: 0 },
    });

    res.status(201).json({ message: 'Chat created', chat });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
