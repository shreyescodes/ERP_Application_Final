import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  Search,
  Plus,
  RefreshCw,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import ComplaintForm from './ComplaintForm';
import toast from 'react-hot-toast';

const ComplaintList = ({ 
  complaints = [], 
  onRefresh, 
  onEdit, 
  onDelete, 
  canCreate = true,
  canEdit = false,
  canDelete = false,
  showUserComplaints = true
}) => {
  const [filteredComplaints, setFilteredComplaints] = useState(complaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Statuses, categories, and priorities for filtering
  const statuses = ['open', 'assigned', 'in-progress', 'resolved', 'closed'];
  const categories = ['general', 'academic', 'technical', 'facility', 'other'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchQuery, selectedStatus, selectedCategory, selectedPriority]);

  const filterComplaints = () => {
    let filtered = [...complaints];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(complaint => 
        complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (complaint.tags && complaint.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(complaint => complaint.status === selectedStatus);
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(complaint => complaint.category === selectedCategory);
    }

    // Priority filter
    if (selectedPriority) {
      filtered = filtered.filter(complaint => complaint.priority === selectedPriority);
    }

    setFilteredComplaints(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSelectedCategory('');
    setSelectedPriority('');
  };

  const handleCreateNew = () => {
    setEditingComplaint(null);
    setShowForm(true);
  };

  const handleEdit = (complaint) => {
    setEditingComplaint(complaint);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingComplaint(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingComplaint(null);
    if (onRefresh) {
      onRefresh();
    }
    toast.success(editingComplaint ? 'Complaint updated successfully!' : 'Complaint submitted successfully!');
  };

  const handleDelete = async (complaint) => {
    if (window.confirm(`Are you sure you want to delete "${complaint.subject}"?`)) {
      try {
        if (onDelete) {
          await onDelete(complaint);
          toast.success('Complaint deleted successfully!');
        }
      } catch (error) {
        toast.error('Failed to delete complaint');
      }
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      toast.success('Complaints refreshed!');
    } catch (error) {
      toast.error('Failed to refresh complaints');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'assigned': { color: 'bg-yellow-100 text-yellow-800', icon: User },
      'in-progress': { color: 'bg-orange-100 text-orange-800', icon: Clock },
      'resolved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'closed': { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig['open'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[priority] || 'bg-gray-100 text-gray-800'}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      'general': MessageSquare,
      'academic': Tag,
      'technical': AlertTriangle,
      'facility': Clock,
      'other': MessageSquare
    };

    const Icon = categoryIcons[category] || MessageSquare;
    return <Icon className="w-4 h-4" />;
  };

  const formatDate = (date) => {
    if (!date) return 'Not available';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAge = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const created = new Date(date);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComplaints = filteredComplaints.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingComplaint ? 'Edit Complaint' : 'Submit New Complaint'}
          </h2>
          <button
            onClick={handleFormClose}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            ← Back to List
          </button>
        </div>
        <ComplaintForm
          complaint={editingComplaint}
          onSubmit={handleFormSuccess}
          onCancel={handleFormClose}
          isEditing={!!editingComplaint}
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
            {showUserComplaints ? 'My Complaints' : 'All Complaints'}
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredComplaints.length} of {complaints.length} complaints
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {canCreate && (
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit Complaint
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
            placeholder="Search complaints by subject, message, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

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

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
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

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MessageSquare className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedStatus || selectedCategory || selectedPriority
              ? 'Try adjusting your search criteria or filters.'
              : 'No complaints have been submitted yet.'}
          </p>
          {canCreate && (
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Submit First Complaint
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complaint
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentComplaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getCategoryIcon(complaint.category)}
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {complaint.subject}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {complaint.message}
                            </div>
                            {complaint.tags && complaint.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {complaint.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {complaint.tags.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    +{complaint.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(complaint.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(complaint.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          {getCategoryIcon(complaint.category)}
                          <span className="ml-2 capitalize">{complaint.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span>{formatDate(complaint.createdAt)}</span>
                          <span className="text-xs text-gray-400">{getAge(complaint.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => console.log('View complaint:', complaint)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {canEdit && (
                            <button
                              onClick={() => handleEdit(complaint)}
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                              title="Edit Complaint"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(complaint)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete Complaint"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default ComplaintList;
