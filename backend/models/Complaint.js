const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['academic', 'technical', 'facility', 'administrative', 'other'],
    default: 'other'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Submitter information is required']
  },
  
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  assignedAt: {
    type: Date,
    default: null
  },
  
  resolvedAt: {
    type: Date,
    default: null
  },
  
  closedAt: {
    type: Date,
    default: null
  },
  
  resolution: {
    type: String,
    trim: true,
    maxlength: [1000, 'Resolution cannot exceed 1000 characters'],
    default: null
  },
  
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  attachments: [{
    filename: String,
    url: String,
    cloudinaryPublicId: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  
  isAnonymous: {
    type: Boolean,
    default: false
  },
  
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  estimatedResolutionTime: {
    type: Number, // in days
    min: [1, 'Estimated resolution time must be at least 1 day'],
    default: 7
  },
  
  followUpRequired: {
    type: Boolean,
    default: false
  },
  
  followUpDate: {
    type: Date,
    default: null
  },
  
  satisfactionRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: null
  },
  
  feedback: {
    type: String,
    trim: true,
    maxlength: [500, 'Feedback cannot exceed 500 characters'],
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for complaint age
complaintSchema.virtual('age').get(function() {
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

// Virtual for time since assignment
complaintSchema.virtual('timeSinceAssignment').get(function() {
  if (!this.assignedAt) return null;
  
  const now = new Date();
  const assigned = this.assignedAt;
  const diffTime = Math.abs(now - assigned);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
});

// Virtual for isOverdue
complaintSchema.virtual('isOverdue').get(function() {
  if (this.status === 'resolved' || this.status === 'closed') return false;
  
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > this.estimatedResolutionTime;
});

// Virtual for daysUntilFollowUp
complaintSchema.virtual('daysUntilFollowUp').get(function() {
  if (!this.followUpDate) return null;
  
  const now = new Date();
  const followUp = this.followUpDate;
  const diffTime = followUp - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day left';
  return `${diffDays} days left`;
});

// Indexes for better query performance
complaintSchema.index({ status: 1, priority: 1, createdAt: -1 });
complaintSchema.index({ submittedBy: 1, status: 1 });
complaintSchema.index({ assignedTo: 1, status: 1 });
complaintSchema.index({ category: 1, status: 1 });
complaintSchema.index({ isUrgent: 1, status: 1, createdAt: -1 });
complaintSchema.index({ followUpDate: 1, status: 1 });
complaintSchema.index({ subject: 'text', message: 'text', tags: 'text' });

// Pre-save middleware to update timestamps
complaintSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date();
    } else if (this.status === 'closed' && !this.closedAt) {
      this.closedAt = new Date();
    }
  }
  
  if (this.isModified('assignedTo') && this.assignedTo && !this.assignedAt) {
    this.assignedAt = new Date();
  }
  
  next();
});

// Static method to find open complaints
complaintSchema.statics.findOpen = function() {
  return this.find({ status: { $in: ['open', 'in-progress'] } });
};

// Static method to find urgent complaints
complaintSchema.statics.findUrgent = function() {
  return this.find({ isUrgent: true, status: { $ne: 'closed' } });
};

// Static method to find overdue complaints
complaintSchema.statics.findOverdue = function() {
  const now = new Date();
  return this.find({
    status: { $in: ['open', 'in-progress'] },
    createdAt: { $lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
  });
};

// Static method to find complaints by category
complaintSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: { $ne: 'closed' } });
};

// Static method to find complaints by assignee
complaintSchema.statics.findByAssignee = function(assigneeId) {
  return this.find({ assignedTo: assigneeId, status: { $ne: 'closed' } });
};

// Instance method to assign complaint
complaintSchema.methods.assign = function(adminId) {
  this.assignedTo = adminId;
  this.assignedAt = new Date();
  this.status = 'in-progress';
  return this.save();
};

// Instance method to resolve complaint
complaintSchema.methods.resolve = function(adminId, resolution) {
  this.status = 'resolved';
  this.resolvedBy = adminId;
  this.resolution = resolution;
  this.resolvedAt = new Date();
  return this.save();
};

// Instance method to close complaint
complaintSchema.methods.close = function() {
  this.status = 'closed';
  this.closedAt = new Date();
  return this.save();
};

// Instance method to add attachment
complaintSchema.methods.addAttachment = function(filename, url, cloudinaryPublicId) {
  const attachment = {
    filename,
    url,
    cloudinaryPublicId,
    uploadedAt: new Date()
  };
  
  this.attachments.push(attachment);
  return this.save();
};

// Instance method to set follow-up
complaintSchema.methods.setFollowUp = function(date, required = true) {
  this.followUpDate = date;
  this.followUpRequired = required;
  return this.save();
};

module.exports = mongoose.model('Complaint', complaintSchema);
