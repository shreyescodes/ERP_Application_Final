const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { validateComplaint } = require('../middleware/validation');

// Public routes (none for complaints - all require authentication)

// Protected routes - require authentication
router.use(authenticateToken);

// GET /api/complaints - Get all complaints (filtered by user role)
router.get('/', complaintController.getAllComplaints);

// GET /api/complaints/stats - Get complaint statistics
router.get('/stats', complaintController.getComplaintStats);

// GET /api/complaints/:id - Get complaint by ID
router.get('/:id', complaintController.getComplaintById);

// POST /api/complaints - Create new complaint
router.post('/', validateComplaint, complaintController.createComplaint);

// PUT /api/complaints/:id - Update complaint
router.put('/:id', validateComplaint, complaintController.updateComplaint);

// DELETE /api/complaints/:id - Delete complaint
router.delete('/:id', complaintController.deleteComplaint);

// Admin-only routes
router.use(isAdmin);

// POST /api/complaints/:id/assign - Assign complaint to staff member
router.post('/:id/assign', complaintController.assignComplaint);

// PUT /api/complaints/:id/status - Update complaint status
router.put('/:id/status', complaintController.updateComplaintStatus);

module.exports = router;
