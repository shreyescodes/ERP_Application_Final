import React from 'react';
import { Calendar, MapPin, Building, Clock, DollarSign, Users, Eye, Download, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const OpportunityCard = ({ opportunity, onView, onApply, onEdit, onDelete, isAdmin = false, canEdit = false }) => {
  const {
    _id,
    title,
    description,
    company,
    location,
    type,
    category,
    requirements,
    skills,
    salary,
    duration,
    applicationDeadline,
    startDate,
    photoUrl,
    isActive,
    isFeatured,
    createdBy,
    applications,
    views,
    tags,
    createdAt
  } = opportunity;

  const isExpired = new Date(applicationDeadline) < new Date();
  const isUrgent = new Date(applicationDeadline) - new Date() < 7 * 24 * 60 * 60 * 1000; // 7 days

  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Expired
        </span>
      );
    }
    if (isUrgent) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          Urgent
        </span>
      );
    }
    if (isFeatured) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          Featured
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    );
  };

  const getTypeBadge = () => {
    const typeColors = {
      'full-time': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-yellow-100 text-yellow-800',
      'internship': 'bg-green-100 text-green-800',
      'contract': 'bg-purple-100 text-purple-800',
      'freelance': 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
      </span>
    );
  };

  const getCategoryBadge = () => {
    const categoryColors = {
      'technology': 'bg-cyan-100 text-cyan-800',
      'marketing': 'bg-pink-100 text-pink-800',
      'design': 'bg-emerald-100 text-emerald-800',
      'finance': 'bg-amber-100 text-amber-800',
      'education': 'bg-violet-100 text-violet-800',
      'healthcare': 'bg-rose-100 text-rose-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
        {category?.replace(/\b\w/g, l => l.toUpperCase()) || 'General'}
      </span>
    );
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (typeof salary === 'string') return salary;
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }
    if (salary.min) {
      return `From $${salary.min.toLocaleString()}`;
    }
    if (salary.max) {
      return `Up to $${salary.max.toLocaleString()}`;
    }
    return `$${salary.toLocaleString()}`;
  };

  const formatDuration = (duration) => {
    if (!duration) return 'Not specified';
    if (typeof duration === 'string') return duration;
    if (duration.value && duration.unit) {
      return `${duration.value} ${duration.unit}${duration.value > 1 ? 's' : ''}`;
    }
    return duration;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden">
      {/* Header with photo and status */}
      <div className="relative">
        {photoUrl && (
          <div className="h-48 bg-gray-200 overflow-hidden">
            <img 
              src={photoUrl} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white text-2xl font-bold">
              {company?.charAt(0)?.toUpperCase() || 'O'}
            </div>
          </div>
        )}
        
        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {getStatusBadge()}
          {getTypeBadge()}
        </div>
        
        {/* Category badge */}
        <div className="absolute top-3 right-3">
          {getCategoryBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and company */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center text-gray-600 mb-1">
            <Building className="w-4 h-4 mr-2" />
            <span className="font-medium">{company}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Key details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatDuration(duration)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatSalary(salary)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">{applications?.length || 0} applications</span>
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 5).map((skill, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 5 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{skills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Deadlines */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Application Deadline:</span>
            </div>
            <span className={`font-medium ${isExpired ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-900'}`}>
              {formatDistanceToNow(new Date(applicationDeadline), { addSuffix: true })}
            </span>
          </div>
          {startDate && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(startDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Posted {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            <span>{views || 0} views</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {onView && (
            <button
              onClick={() => onView(opportunity)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </button>
          )}
          
          {!isExpired && onApply && (
            <button
              onClick={() => onApply(opportunity)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Apply Now
            </button>
          )}
          
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(opportunity)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
            >
              Edit
            </button>
          )}
          
          {canEdit && onDelete && (
            <button
              onClick={() => onDelete(opportunity)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
