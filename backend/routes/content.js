const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { uploadContent, handleUploadError } = require('../middleware/upload');

// Public routes (for viewing approved content)
router.get('/', contentController.getAllContent);
router.get('/:id', contentController.getContentById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Content upload (users and admins)
router.post('/upload', uploadContent, handleUploadError, contentController.uploadContent);

// Content management (users can edit/delete their own content, admins can manage all)
router.put('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

// Admin-only routes
router.put('/:id/approve', isAdmin, contentController.approveContent);
router.put('/:id/reject', isAdmin, contentController.rejectContent);
router.get('/stats/overview', isAdmin, contentController.getContentStats);

module.exports = router;
