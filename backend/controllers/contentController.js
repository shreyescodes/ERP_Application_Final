const Content = require('../models/Content');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { generateUniqueFilename, getFileTypeCategory } = require('../middleware/upload');

// Upload content
const uploadContent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { title, description, category, tags } = req.body;
    const uploadedBy = req.user._id;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    // Upload file to Cloudinary
    const uploadOptions = cloudinary.getUploadOptions(req.file.mimetype);
    const result = await cloudinary.uploader.upload_stream(
      uploadOptions,
      async (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Error uploading file to Cloudinary',
            error: error.message
          });
        }

        // Create content document
        const contentData = {
          title,
          description,
          fileUrl: result.secure_url,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
          cloudinaryPublicId: result.public_id,
          category,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          uploadedBy,
          status: req.user.role === 'admin' ? 'approved' : 'pending',
          approvedBy: req.user.role === 'admin' ? req.user._id : null,
          approvedAt: req.user.role === 'admin' ? new Date() : null
        };

        const content = new Content(contentData);
        await content.save();

        res.status(201).json({
          success: true,
          message: 'Content uploaded successfully',
          data: {
            id: content._id,
            title: content.title,
            status: content.status,
            fileUrl: content.fileUrl,
            uploadedAt: content.createdAt
          }
        });
      }
    );

    // Convert buffer to stream for Cloudinary
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(result);

  } catch (error) {
    console.error('Content upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all content (with filtering and pagination)
const getAllContent = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const content = await Content.find(filter)
      .populate('uploadedBy', 'name email branch')
      .populate('approvedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Content.countDocuments(filter);

    res.json({
      success: true,
      data: content,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get content by ID
const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await Content.findById(id)
      .populate('uploadedBy', 'name email branch')
      .populate('approvedBy', 'name email')
      .select('-__v');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Increment view count
    content.views += 1;
    await content.save();

    res.json({
      success: true,
      data: content
    });

  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Approve content (admin only)
const approveContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const approvedBy = req.user._id;

    const content = await Content.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    if (content.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Content is already approved'
      });
    }

    // Update content status
    content.status = 'approved';
    content.approvedBy = approvedBy;
    content.approvedAt = new Date();
    content.rejectionReason = undefined;

    await content.save();

    res.json({
      success: true,
      message: 'Content approved successfully',
      data: {
        id: content._id,
        title: content.title,
        status: content.status,
        approvedAt: content.approvedAt
      }
    });

  } catch (error) {
    console.error('Approve content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Reject content (admin only)
const rejectContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const content = await Content.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    if (content.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Content is already rejected'
      });
    }

    // Update content status
    content.status = 'rejected';
    content.rejectionReason = rejectionReason;
    content.approvedBy = undefined;
    content.approvedAt = undefined;

    await content.save();

    res.json({
      success: true,
      message: 'Content rejected successfully',
      data: {
        id: content._id,
        title: content.title,
        status: content.status,
        rejectionReason: content.rejectionReason
      }
    });

  } catch (error) {
    console.error('Reject content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update content
const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags } = req.body;
    const userId = req.user._id;

    const content = await Content.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check if user can edit this content
    if (content.uploadedBy.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own content'
      });
    }

    // Update fields
    if (title) content.title = title;
    if (description) content.description = description;
    if (category) content.category = category;
    if (tags) content.tags = tags.split(',').map(tag => tag.trim());

    // Reset approval status if content is modified
    if (req.user.role !== 'admin') {
      content.status = 'pending';
      content.approvedBy = undefined;
      content.approvedAt = undefined;
      content.rejectionReason = undefined;
    }

    await content.save();

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: {
        id: content._id,
        title: content.title,
        status: content.status,
        updatedAt: content.updatedAt
      }
    });

  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete content
const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const content = await Content.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check if user can delete this content
    if (content.uploadedBy.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own content'
      });
    }

    // Delete from Cloudinary if public ID exists
    if (content.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(content.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    await Content.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get content statistics
const getContentStats = async (req, res) => {
  try {
    const stats = await Content.aggregate([
      {
        $group: {
          _id: null,
          totalContent: { $sum: 1 },
          pendingContent: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          approvedContent: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          rejectedContent: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          totalViews: { $sum: '$views' },
          totalDownloads: { $sum: '$downloads' }
        }
      }
    ]);

    const categoryStats = await Content.aggregate([
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
          totalContent: 0,
          pendingContent: 0,
          approvedContent: 0,
          rejectedContent: 0,
          totalViews: 0,
          totalDownloads: 0
        },
        categoryBreakdown: categoryStats
      }
    });

  } catch (error) {
    console.error('Get content stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  uploadContent,
  getAllContent,
  getContentById,
  approveContent,
  rejectContent,
  updateContent,
  deleteContent,
  getContentStats
};
