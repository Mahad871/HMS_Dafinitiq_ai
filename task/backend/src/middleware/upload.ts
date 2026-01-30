import multer from 'multer';

// Configure multer to use memory storage (files stored in memory as Buffer)
const storage = multer.memoryStorage();

// File filter to accept only images
const imageFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// File filter to accept images and PDFs
const documentFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument'];
  
  if (allowedTypes.some(type => file.mimetype.includes(type))) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and documents are allowed!'), false);
  }
};

// Upload middleware for single image
export const uploadSingleImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single('image');

// Upload middleware for single document
export const uploadSingleDocument = multer({
  storage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
}).single('document');

// Upload middleware for multiple files
export const uploadMultipleFiles = multer({
  storage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
}).array('files', 5); // Maximum 5 files

// Upload middleware for profile picture
export const uploadProfilePicture = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for profile pictures
  },
}).single('profilePicture');
