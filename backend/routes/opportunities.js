const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { uploadImage, handleUploadError } = require('../middleware/upload');

// Public routes (for viewing opportunities)
router.get('/', opportunityController.getAllOpportunities);
router.get('/:id', opportunityController.getOpportunityById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Opportunity creation (users and admins)
router.post('/', uploadImage, handleUploadError, opportunityController.createOpportunity);

// Opportunity applications (users can apply)
router.post('/:id/apply', opportunityController.applyForOpportunity);

// Opportunity management (users can edit/delete their own, admins can manage all)
router.put('/:id', uploadImage, handleUploadError, opportunityController.updateOpportunity);
router.delete('/:id', opportunityController.deleteOpportunity);

// Toggle opportunity status
router.patch('/:id/toggle-status', opportunityController.toggleOpportunityStatus);

// Admin-only routes
router.get('/stats/overview', isAdmin, opportunityController.getOpportunityStats);

module.exports = router;
