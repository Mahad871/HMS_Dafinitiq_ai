import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate as any, getNotifications as any);
router.put('/:notificationId/read', authenticate as any, markAsRead as any);
router.put('/read-all', authenticate as any, markAllAsRead as any);
router.delete('/:notificationId', authenticate as any, deleteNotification as any);

export default router;
