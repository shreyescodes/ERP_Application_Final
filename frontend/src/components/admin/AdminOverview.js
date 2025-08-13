import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, Briefcase, MessageSquare, TrendingUp, 
  TrendingDown, Eye, Download, Clock, CheckCircle, XCircle,
  AlertTriangle, Plus, BarChart3, Activity, Calendar, Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AdminOverview = ({ 
  stats = {}, 
  recentContent = [], 
  recentComplaints = [], 
  recentOpportunities = [],
  recentUsers = [],
  onViewContent,
  onViewComplaint,
  onViewOpportunity,
  onViewUser
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isLoading, setIsLoading] = useState(false);

  const periods = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const getMetricChange = (current, previous) => {
    if (!previous || previous === 0) return { value: 0, isPositive: true, percentage: 0 };
    
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(1);
    const isPositive = change >= 0;
    
    return { value: Math.abs(change), isPositive, percentage };
  };

  const getMetricIcon = (metric) => {
    const icons = {
      users: Users,
      content: FileText,
      opportunities: Briefcase,
      complaints: MessageSquare
    };
    return icons[metric] || BarChart3;
  };

  const getMetricColor = (metric) => {
    const colors = {
      users: 'blue',
      content: 'green',
      opportunities: 'purple',
      complaints: 'orange'
    };
    return colors[metric] || 'gray';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'resolved':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
      case 'assigned':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
      case 'closed':
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'resolved':
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'pending':
      case 'assigned':
        return 'text-yellow-600 bg-yellow-50';
      case 'rejected':
      case 'closed':
      case 'inactive':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, data]) => {
          const Icon = getMetricIcon(key);
          const color = getMetricColor(key);
          const change = getMetricChange(data.current, data.previous);
          
          return (
            <div key={key} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 bg-${color}-100 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(data.current)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center text-sm ${
                    change.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {change.isPositive ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {change.percentage}%
                  </div>
                  <p className="text-xs text-gray-500">
                    {change.isPositive ? '+' : '-'}{change.value} from last {selectedPeriod}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Add Content</p>
              <p className="text-xs text-gray-500">Upload new materials</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group">
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Post Opportunity</p>
              <p className="text-xs text-gray-500">Create job/internship</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
              <p className="text-xs text-gray-500">User administration</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors group">
            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Review Complaints</p>
              <p className="text-xs text-gray-500">Handle user issues</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Content</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentContent.length > 0 ? (
              <div className="space-y-4">
                {recentContent.slice(0, 5).map((content) => (
                  <div key={content._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onViewContent(content)}>
                    <div className="flex-shrink-0">
                      {content.fileType?.startsWith('image/') ? (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </div>
                      ) : content.fileType?.startsWith('video/') ? (
                        <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-blue-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {content.title}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{content.category}</span>
                        <span>•</span>
                        <span>{formatFileSize(content.fileSize)}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(content.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                        {getStatusIcon(content.status)}
                        <span className="ml-1 capitalize">{content.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No recent content</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentComplaints.length > 0 ? (
              <div className="space-y-4">
                {recentComplaints.slice(0, 5).map((complaint) => (
                  <div key={complaint._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onViewComplaint(complaint)}>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {complaint.subject}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                        <span>•</span>
                        <span>{complaint.category}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        <span className="ml-1 capitalize">{complaint.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No recent complaints</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Opportunities */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Opportunities</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="p-6">
          {recentOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentOpportunities.slice(0, 6).map((opportunity) => (
                <div key={opportunity._id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => onViewOpportunity(opportunity)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {opportunity.title}
                      </h4>
                      <p className="text-xs text-gray-600">{opportunity.company}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.isActive ? 'active' : 'inactive')}`}>
                      {getStatusIcon(opportunity.isActive ? 'active' : 'inactive')}
                      <span className="ml-1">{opportunity.isActive ? 'Active' : 'Inactive'}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{opportunity.type}</span>
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Posted {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No recent opportunities</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="p-6">
          {recentUsers.length > 0 ? (
            <div className="space-y-4">
              {recentUsers.slice(0, 5).map((user) => (
                <div key={user._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onViewUser(user)}>
                  <div className="flex-shrink-0">
                    {user.profilePicture ? (
                      <img
                        className="w-10 h-10 rounded-full"
                        src={user.profilePicture}
                        alt={user.name}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{user.email}</span>
                      <span>•</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-500">
                    {user.lastLogin 
                      ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })
                      : 'Never logged in'
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No recent users</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
