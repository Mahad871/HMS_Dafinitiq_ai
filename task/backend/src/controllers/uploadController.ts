import { Response } from 'express';
import { AuthRequest } from '../types';
import { s3Service } from '../services/s3Service';

export const uploadProfilePicture = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const imageUrl = await s3Service.uploadFile(req.file, `profile-pictures/${userId}`);

    res.json({
      message: 'Profile picture uploaded successfully',
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
};

export const uploadMedicalDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const documentUrl = await s3Service.uploadFile(req.file, `medical-documents/${userId}`);

    res.json({
      message: 'Medical document uploaded successfully',
      documentUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload medical document' });
  }
};

export const uploadMultipleFiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ message: 'No files uploaded' });
      return;
    }

    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const fileUrls = await s3Service.uploadMultipleFiles(req.files, `attachments/${userId}`);

    res.json({
      message: 'Files uploaded successfully',
      fileUrls,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload files' });
  }
};

export const deleteFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      res.status(400).json({ message: 'File URL is required' });
      return;
    }

    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const key = fileUrl.split('.amazonaws.com/')[1];
    if (!key || !key.includes(`/${userId}/`)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await s3Service.deleteFile(fileUrl);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete file' });
  }
};
