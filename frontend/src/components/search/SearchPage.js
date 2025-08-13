import React, { useState } from 'react';
import { Search, Filter, TrendingUp, BarChart3, Clock, Zap } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import SearchResults from './SearchResults';
import LoadingSkeleton from '../ui/LoadingSkeleton';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([
    'Computer Science',
    'Machine Learning',
    'Web Development',
    'Data Science',
    'Software Engineering',
    'Artificial Intelligence',
    'Cybersecurity',
    'Cloud Computing'
  ]);

  const handleSearch = (results) => {
    setSearchResults(results);
    
    // Add to recent searches
    if (results.query) {
      setRecentSearches(prev => {
        const newSearches = [results.query, ...prev.filter(s => s !== results.query)].slice(0, 5);
        return newSearches;
      });
    }
  };

  const handleQuickSearch = (query) => {
    // Simulate a quick search
    setIsSearching(true);
    setTimeout(() => {
      // Mock results for demonstration
      const mockResults = {
        query,
        content: [
          {
            _id: '1',
            title: `${query} - Introduction`,
            description: `Learn the basics of ${query}`,
            category: 'Computer Science',
            fileType: 'application/pdf',
            fileSize: 2048576,
            status: 'approved',
            uploadedBy: { name: 'Dr. Smith', USN: 'CS001', branch: 'computer-science' },
            views: 150,
            downloads: 45,
            createdAt: new Date().toISOString(),
            tags: [query.toLowerCase(), 'tutorial', 'beginner']
          }
        ],
        opportunities: [
          {
            _id: '1',
            title: `${query} Internship`,
            company: 'Tech Corp',
            location: 'Bangalore',
            type: 'internship',
            category: 'Computer Science',
            salary: 25000,
            duration: '3-6 months',
            isActive: true,
            createdBy: { name: 'HR Manager', USN: 'HR001', branch: 'human-resources' },
            views: 89,
            createdAt: new Date().toISOString(),
            applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        users: [],
        totalResults: 2,
        pagination: {
          page: 1,
          limit: 20,
          totalPages: 1
        }
      };
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleResultSelect = (result) => {
    // Handle result selection - could navigate to detail page or open modal
    console.log('Selected result:', result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Search
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Search across content, opportunities, and users with powerful filters and real-time suggestions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            {/* Quick Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Quick Search
              </h3>
              <div className="space-y-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleQuickSearch(search)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Tips */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Search Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use quotes for exact phrases: "machine learning"</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Combine filters for better results</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use tags to find related content</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Filter by date for recent materials</p>
                </div>
              </div>
            </div>

            {/* Search Statistics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Search Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Content:</span>
                  <span className="font-medium text-gray-900">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Opportunities:</span>
                  <span className="font-medium text-gray-900">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registered Users:</span>
                  <span className="font-medium text-gray-900">2,156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories:</span>
                  <span className="font-medium text-gray-900">12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 order-1 lg:order-2">
            {/* Search Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <GlobalSearch 
                onResultSelect={handleSearch}
                placeholder="Search for content, opportunities, users, or specific topics..."
              />
            </div>

            {/* Search Results */}
            {searchResults && (
              <SearchResults 
                searchResults={searchResults}
                onResultSelect={handleResultSelect}
                isLoading={isSearching}
              />
            )}

            {/* No Search Yet */}
            {!searchResults && !isSearching && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Search</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Use the search bar above to find content, opportunities, or users. 
                  Try different keywords or use the advanced filters for more specific results.
                </p>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <LoadingSkeleton type="search" className="bg-white rounded-lg border border-gray-200 p-6" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
