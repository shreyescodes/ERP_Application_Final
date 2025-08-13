import React, { useState, useMemo } from 'react';
import { FileText, Briefcase, Users, Eye, Download, MapPin, Building, Calendar, DollarSign, Clock, Tag, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ContentCard from '../content/ContentCard';
import OpportunityCard from '../opportunities/OpportunityCard';

const SearchResults = React.memo(({ searchResults, onResultSelect, isLoading }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');

  // Extract data with defaults - this is safe to do before hooks
  const content = searchResults?.content || [];
  const opportunities = searchResults?.opportunities || [];
  const users = searchResults?.users || [];
  const totalResults = searchResults?.totalResults || 0;
  const pagination = searchResults?.pagination || {};

  // All useMemo hooks must be called before any conditional returns
  const tabs = useMemo(() => [
    { id: 'all', label: 'All Results', count: totalResults, icon: Filter },
    { id: 'content', label: 'Content', count: content.length, icon: FileText },
    { id: 'opportunities', label: 'Opportunities', count: opportunities.length, icon: Briefcase },
    { id: 'users', label: 'Users', count: users.length, icon: Users }
  ], [totalResults, content.length, opportunities.length, users.length]);

  const getActiveResults = useMemo(() => {
    switch (activeTab) {
      case 'content':
        return { content, opportunities: [], users: [] };
      case 'opportunities':
        return { content: [], opportunities, users: [] };
      case 'users':
        return { content: [], opportunities: [], users: [] };
      default:
        return { content, opportunities, users };
    }
  }, [activeTab, content, opportunities, users]);

  const getSortOptions = useMemo(() => {
    const baseOptions = [
      { value: 'relevance', label: 'Relevance' },
      { value: 'newest', label: 'Newest First' },
      { value: 'oldest', label: 'Oldest First' }
    ];

    if (activeTab === 'content') {
      baseOptions.push(
        { value: 'title', label: 'Title A-Z' },
        { value: 'views', label: 'Most Viewed' },
        { value: 'downloads', label: 'Most Downloaded' }
      );
    } else if (activeTab === 'opportunities') {
      baseOptions.push(
        { value: 'salary', label: 'Highest Salary' },
        { value: 'deadline', label: 'Deadline Soon' },
        { value: 'company', label: 'Company A-Z' }
      );
    } else if (activeTab === 'users') {
      baseOptions.push(
        { value: 'name', label: 'Name A-Z' },
        { value: 'lastLogin', label: 'Recently Active' }
      );
    }

    return baseOptions;
  }, [activeTab]);

  const sortResults = (results, sortType) => {
    const sorted = [...results];
    
    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'title':
        return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'views':
        return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'downloads':
        return sorted.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      case 'salary':
        return sorted.sort((a, b) => (b.salary || 0) - (a.salary || 0));
      case 'deadline':
        return sorted.sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline));
      case 'company':
        return sorted.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
      case 'name':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'lastLogin':
        return sorted.sort((a, b) => new Date(b.lastLogin || 0) - new Date(a.lastLogin || 0));
      default:
        return sorted;
    }
  };

  const { content: activeContent, opportunities: activeOpportunities, users: activeUsers } = getActiveResults;
  const sortedContent = useMemo(() => sortResults(activeContent, sortBy), [activeContent, sortBy]);
  const sortedOpportunities = useMemo(() => sortResults(activeOpportunities, sortBy), [activeOpportunities, sortBy]);
  const sortedUsers = useMemo(() => sortResults(activeUsers, sortBy), [activeUsers, sortBy]);

  // Early return check - must come after all hooks
  if (!searchResults) {
    return null;
  }

  const renderContentResults = () => {
    if (sortedContent.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      );
    }

    return (
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {sortedContent.map((item) => (
          <ContentCard 
            key={item._id} 
            content={item} 
            onView={() => onResultSelect && onResultSelect(item)}
            onEdit={() => onResultSelect && onResultSelect(item)}
            onDelete={() => {}}
            showActions={false}
          />
        ))}
      </div>
    );
  };

  const renderOpportunityResults = () => {
    if (sortedOpportunities.length === 0) {
      return (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No opportunities found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      );
    }

    return (
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {sortedOpportunities.map((item) => (
          <OpportunityCard 
            key={item._id} 
            opportunity={item} 
            onView={() => onResultSelect && onResultSelect(item)}
            onEdit={() => onResultSelect && onResultSelect(item)}
            onDelete={() => {}}
            showActions={false}
          />
        ))}
      </div>
    );
  };

  const renderUserResults = () => {
    if (sortedUsers.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      );
    }

    return (
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {sortedUsers.map((user) => (
          <div key={user._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {user.profilePicture ? (
                  <img
                    className="h-16 w-16 rounded-full"
                    src={user.profilePicture}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                {user.USN && (
                  <p className="text-sm text-gray-400">USN: {user.USN}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                  {user.branch && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {user.branch.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm text-gray-500">
                  {user.lastLogin 
                    ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })
                    : 'Never logged in'
                  }
                </p>
                <button
                  onClick={() => onResultSelect && onResultSelect(user)}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderResults = () => {
    switch (activeTab) {
      case 'content':
        return renderContentResults();
      case 'opportunities':
        return renderOpportunityResults();
      case 'users':
        return renderUserResults();
      default:
        return (
          <div className="space-y-8">
            {content.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Content ({content.length})
                </h3>
                {renderContentResults()}
              </div>
            )}
            
            {opportunities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                  Opportunities ({opportunities.length})
                </h3>
                {renderOpportunityResults()}
              </div>
            )}
            
            {users.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Users ({users.length})
                </h3>
                {renderUserResults()}
              </div>
            )}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
            <p className="text-gray-600">
              Found {totalResults} result{totalResults !== 1 ? 's' : ''} across all categories
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid View"
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="List View"
            >
              <div className="space-y-1 w-4 h-4">
                <div className="bg-current rounded-sm h-1"></div>
                <div className="bg-current rounded-sm h-1"></div>
                <div className="bg-current rounded-sm h-1"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {getSortOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderResults()}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.page <= 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                {pagination.page}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default SearchResults;
