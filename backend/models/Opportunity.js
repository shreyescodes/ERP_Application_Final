const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
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
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  
  type: {
    type: String,
    required: [true, 'Opportunity type is required'],
    enum: ['internship', 'full-time', 'part-time', 'freelance', 'volunteer'],
    default: 'internship'
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['technical', 'non-technical', 'research', 'design', 'marketing', 'other'],
    default: 'technical'
  },
  
  requirements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Requirement cannot exceed 200 characters']
  }],
  
  skills: [{
    type: String,
    trim: true,
    maxlength: [100, 'Skill cannot exceed 100 characters']
  }],
  
  salary: {
    min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'INR', 'GBP']
    },
    period: {
      type: String,
      default: 'monthly',
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly']
    }
  },
  
  duration: {
    type: String,
    trim: true,
    maxlength: [100, 'Duration cannot exceed 100 characters']
  },
  
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  
  photoUrl: {
    type: String,
    default: null
  },
  
  cloudinaryPublicId: {
    type: String,
    default: null
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator information is required']
  },
  
  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending'
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
    },
    resumeUrl: {
      type: String,
      trim: true
    }
  }],
  
  views: {
    type: Number,
    default: 0
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for days until deadline
opportunitySchema.virtual('daysUntilDeadline').get(function() {
  const now = new Date();
  const deadline = this.applicationDeadline;
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day left';
  return `${diffDays} days left`;
});

// Virtual for isExpired
opportunitySchema.virtual('isExpired').get(function() {
  return new Date() > this.applicationDeadline;
});

// Virtual for isUrgent (less than 7 days left)
opportunitySchema.virtual('isUrgent').get(function() {
  const now = new Date();
  const deadline = this.applicationDeadline;
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7 && diffDays >= 0;
});

// Virtual for application count
opportunitySchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

// Indexes for better query performance
opportunitySchema.index({ isActive: 1, type: 1, category: 1, createdAt: -1 });
opportunitySchema.index({ applicationDeadline: 1, isActive: 1 });
opportunitySchema.index({ createdBy: 1, isActive: 1 });
opportunitySchema.index({ title: 'text', description: 'text', company: 'text', skills: 'text' });
opportunitySchema.index({ isFeatured: 1, isActive: 1, createdAt: -1 });

// Pre-save middleware to check if deadline is in the future
opportunitySchema.pre('save', function(next) {
  if (this.applicationDeadline <= new Date()) {
    this.isActive = false;
  }
  next();
});

// Static method to find active opportunities
opportunitySchema.statics.findActive = function() {
  return this.find({ isActive: true, applicationDeadline: { $gt: new Date() } });
};

// Static method to find opportunities by type
opportunitySchema.statics.findByType = function(type) {
  return this.find({ type, isActive: true, applicationDeadline: { $gt: new Date() } });
};

// Static method to find opportunities by category
opportunitySchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true, applicationDeadline: { $gt: new Date() } });
};

// Static method to find featured opportunities
opportunitySchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isActive: true, applicationDeadline: { $gt: new Date() } });
};

// Static method to find urgent opportunities
opportunitySchema.statics.findUrgent = function() {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  return this.find({
    isActive: true,
    applicationDeadline: { $gt: new Date(), $lte: sevenDaysFromNow }
  });
};

// Instance method to increment views
opportunitySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to add application
opportunitySchema.methods.addApplication = function(applicantId, coverLetter, resumeUrl) {
  const application = {
    applicant: applicantId,
    coverLetter,
    resumeUrl,
    appliedAt: new Date()
  };
  
  this.applications.push(application);
  return this.save();
};

// Instance method to update application status
opportunitySchema.methods.updateApplicationStatus = function(applicantId, status) {
  const application = this.applications.find(app => app.applicant.toString() === applicantId.toString());
  if (application) {
    application.status = status;
    return this.save();
  }
  throw new Error('Application not found');
};

module.exports = mongoose.model('Opportunity', opportunitySchema);
