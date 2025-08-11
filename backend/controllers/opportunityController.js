const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// Create opportunity
const createOpportunity = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      type,
      category,
      requirements,
      skills,
      salary,
      duration,
      applicationDeadline,
      startDate,
      tags
    } = req.body;

    const createdBy = req.user._id;

    // Validate required fields
    if (!title || !description || !company || !location || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, company, location, type, and category are required'
      });
    }

    // Validate dates
    if (applicationDeadline && new Date(applicationDeadline) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline must be in the future'
      });
    }

    if (startDate && applicationDeadline && new Date(startDate) <= new Date(applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be after application deadline'
      });
    }

    // Handle photo upload if provided
    let photoUrl = null;
    let cloudinaryPublicId = null;

    if (req.file) {
      try {
        const uploadOptions = cloudinary.getUploadOptions(req.file.mimetype);
        const result = await cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              throw new Error(`Cloudinary upload failed: ${error.message}`);
            }
            photoUrl = result.secure_url;
            cloudinaryPublicId = result.public_id;
          }
        );

        // Convert buffer to stream for Cloudinary
        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(result);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Error uploading photo',
          error: uploadError.message
        });
      }
    }

    // Create opportunity
    const opportunityData = {
      title,
      description,
      company,
      location,
      type,
      category,
      requirements: requirements ? requirements.split(',').map(req => req.trim()) : [],
      skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
      salary,
      duration,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      startDate: startDate ? new Date(startDate) : null,
      photoUrl,
      cloudinaryPublicId,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      createdBy,
      isActive: true,
      isFeatured: false
    };

    const opportunity = new Opportunity(opportunityData);
    await opportunity.save();

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
      data: {
        id: opportunity._id,
        title: opportunity.title,
        company: opportunity.company,
        location: opportunity.location,
        type: opportunity.type,
        category: opportunity.category,
        applicationDeadline: opportunity.applicationDeadline,
        createdAt: opportunity.createdAt
      }
    });

  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all opportunities (with filtering and pagination)
const getAllOpportunities = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      location,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      activeOnly = true
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (activeOnly === 'true') filter.isActive = true;
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const opportunities = await Opportunity.find(filter)
      .populate('createdBy', 'name email branch')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Opportunity.countDocuments(filter);

    res.json({
      success: true,
      data: opportunities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get opportunity by ID
const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const opportunity = await Opportunity.findById(id)
      .populate('createdBy', 'name email branch')
      .select('-__v');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Increment view count
    opportunity.views += 1;
    await opportunity.save();

    res.json({
      success: true,
      data: opportunity
    });

  } catch (error) {
    console.error('Get opportunity by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Apply for opportunity
const applyForOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { coverLetter, resumeUrl } = req.body;
    const userId = req.user._id;

    const opportunity = await Opportunity.findById(id);
    
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    if (!opportunity.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This opportunity is no longer active'
      });
    }

    // Check if application deadline has passed
    if (opportunity.applicationDeadline && new Date() > opportunity.applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if user has already applied
    const existingApplication = opportunity.applications.find(
      app => app.applicant.toString() === userId.toString()
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this opportunity'
      });
    }

    // Add application
    const application = {
      applicant: userId,
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl || '',
      appliedAt: new Date(),
      status: 'pending'
    };

    opportunity.applications.push(application);
    await opportunity.save();

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        opportunityId: opportunity._id,
        opportunityTitle: opportunity.title,
        appliedAt: application.appliedAt,
        status: application.status
      }
    });

  } catch (error) {
    console.error('Apply for opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update opportunity
const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user._id;

    const opportunity = await Opportunity.findById(id);
    
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if user can edit this opportunity
    if (opportunity.createdBy.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit opportunities you created'
      });
    }

    // Handle photo update if provided
    if (req.file) {
      try {
        // Delete old photo from Cloudinary if it exists
        if (opportunity.cloudinaryPublicId) {
          await cloudinary.uploader.destroy(opportunity.cloudinaryPublicId);
        }

        // Upload new photo
        const uploadOptions = cloudinary.getUploadOptions(req.file.mimetype);
        const result = await cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              throw new Error(`Cloudinary upload failed: ${error.message}`);
            }
            updateData.photoUrl = result.secure_url;
            updateData.cloudinaryPublicId = result.public_id;
          }
        );

        // Convert buffer to stream for Cloudinary
        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(result);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Error updating photo',
          error: uploadError.message
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'applications' && key !== 'views') {
        opportunity[key] = updateData[key];
      }
    });

    await opportunity.save();

    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      data: {
        id: opportunity._id,
        title: opportunity.title,
        updatedAt: opportunity.updatedAt
      }
    });

  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete opportunity
const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const opportunity = await Opportunity.findById(id);
    
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if user can delete this opportunity
    if (opportunity.createdBy.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete opportunities you created'
      });
    }

    // Delete photo from Cloudinary if it exists
    if (opportunity.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(opportunity.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    await Opportunity.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });

  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Toggle opportunity status (active/inactive)
const toggleOpportunityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const opportunity = await Opportunity.findById(id);
    
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if user can modify this opportunity
    if (opportunity.createdBy.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only modify opportunities you created'
      });
    }

    opportunity.isActive = !opportunity.isActive;
    await opportunity.save();

    res.json({
      success: true,
      message: `Opportunity ${opportunity.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: opportunity._id,
        title: opportunity.title,
        isActive: opportunity.isActive
      }
    });

  } catch (error) {
    console.error('Toggle opportunity status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get opportunity statistics
const getOpportunityStats = async (req, res) => {
  try {
    const stats = await Opportunity.aggregate([
      {
        $group: {
          _id: null,
          totalOpportunities: { $sum: 1 },
          activeOpportunities: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          totalApplications: {
            $sum: { $size: '$applications' }
          },
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    const typeStats = await Opportunity.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const categoryStats = await Opportunity.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalOpportunities: 0,
          activeOpportunities: 0,
          totalApplications: 0,
          totalViews: 0
        },
        typeBreakdown: typeStats,
        categoryBreakdown: categoryStats
      }
    });

  } catch (error) {
    console.error('Get opportunity stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  applyForOpportunity,
  updateOpportunity,
  deleteOpportunity,
  toggleOpportunityStatus,
  getOpportunityStats
};
