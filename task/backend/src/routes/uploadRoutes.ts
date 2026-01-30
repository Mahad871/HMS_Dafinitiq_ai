import express from 'express';
import {
  uploadProfilePicture as uploadProfilePictureController,
  uploadMedicalDocument,
  uploadMultipleFiles as uploadMultipleFilesController,
  deleteFile,
} from '../controllers/uploadController';
import {
  uploadProfilePicture,
  uploadSingleDocument,
  uploadMultipleFiles,
} from '../middleware/upload';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Upload profile picture
router.post('/profile-picture', authenticate as any, uploadProfilePicture, uploadProfilePictureController as any);

// Upload medical document
router.post('/medical-document', authenticate as any, uploadSingleDocument, uploadMedicalDocument as any);

// Upload multiple files
router.post('/multiple', authenticate as any, uploadMultipleFiles, uploadMultipleFilesController as any);

// Delete file
router.delete('/file', authenticate as any, deleteFile as any);

export default router;
