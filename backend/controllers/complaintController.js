const Complaint = require('../models/Complaint');
const { validationResult } = require('express-validator');

// Create a new complaint
const createComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      subject,
      message,
      category,
      priority,
      isAnonymous,
      isUrgent,
      tags
    } = req.body;

    // Create complaint object
    const complaintData = {
      subject,
      message,
      category,
      priority,
      isAnonymous: isAnonymous || false,
      isUrgent: isUrgent || priority === 'urgent',
      tags: tags || [],
      submittedBy: req.user._id,
      status: 'open'
    };

    // If urgent, set higher priority
    if (isUrgent && priority !== 'urgent') {
      complaintData.priority = 'urgent';
    }

    const complaint = new Complaint(complaintData);
    await complaint.save();

    // Populate user details for response
    await complaint.populate('submittedBy', 'name email branch USN');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit complaint',
      error: error.message
    });
  }
};

// Get all complaints (with filtering and pagination)
const getAllComplaints = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    
    // Search filter
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // If user is not admin, only show their complaints
    if (req.user.role !== 'admin') {
      filter.submittedBy = req.user._id;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const complaints = await Complaint.find(filter)
      .populate('submittedBy', 'name email branch USN')
      .populate('assignedTo', 'name email')
      .populate('resolvedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: error.message
    });
  }
};

// Get complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const complaint = await Complaint.findById(id)
      .populate('submittedBy', 'name email branch USN')
      .populate('assignedTo', 'name email')
      .populate('resolvedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user can access this complaint
    if (req.user.role !== 'admin' && complaint.submittedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint',
      error: error.message
    });
  }
};

// Update complaint
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user can edit this complaint
    if (req.user.role !== 'admin' && complaint.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only allow editing if complaint is still open
    if (complaint.status !== 'open' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit complaint that is no longer open'
      });
    }

    const updateData = { ...req.body };
    
    // If user is not admin, reset status to open
    if (req.user.role !== 'admin') {
      updateData.status = 'open';
      delete updateData.assignedTo;
      delete updateData.resolvedBy;
      delete updateData.resolution;
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('submittedBy', 'name email branch USN');

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      data: updatedComplaint
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint',
      error: error.message
    });
  }
};

// Delete complaint
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user can delete this complaint
    if (req.user.role !== 'admin' && complaint.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only allow deletion if complaint is open or user is admin
    if (complaint.status !== 'open' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete complaint that is no longer open'
      });
    }

    await Complaint.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete complaint',
      error: error.message
    });
  }
};

// Admin: Assign complaint to staff member
const assignComplaint = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { id } = req.params;
    const { assignedTo, estimatedResolutionTime } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.assignedTo = assignedTo;
    complaint.status = 'assigned';
    complaint.assignedAt = new Date();
    if (estimatedResolutionTime) {
      complaint.estimatedResolutionTime = estimatedResolutionTime;
    }

    await complaint.save();

    await complaint.populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Complaint assigned successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Error assigning complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign complaint',
      error: error.message
    });
  }
};

// Admin: Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { id } = req.params;
    const { status, resolution, followUpRequired, followUpDate } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.status = status;
    
    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
      complaint.resolvedBy = req.user._id;
      if (resolution) complaint.resolution = resolution;
    } else if (status === 'closed') {
      complaint.closedAt = new Date();
    }

    if (followUpRequired !== undefined) {
      complaint.followUpRequired = followUpRequired;
      if (followUpDate) complaint.followUpDate = followUpDate;
    }

    await complaint.save();

    await complaint.populate('resolvedBy', 'name email');

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint status',
      error: error.message
    });
  }
};

// Get complaint statistics
const getComplaintStats = async (req, res) => {
  try {
    let filter = {};
    
    // If user is not admin, only show their complaints
    if (req.user.role !== 'admin') {
      filter.submittedBy = req.user._id;
    }

    const stats = await Complaint.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          assigned: { $sum: { $cond: [{ $eq: ['$status', 'assigned'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
          urgent: { $sum: { $cond: ['$isUrgent', 1, 0] } }
        }
      }
    ]);

    const categoryStats = await Complaint.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const priorityStats = await Complaint.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const response = {
      success: true,
      data: {
        overview: stats[0] || {
          total: 0,
          open: 0,
          assigned: 0,
          inProgress: 0,
          resolved: 0,
          closed: 0,
          urgent: 0
        },
        byCategory: categoryStats,
        byPriority: priorityStats
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint statistics',
      error: error.message
    });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  assignComplaint,
  updateComplaintStatus,
  getComplaintStats
};
