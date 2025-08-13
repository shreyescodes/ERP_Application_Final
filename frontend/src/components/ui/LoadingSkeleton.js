import React from 'react';

const LoadingSkeleton = ({ type = 'card', lines = 3, className = '' }) => {
  const renderCardSkeleton = () => (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-300 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-4">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-lg p-4">
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/6"></div>
              <div className="h-4 bg-gray-300 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSearchSkeleton = () => (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-6">
        <div className="bg-gray-200 rounded-lg p-6">
          <div className="h-8 bg-gray-300 rounded w-full mb-4"></div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-300 rounded w-24"></div>
            <div className="h-10 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  switch (type) {
    case 'list':
      return renderListSkeleton();
    case 'table':
      return renderTableSkeleton();
    case 'search':
      return renderSearchSkeleton();
    case 'card':
    default:
      return renderCardSkeleton();
  }
};

export default LoadingSkeleton;
