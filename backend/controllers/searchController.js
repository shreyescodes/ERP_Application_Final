const Content = require('../models/Content');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

const searchController = {
  // Global search across all content types
  async globalSearch(req, res) {
    try {
      const {
        query = '',
        type = 'all', // 'all', 'content', 'opportunities', 'users'
        category,
        status,
        fileType,
        location,
        opportunityType,
        role,
        branch,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      let results = {
        content: [],
        opportunities: [],
        users: [],
        totalResults: 0,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0
        }
      };

      // Build search query
      const searchQuery = query ? {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
          { category: { $regex: query, $options: 'i' } }
        ]
      } : {};

      // Search content
      if (type === 'all' || type === 'content') {
        const contentQuery = { ...searchQuery, status: 'approved' };
        
        if (category) contentQuery.category = category;
        if (fileType) contentQuery.fileType = { $regex: fileType, $options: 'i' };
        if (status) contentQuery.status = status;

        const contentResults = await Content.find(contentQuery)
          .populate('uploadedBy', 'name USN branch')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit));

        const contentTotal = await Content.countDocuments(contentQuery);
        
        results.content = contentResults;
        results.totalResults += contentTotal;
      }

      // Search opportunities
      if (type === 'all' || type === 'opportunities') {
        const opportunityQuery = { ...searchQuery, isActive: true };
        
        if (location) opportunityQuery.location = { $regex: location, $options: 'i' };
        if (opportunityType) opportunityQuery.type = opportunityType;
        if (category) opportunityQuery.category = category;

        const opportunityResults = await Opportunity.find(opportunityQuery)
          .populate('createdBy', 'name USN branch')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit));

        const opportunityTotal = await Opportunity.countDocuments(opportunityQuery);
        
        results.opportunities = opportunityResults;
        results.totalResults += opportunityTotal;
      }

      // Search users (admin only)
      if ((type === 'all' || type === 'users') && req.user?.role === 'admin') {
        const userQuery = {};
        
        if (query) {
          userQuery.$or = [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { USN: { $regex: query, $options: 'i' } }
          ];
        }
        
        if (role) userQuery.role = role;
        if (branch) userQuery.branch = branch;

        const userResults = await User.find(userQuery)
          .select('-password')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit));

        const userTotal = await User.countDocuments(userQuery);
        
        results.users = userResults;
        results.totalResults += userTotal;
      }

      // Calculate pagination
      const maxTotal = Math.max(
        results.content.length,
        results.opportunities.length,
        results.users.length
      );
      
      results.pagination.totalPages = Math.ceil(maxTotal / limit);

      res.json({
        success: true,
        data: results,
        message: 'Search completed successfully'
      });

    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        message: 'Search failed',
        error: error.message
      });
    }
  },

  // Advanced content search with filters
  async searchContent(req, res) {
    try {
      const {
        query = '',
        category,
        fileType,
        status = 'approved',
        uploadedBy,
        tags,
        dateFrom,
        dateTo,
        minSize,
        maxSize,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Build search query
      let searchQuery = {};

      // Text search
      if (query) {
        searchQuery.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ];
      }

      // Filters
      if (category) searchQuery.category = category;
      if (fileType) searchQuery.fileType = { $regex: fileType, $options: 'i' };
      if (status) searchQuery.status = status;
      if (uploadedBy) searchQuery.uploadedBy = uploadedBy;
      if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim());
        searchQuery.tags = { $in: tagArray };
      }

      // Date range
      if (dateFrom || dateTo) {
        searchQuery.createdAt = {};
        if (dateFrom) searchQuery.createdAt.$gte = new Date(dateFrom);
        if (dateTo) searchQuery.createdAt.$lte = new Date(dateTo);
      }

      // File size range
      if (minSize || maxSize) {
        searchQuery.fileSize = {};
        if (minSize) searchQuery.fileSize.$gte = parseInt(minSize);
        if (maxSize) searchQuery.fileSize.$lte = parseInt(maxSize);
      }

      // Execute search
      const content = await Content.find(searchQuery)
        .populate('uploadedBy', 'name USN branch')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Content.countDocuments(searchQuery);

      // Get unique values for filters
      const categories = await Content.distinct('category');
      const fileTypes = await Content.distinct('fileType');
      const allTags = await Content.distinct('tags');

      res.json({
        success: true,
        data: {
          content,
          total,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
          },
          filters: {
            categories,
            fileTypes,
            tags: allTags
          }
        },
        message: 'Content search completed successfully'
      });

    } catch (error) {
      console.error('Content search error:', error);
      res.status(500).json({
        success: false,
        message: 'Content search failed',
        error: error.message
      });
    }
  },

  // Advanced opportunity search
  async searchOpportunities(req, res) {
    try {
      const {
        query = '',
        category,
        type,
        location,
        company,
        minSalary,
        maxSalary,
        duration,
        skills,
        isActive = true,
        isFeatured,
        dateFrom,
        dateTo,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Build search query
      let searchQuery = {};

      // Text search
      if (query) {
        searchQuery.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { company: { $regex: query, $options: 'i' } },
          { requirements: { $regex: query, $options: 'i' } },
          { skills: { $in: [new RegExp(query, 'i')] } }
        ];
      }

      // Filters
      if (category) searchQuery.category = category;
      if (type) searchQuery.type = type;
      if (location) searchQuery.location = { $regex: location, $options: 'i' };
      if (company) searchQuery.company = { $regex: company, $options: 'i' };
      if (isActive !== undefined) searchQuery.isActive = isActive === 'true';
      if (isFeatured !== undefined) searchQuery.isFeatured = isFeatured === 'true';

      // Salary range
      if (minSalary || maxSalary) {
        searchQuery.salary = {};
        if (minSalary) searchQuery.salary.$gte = parseInt(minSalary);
        if (maxSalary) searchQuery.salary.$lte = parseInt(maxSalary);
      }

      // Duration filter
      if (duration) searchQuery.duration = duration;

      // Skills filter
      if (skills) {
        const skillArray = skills.split(',').map(skill => skill.trim());
        searchQuery.skills = { $in: skillArray };
      }

      // Date range
      if (dateFrom || dateTo) {
        searchQuery.createdAt = {};
        if (dateFrom) searchQuery.createdAt.$gte = new Date(dateFrom);
        if (dateTo) searchQuery.createdAt.$lte = new Date(dateTo);
      }

      // Execute search
      const opportunities = await Opportunity.find(searchQuery)
        .populate('createdBy', 'name USN branch')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Opportunity.countDocuments(searchQuery);

      // Get unique values for filters
      const categories = await Opportunity.distinct('category');
      const types = await Opportunity.distinct('type');
      const locations = await Opportunity.distinct('location');
      const companies = await Opportunity.distinct('company');
      const allSkills = await Opportunity.distinct('skills');

      res.json({
        success: true,
        data: {
          opportunities,
          total,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
          },
          filters: {
            categories,
            types,
            locations,
            companies,
            skills: allSkills
          }
        },
        message: 'Opportunity search completed successfully'
      });

    } catch (error) {
      console.error('Opportunity search error:', error);
      res.status(500).json({
        success: false,
        message: 'Opportunity search failed',
        error: error.message
      });
    }
  },

  // Get search suggestions/autocomplete
  async getSearchSuggestions(req, res) {
    try {
      const { query = '', type = 'all' } = req.query;

      if (!query || query.length < 2) {
        return res.json({
          success: true,
          data: { suggestions: [] }
        });
      }

      let suggestions = [];

      if (type === 'all' || type === 'content') {
        const contentSuggestions = await Content.aggregate([
          { $match: { status: 'approved' } },
          {
            $search: {
              autocomplete: {
                query,
                path: 'title',
                fuzzy: { maxEdits: 1 }
              }
            }
          },
          { $limit: 5 },
          { $project: { title: 1, category: 1, _id: 1 } }
        ]);
        suggestions.push(...contentSuggestions.map(item => ({
          ...item,
          type: 'content'
        })));
      }

      if (type === 'all' || type === 'opportunities') {
        const opportunitySuggestions = await Opportunity.aggregate([
          { $match: { isActive: true } },
          {
            $search: {
              autocomplete: {
                query,
                path: 'title',
                fuzzy: { maxEdits: 1 }
              }
            }
          },
          { $limit: 5 },
          { $project: { title: 1, company: 1, _id: 1 } }
        });
        suggestions.push(...opportunitySuggestions.map(item => ({
          ...item,
          type: 'opportunity'
        })));
      }

      if (type === 'all' || type === 'users') {
        const userSuggestions = await User.aggregate([
          { $match: { isActive: true } },
          {
            $search: {
              autocomplete: {
                query,
                path: 'name',
                fuzzy: { maxEdits: 1 }
              }
            }
          },
          { $limit: 5 },
          { $project: { name: 1, USN: 1, _id: 1 } }
        ]);
        suggestions.push(...userSuggestions.map(item => ({
          ...item,
          type: 'user'
        })));
      }

      // Sort by relevance and limit total results
      suggestions = suggestions
        .sort((a, b) => {
          // Prioritize exact matches
          const aExact = a.title?.toLowerCase() === query.toLowerCase() || a.name?.toLowerCase() === query.toLowerCase();
          const bExact = b.title?.toLowerCase() === query.toLowerCase() || b.name?.toLowerCase() === query.toLowerCase();
          
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          
          return 0;
        })
        .slice(0, 10);

      res.json({
        success: true,
        data: { suggestions },
        message: 'Search suggestions retrieved successfully'
      });

    } catch (error) {
      console.error('Search suggestions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get search suggestions',
        error: error.message
      });
    }
  },

  // Get search analytics
  async getSearchAnalytics(req, res) {
    try {
      const { period = 'week' } = req.query;
      
      let dateFilter = {};
      const now = new Date();
      
      switch (period) {
        case 'day':
          dateFilter = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
          break;
        case 'week':
          dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
          break;
        case 'month':
          dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
          break;
        case 'year':
          dateFilter = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
          break;
      }

      // Get content statistics
      const contentStats = await Content.aggregate([
        { $match: { createdAt: dateFilter } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalViews: { $sum: '$views' },
            totalDownloads: { $sum: '$downloads' }
          }
        }
      ]);

      // Get opportunity statistics
      const opportunityStats = await Opportunity.aggregate([
        { $match: { createdAt: dateFilter } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalViews: { $sum: '$views' },
            totalApplications: { $sum: { $size: '$applications' } }
          }
        }
      ]);

      // Get user activity
      const userStats = await User.aggregate([
        { $match: { lastLogin: dateFilter } },
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          contentStats,
          opportunityStats,
          userStats,
          period
        },
        message: 'Search analytics retrieved successfully'
      });

    } catch (error) {
      console.error('Search analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get search analytics',
        error: error.message
      });
    }
  }
};

module.exports = searchController;
