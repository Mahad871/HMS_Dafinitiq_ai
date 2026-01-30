import express from 'express';
import {
  getChats,
  getChatById,
  sendMessage,
  markMessagesAsRead,
  createChat,
} from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate as any, getChats as any);
router.post('/', authenticate as any, createChat as any);
router.get('/:chatId', authenticate as any, getChatById as any);
router.post('/:chatId/messages', authenticate as any, sendMessage as any);
router.put('/:chatId/read', authenticate as any, markMessagesAsRead as any);

export default router;
