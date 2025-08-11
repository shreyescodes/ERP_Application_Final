import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Upload, 
  Briefcase, 
  Search, 
  User, 
  LogOut, 
  FileText, 
  Video, 
  Image, 
  Download,
  Eye,
  Calendar,
  MapPin,
  Building,
  Clock,
  DollarSign,
  Users,
  ExternalLink,
  Plus,
  RefreshCw,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ContentList from '../content/ContentList';
import OpportunityList from '../opportunities/OpportunityList';
import ContentUpload from '../content/ContentUpload';
import ComplaintList from '../complaints/ComplaintList';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [content, setContent] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation items for the sidebar
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'text-blue-600' },
    { id: 'content', label: 'Browse Content', icon: FileText, color: 'text-green-600' },
    { id: 'upload', label: 'Upload Content', icon: Upload, color: 'text-purple-600' },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase, color: 'text-orange-600' },
    { id: 'complaints', label: 'My Complaints', icon: MessageSquare, color: 'text-red-600' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-gray-600' }
  ];

  useEffect(() => {
    // Load mock data (replace with actual API calls)
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock content data
        setContent([
          {
            _id: '1',
            title: 'Introduction to React Hooks',
            description: 'A comprehensive guide to React Hooks with practical examples',
            category: 'tutorial',
            fileType: 'video/mp4',
            fileSize: '45.2 MB',
            status: 'approved',
            views: 1250,
            downloads: 89,
            uploadedBy: { name: 'Dr. Smith', branch: 'Computer Science' },
            createdAt: new Date('2024-01-15'),
            tags: ['react', 'hooks', 'frontend']
          },
          {
            _id: '2',
            title: 'Machine Learning Fundamentals',
            description: 'Basic concepts and algorithms in machine learning',
            category: 'academic',
            fileType: 'application/pdf',
            fileSize: '12.8 MB',
            status: 'approved',
            views: 890,
            downloads: 156,
            uploadedBy: { name: 'Prof. Johnson', branch: 'AI & ML' },
            createdAt: new Date('2024-01-10'),
            tags: ['machine-learning', 'ai', 'algorithms']
          }
        ]);

        // Mock opportunities data
        setOpportunities([
          {
            _id: '1',
            title: 'Software Engineering Intern',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            type: 'internship',
            category: 'technology',
            salary: { min: 5000, max: 8000 },
            duration: { value: 3, unit: 'month' },
            applicationDeadline: new Date('2024-03-15'),
            startDate: new Date('2024-06-01'),
            skills: ['React', 'Node.js', 'MongoDB'],
            isActive: true,
            views: 234,
            applications: [],
            createdAt: new Date('2024-01-20')
          },
          {
            _id: '2',
            title: 'Data Science Research Assistant',
            company: 'University Research Lab',
            location: 'Remote',
            type: 'part-time',
            category: 'research',
            salary: { min: 3000, max: 5000 },
            duration: { value: 6, unit: 'month' },
            applicationDeadline: new Date('2024-04-01'),
            startDate: new Date('2024-05-01'),
            skills: ['Python', 'Statistics', 'Data Analysis'],
            isActive: true,
            views: 156,
            applications: [],
            createdAt: new Date('2024-01-18')
          }
        ]);

        // Mock complaints data
        setComplaints([
          {
            _id: '1',
            subject: 'Library Wi-Fi Connection Issues',
            message: 'The Wi-Fi connection in the library has been very slow and unstable for the past week. This is affecting my ability to access online resources and complete assignments.',
            category: 'technical',
            priority: 'medium',
            status: 'open',
            isAnonymous: false,
            isUrgent: false,
            tags: ['wifi', 'library', 'technical'],
            createdAt: new Date('2024-01-25'),
            submittedBy: user?.name
          },
          {
            _id: '2',
            subject: 'Request for Additional Study Materials',
            message: 'I would like to request additional study materials for the Advanced Mathematics course. The current resources are helpful but I need more practice problems.',
            category: 'academic',
            priority: 'low',
            status: 'assigned',
            isAnonymous: false,
            isUrgent: false,
            tags: ['academic', 'mathematics', 'study-materials'],
            createdAt: new Date('2024-01-20'),
            submittedBy: user?.name
          }
        ]);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleContentRefresh = async () => {
    // Implement actual API call to refresh content
    toast.success('Content refreshed!');
  };

  const handleOpportunityRefresh = async () => {
    // Implement actual API call to refresh opportunities
    toast.success('Opportunities refreshed!');
  };

  const handleContentUpload = async (formData) => {
    // Implement actual API call to upload content
    toast.success('Content uploaded successfully!');
    setShowUploadForm(false);
    // Refresh content list
    handleContentRefresh();
  };

  const handleApplyForOpportunity = async (opportunity) => {
    // Implement actual API call to apply for opportunity
    toast.success(`Applied for ${opportunity.title} at ${opportunity.company}`);
  };

  const handleViewContent = (content) => {
    // Implement content viewing logic
    console.log('Viewing content:', content);
  };

  const handleDownloadContent = (content) => {
    // Implement content download logic
    toast.success(`Downloading ${content.title}`);
  };

  const handleComplaintSubmit = async (formData) => {
    // Implement actual API call to submit complaint
    const newComplaint = {
      _id: Date.now().toString(),
      ...formData,
      status: 'open',
      createdAt: new Date(),
      submittedBy: user?.name
    };
    setComplaints(prev => [newComplaint, ...prev]);
    toast.success('Complaint submitted successfully!');
  };

  const handleComplaintRefresh = async () => {
    // Implement actual API call to refresh complaints
    toast.success('Complaints refreshed!');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search logic
    console.log('Searching for:', query);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100">Explore content, find opportunities, and stay updated with your institute.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Content</p>
                    <p className="text-2xl font-bold text-gray-900">{content.filter(c => c.status === 'approved').length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Opportunities</p>
                    <p className="text-2xl font-bold text-gray-900">{opportunities.filter(o => o.isActive).length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Download className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Your Downloads</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Content */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Content</h2>
                <p className="text-sm text-gray-600">Latest approved content from your institute</p>
              </div>
              <div className="p-6">
                {content.filter(c => c.status === 'approved').slice(0, 3).map((item) => (
                  <div key={item._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {item.fileType.startsWith('video/') ? (
                          <Video className="w-5 h-5 text-gray-600" />
                        ) : item.fileType.startsWith('image/') ? (
                          <Image className="w-5 h-5 text-gray-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.category} • {item.uploadedBy.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewContent(item)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadContent(item)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Opportunities */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Featured Opportunities</h2>
                <p className="text-sm text-gray-600">Don't miss these exciting opportunities</p>
              </div>
              <div className="p-6">
                {opportunities.filter(o => o.isActive).slice(0, 2).map((opp) => (
                  <div key={opp._id} className="py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{opp.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {opp.company}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {opp.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {opp.duration.value} {opp.duration.unit}{opp.duration.value > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApplyForOpportunity(opp)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <ContentList
            content={content.filter(c => c.status === 'approved')}
            onRefresh={handleContentRefresh}
            onView={handleViewContent}
            onDownload={handleDownloadContent}
            canCreate={false}
            canEdit={false}
            canModerate={false}
          />
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Upload Content</h2>
              <button
                onClick={() => setActiveTab('content')}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                ← Back to Content
              </button>
            </div>
            <ContentUpload onSubmit={handleContentUpload} onCancel={() => setActiveTab('content')} />
          </div>
        );

      case 'opportunities':
        return (
          <OpportunityList
            opportunities={opportunities}
            onRefresh={handleOpportunityRefresh}
            onApply={handleApplyForOpportunity}
            canCreate={false}
            canEdit={false}
          />
        );

      case 'complaints':
        return (
          <ComplaintList
            complaints={complaints}
            onRefresh={handleComplaintRefresh}
            onEdit={handleComplaintSubmit}
            canCreate={true}
            canEdit={true}
            canDelete={false}
            showUserComplaints={true}
          />
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500">Role: {user?.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Branch:</span> {user?.branch || 'Not specified'}</p>
                    <p><span className="font-medium">USN:</span> {user?.USN || 'Not specified'}</p>
                    <p><span className="font-medium">Member since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Activity</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Last login:</span> {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Not available'}</p>
                    <p><span className="font-medium">Content uploaded:</span> {content.filter(c => c.uploadedBy?.name === user?.name).length}</p>
                    <p><span className="font-medium">Opportunities applied:</span> 0</p>
                    <p><span className="font-medium">Complaints submitted:</span> {complaints.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Institute Portal</h1>
            </div>
            
            {/* Global Search */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search content, opportunities, or users..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : item.color}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
