const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticateToken } = require('../middleware/auth');

// Public search routes (no authentication required)
router.get('/suggestions', searchController.getSearchSuggestions);
router.get('/content', searchController.searchContent);
router.get('/opportunities', searchController.searchOpportunities);

// Protected search routes (authentication required)
router.get('/global', authenticateToken, searchController.globalSearch);
router.get('/analytics', authenticateToken, searchController.getSearchAnalytics);

module.exports = router;
