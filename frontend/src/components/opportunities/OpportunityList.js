import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Plus, RefreshCw } from 'lucide-react';
import OpportunityCard from './OpportunityCard';
import OpportunityForm from './OpportunityForm';
import toast from 'react-hot-toast';

const OpportunityList = ({ 
  opportunities = [], 
  onRefresh, 
  onApply, 
  onEdit, 
  onDelete, 
  isAdmin = false, 
  canCreate = false,
  canEdit = false 
}) => {
  const [filteredOpportunities, setFilteredOpportunities] = useState(opportunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Categories and types for filtering
  const categories = ['technology', 'marketing', 'design', 'finance', 'education', 'healthcare', 'engineering', 'sales', 'research', 'consulting'];
  const types = ['full-time', 'part-time', 'internship', 'contract', 'freelance', 'volunteer'];
  const statuses = ['active', 'expired', 'urgent', 'featured'];

  useEffect(() => {
    filterOpportunities();
  }, [opportunities, searchQuery, selectedCategory, selectedType, selectedStatus]);

  const filterOpportunities = () => {
    let filtered = [...opportunities];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opp.skills && opp.skills.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (opp.tags && opp.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(opp => opp.category === selectedCategory);
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(opp => opp.type === selectedType);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(opp => {
        const now = new Date();
        const deadline = new Date(opp.applicationDeadline);
        const isExpired = deadline < now;
        const isUrgent = deadline - now < 7 * 24 * 60 * 60 * 1000; // 7 days

        switch (selectedStatus) {
          case 'active':
            return !isExpired;
          case 'expired':
            return isExpired;
          case 'urgent':
            return isUrgent && !isExpired;
          case 'featured':
            return opp.isFeatured;
          default:
            return true;
        }
      });
    }

    setFilteredOpportunities(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedType('');
    setSelectedStatus('');
  };

  const handleCreateNew = () => {
    setEditingOpportunity(null);
    setShowForm(true);
  };

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingOpportunity(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingOpportunity(null);
    if (onRefresh) {
      onRefresh();
    }
    toast.success(editingOpportunity ? 'Opportunity updated successfully!' : 'Opportunity created successfully!');
  };

  const handleDelete = async (opportunity) => {
    if (window.confirm(`Are you sure you want to delete "${opportunity.title}"?`)) {
      try {
        if (onDelete) {
          await onDelete(opportunity);
          toast.success('Opportunity deleted successfully!');
        }
      } catch (error) {
        toast.error('Failed to delete opportunity');
      }
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      toast.success('Opportunities refreshed!');
    } catch (error) {
      toast.error('Failed to refresh opportunities');
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOpportunities = filteredOpportunities.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingOpportunity ? 'Edit Opportunity' : 'Create New Opportunity'}
          </h2>
          <button
            onClick={handleFormClose}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            ← Back to List
          </button>
        </div>
        <OpportunityForm
          opportunity={editingOpportunity}
          onSubmit={handleFormSuccess}
          onCancel={handleFormClose}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Opportunities</h2>
          <p className="text-gray-600 mt-1">
            {filteredOpportunities.length} of {opportunities.length} opportunities
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {canCreate && (
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Opportunity
            </button>
          )}
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search opportunities by title, company, skills, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'grid' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'list' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {filteredOpportunities.length > 0 && (
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredOpportunities.length)} of {filteredOpportunities.length} opportunities
          </p>
        )}
      </div>

      {/* Opportunities Grid/List */}
      {filteredOpportunities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory || selectedType || selectedStatus
              ? 'Try adjusting your search criteria or filters.'
              : 'No opportunities have been posted yet.'}
          </p>
          {canCreate && (
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Create First Opportunity
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {currentOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity._id}
                opportunity={opportunity}
                onView={(opp) => console.log('View opportunity:', opp)}
                onApply={onApply}
                onEdit={canEdit ? handleEdit : undefined}
                onDelete={canEdit ? handleDelete : undefined}
                isAdmin={isAdmin}
                canEdit={canEdit}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OpportunityList;
