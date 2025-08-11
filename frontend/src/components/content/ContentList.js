import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Plus, RefreshCw, Eye, Download } from 'lucide-react';
import ContentCard from './ContentCard';
import ContentUpload from './ContentUpload';
import toast from 'react-hot-toast';

const ContentList = ({ 
  content = [], 
  onRefresh, 
  onView, 
  onDownload, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject,
  isAdmin = false, 
  canCreate = false,
  canEdit = false,
  canModerate = false,
  showPendingOnly = false
}) => {
  const [filteredContent, setFilteredContent] = useState(content);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Categories, statuses, and file types for filtering
  const categories = ['academic', 'research', 'project', 'tutorial', 'presentation', 'documentation', 'multimedia', 'other'];
  const statuses = ['pending', 'approved', 'rejected'];
  const fileTypes = ['image', 'video', 'document'];

  useEffect(() => {
    filterContent();
  }, [content, searchQuery, selectedCategory, selectedStatus, selectedFileType]);

  const filterContent = () => {
    let filtered = [...content];

    // Show only pending content if requested
    if (showPendingOnly) {
      filtered = filtered.filter(item => item.status === 'pending');
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (item.uploadedBy && item.uploadedBy.name && 
         item.uploadedBy.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // File type filter
    if (selectedFileType) {
      filtered = filtered.filter(item => {
        if (selectedFileType === 'image') {
          return item.fileType && item.fileType.startsWith('image/');
        } else if (selectedFileType === 'video') {
          return item.fileType && item.fileType.startsWith('video/');
        } else if (selectedFileType === 'document') {
          return item.fileType && (item.fileType.startsWith('application/') || item.fileType.startsWith('text/'));
        }
        return true;
      });
    }

    setFilteredContent(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedFileType('');
  };

  const handleCreateNew = () => {
    setEditingContent(null);
    setShowUploadForm(true);
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setShowUploadForm(true);
  };

  const handleFormClose = () => {
    setShowUploadForm(false);
    setEditingContent(null);
  };

  const handleFormSuccess = () => {
    setShowUploadForm(false);
    setEditingContent(null);
    if (onRefresh) {
      onRefresh();
    }
    toast.success(editingContent ? 'Content updated successfully!' : 'Content uploaded successfully!');
  };

  const handleDelete = async (content) => {
    if (window.confirm(`Are you sure you want to delete "${content.title}"?`)) {
      try {
        if (onDelete) {
          await onDelete(content);
          toast.success('Content deleted successfully!');
        }
      } catch (error) {
        toast.error('Failed to delete content');
      }
    }
  };

  const handleApprove = async (content) => {
    try {
      if (onApprove) {
        await onApprove(content);
        toast.success('Content approved successfully!');
      }
    } catch (error) {
      toast.error('Failed to approve content');
    }
  };

  const handleReject = async (content) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason !== null) {
      try {
        if (onReject) {
          await onReject(content, reason);
          toast.success('Content rejected successfully!');
        }
      } catch (error) {
        toast.error('Failed to reject content');
      }
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      toast.success('Content refreshed!');
    } catch (error) {
      toast.error('Failed to refresh content');
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContent = filteredContent.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (showUploadForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingContent ? 'Edit Content' : 'Upload New Content'}
          </h2>
          <button
            onClick={handleFormClose}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            ← Back to List
          </button>
        </div>
        <ContentUpload
          content={editingContent}
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
          <h2 className="text-2xl font-bold text-gray-900">
            {showPendingOnly ? 'Pending Content' : 'Content Library'}
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredContent.length} of {content.length} content items
            {showPendingOnly && ' pending approval'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {canCreate && (
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Content
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
            placeholder="Search content by title, description, tags, or uploader..."
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

          {/* File Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
            <select
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {fileTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
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

        {filteredContent.length > 0 && (
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredContent.length)} of {filteredContent.length} content items
          </p>
        )}
      </div>

      {/* Content Grid/List */}
      {filteredContent.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory || selectedStatus || selectedFileType
              ? 'Try adjusting your search criteria or filters.'
              : showPendingOnly 
                ? 'No content is pending approval.'
                : 'No content has been uploaded yet.'}
          </p>
          {canCreate && !showPendingOnly && (
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Upload First Content
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {currentContent.map((contentItem) => (
              <ContentCard
                key={contentItem._id}
                content={contentItem}
                onView={onView}
                onDownload={onDownload}
                onEdit={canEdit ? handleEdit : undefined}
                onDelete={canEdit ? handleDelete : undefined}
                onApprove={canModerate ? handleApprove : undefined}
                onReject={canModerate ? handleReject : undefined}
                isAdmin={isAdmin}
                canEdit={canEdit}
                canModerate={canModerate}
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

export default ContentList;
