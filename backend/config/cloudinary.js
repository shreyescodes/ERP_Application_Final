const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload options for different content types
const uploadOptions = {
  // Video upload options
  video: {
    resource_type: 'video',
    chunk_size: 6000000, // 6MB chunks
    eager: [
      { width: 1280, height: 720, crop: 'scale', quality: 'auto' },
      { width: 854, height: 480, crop: 'scale', quality: 'auto' }
    ],
    eager_async: true,
    eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL || null
  },
  
  // Image upload options
  image: {
    resource_type: 'image',
    transformation: [
      { width: 1920, height: 1080, crop: 'limit', quality: 'auto' },
      { width: 1280, height: 720, crop: 'limit', quality: 'auto' }
    ]
  },
  
  // Document upload options
  document: {
    resource_type: 'raw',
    format: 'pdf,doc,docx,txt'
  }
};

// Helper function to get upload options based on file type
const getUploadOptions = (fileType) => {
  if (fileType.startsWith('video/')) {
    return uploadOptions.video;
  } else if (fileType.startsWith('image/')) {
    return uploadOptions.image;
  } else {
    return uploadOptions.document;
  }
};

// Helper function to generate optimized URLs
const getOptimizedUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  };
  
  return cloudinary.url(publicId, defaultOptions);
};

module.exports = {
  cloudinary,
  uploadOptions,
  getUploadOptions,
  getOptimizedUrl
};
