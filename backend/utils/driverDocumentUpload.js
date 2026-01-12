const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for Driver Documents
const driverDocumentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chalo-sawari/driver-documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit' }, // Resize images for documents
      { quality: 'auto:good' } // Optimize quality
    ]
  }
});

// Configure Multer for driver document uploads
const uploadDriverDocument = multer({
  storage: driverDocumentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for documents
    files: 1 // Single file upload
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed for documents!'));
    }
  }
});

// Middleware for single document upload
const uploadSingleDocument = uploadDriverDocument.single('document');

// Add error handling wrapper for document upload
const uploadDocumentWithErrorHandling = (req, res, next) => {
  uploadSingleDocument(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 10MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      console.log('Other upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }
    next();
  });
};

// Configure Cloudinary storage for Profile Photos
const profilePhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chalo-sawari/profile-photos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Square profile photos
      { quality: 'auto:good' } // Optimize quality
    ]
  }
});

// Configure Multer for profile photo uploads
const uploadProfilePhotoMulter = multer({
  storage: profilePhotoStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile photos
    files: 1 // Single file upload
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile photos!'));
    }
  }
});

// Middleware for profile photo upload
const uploadProfilePhotoMiddleware = uploadProfilePhotoMulter.single('photo');

// Add error handling wrapper for profile photo upload
const uploadProfilePhotoWithErrorHandling = (req, res, next) => {
  uploadProfilePhotoMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log('Profile photo Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB for profile photos.'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      console.log('Profile photo upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Profile photo upload failed'
      });
    }
    next();
  });
};

// Function to delete document from Cloudinary
const deleteDocument = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting document from Cloudinary:', error);
    throw error;
  }
};

// Function to get document URL from Cloudinary public ID
const getDocumentUrl = (publicId) => {
  if (publicId) {
    return cloudinary.url(publicId, {
      secure: true,
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });
  }
  return null;
};

// Function to generate thumbnail for documents
const generateDocumentThumbnail = async (imageUrl, width = 300, height = 200) => {
  try {
    const publicId = imageUrl.split('/').pop().split('.')[0];
    const thumbnailUrl = cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto:good'
    });
    return thumbnailUrl;
  } catch (error) {
    console.error('Error generating document thumbnail:', error);
    return imageUrl; // Return original URL if thumbnail generation fails
  }
};

module.exports = {
  uploadDocumentWithErrorHandling,
  uploadProfilePhotoWithErrorHandling,
  deleteDocument,
  getDocumentUrl,
  generateDocumentThumbnail
};
