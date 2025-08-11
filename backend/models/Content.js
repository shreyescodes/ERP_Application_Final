const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
    trim: true
  },
  
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['image', 'video', 'document', 'audio'],
    default: 'document'
  },
  
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  
  cloudinaryPublicId: {
    type: String,
    required: [true, 'Cloudinary public ID is required']
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['academic', 'cultural', 'sports', 'technical', 'general', 'announcement'],
    default: 'general'
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader information is required']
  },
  
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  approvedAt: {
    type: Date,
    default: null
  },
  
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    default: null
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  downloads: {
    type: Number,
    default: 0
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  expiryDate: {
    type: Date,
    default: null
  },
  
  metadata: {
    duration: Number, // For videos/audio
    dimensions: {
      width: Number,
      height: Number
    }, // For images/videos
    format: String,
    resolution: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for content age
contentSchema.virtual('age').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Virtual for approval status
contentSchema.virtual('isApproved').get(function() {
  return this.status === 'approved';
});

// Virtual for isExpired
contentSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Indexes for better query performance
contentSchema.index({ status: 1, category: 1, createdAt: -1 });
contentSchema.index({ uploadedBy: 1, status: 1 });
contentSchema.index({ title: 'text', description: 'text', tags: 'text' });
contentSchema.index({ isFeatured: 1, status: 1, createdAt: -1 });

// Pre-save middleware to update approvedAt when status changes to approved
contentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'approved' && !this.approvedAt) {
    this.approvedAt = new Date();
  }
  next();
});

// Static method to find approved content
contentSchema.statics.findApproved = function() {
  return this.find({ status: 'approved' });
};

// Static method to find pending content
contentSchema.statics.findPending = function() {
  return this.find({ status: 'pending' });
};

// Static method to find content by category
contentSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'approved' });
};

// Static method to find featured content
contentSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, status: 'approved' });
};

// Instance method to increment views
contentSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to increment downloads
contentSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

// Instance method to approve content
contentSchema.methods.approve = function(adminId) {
  this.status = 'approved';
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  this.rejectionReason = null;
  return this.save();
};

// Instance method to reject content
contentSchema.methods.reject = function(adminId, reason) {
  this.status = 'rejected';
  this.approvedBy = adminId;
  this.rejectionReason = reason;
  return this.save();
};

module.exports = mongoose.model('Content', contentSchema);
