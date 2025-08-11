import React, { useState } from 'react';
import { Eye, Download, Calendar, User, Tag, FileText, Play, Image, File } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ContentCard = ({ content, onView, onDownload, showActions = true }) => {
  const [imageError, setImageError] = useState(false);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5 text-blue-600" />;
    if (fileType.startsWith('video/')) return <Play className="h-5 w-5 text-red-600" />;
    if (fileType.startsWith('application/pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.includes('word')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (fileType.includes('excel')) return <FileText className="h-5 w-5 text-green-500" />;
    if (fileType.includes('powerpoint')) return <FileText className="h-5 w-5 text-orange-500" />;
    if (fileType.startsWith('text/')) return <FileText className="h-5 w-5 text-gray-500" />;
    return <File className="h-5 w-5 text-gray-400" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {category}
      </span>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const renderThumbnail = () => {
    if (content.fileType.startsWith('image/') && content.fileUrl && !imageError) {
      return (
        <img
          src={content.fileUrl}
          alt={content.title}
          className="w-full h-32 object-cover rounded-t-lg"
          onError={handleImageError}
        />
      );
    }

    if (content.fileType.startsWith('video/')) {
      return (
        <div className="w-full h-32 bg-gray-100 rounded-t-lg flex items-center justify-center">
          <Play className="h-12 w-12 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="w-full h-32 bg-gray-100 rounded-t-lg flex items-center justify-center">
        {getFileIcon(content.fileType)}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Thumbnail */}
      {renderThumbnail()}

      {/* Content */}
      <div className="p-4">
        {/* Title and Status */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {content.title}
          </h3>
          {showActions && getStatusBadge(content.status)}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {content.description}
        </p>

        {/* Category and Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {getCategoryBadge(content.category)}
          {content.tags && content.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tag className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {content.tags.slice(0, 3).join(', ')}
                {content.tags.length > 3 && ` +${content.tags.length - 3}`}
              </span>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-2">
            {getFileIcon(content.fileType)}
            <span>{formatFileSize(content.fileSize)}</span>
          </div>
          <span className="capitalize">
            {content.fileType.split('/')[1]}
          </span>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3" />
            <span>
              {content.uploadedBy?.name || 'Unknown User'}
              {content.uploadedBy?.branch && ` • ${content.uploadedBy.branch}`}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(content.createdAt), { addSuffix: true })}
            </span>
          </div>

          {content.approvedBy && (
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✓</span>
              <span>
                Approved by {content.approvedBy.name}
                {content.approvedAt && ` • ${formatDistanceToNow(new Date(content.approvedAt), { addSuffix: true })}`}
              </span>
            </div>
          )}

          {content.rejectionReason && (
            <div className="flex items-start space-x-2">
              <span className="text-red-600">✗</span>
              <span className="text-red-600">
                Rejected: {content.rejectionReason}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{content.views || 0} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="h-3 w-3" />
              <span>{content.downloads || 0} downloads</span>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onView(content)}
                className="px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors flex items-center space-x-1"
              >
                <Eye className="h-3 w-3" />
                <span>View</span>
              </button>
              
              {content.status === 'approved' && (
                <button
                  onClick={() => onDownload(content)}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>Download</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
