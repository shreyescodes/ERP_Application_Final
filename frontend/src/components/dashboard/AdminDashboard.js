import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  Briefcase, 
  Settings, 
  LogOut, 
  Plus,
  FileText,
  Video,
  Image,
  Download,
  Eye,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  Shield,
  Upload
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ContentList from '../content/ContentList';
import OpportunityList from '../opportunities/OpportunityList';
import ContentUpload from '../content/ContentUpload';
import OpportunityForm from '../opportunities/OpportunityForm';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [content, setContent] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showContentUploadForm, setShowContentUploadForm] = useState(false);
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setContent([
        {
          _id: '1',
          title: 'Introduction to React Hooks',
          description: 'A comprehensive guide to React Hooks with practical examples',
          category: 'tutorial',
          fileType: 'application/pdf',
          fileSize: '2.5 MB',
          status: 'pending',
          uploadedBy: { name: 'John Doe' },
          createdAt: new Date(Date.now() - 86400000),
          views: 0,
          downloads: 0,
          tags: ['react', 'hooks', 'frontend']
        },
        {
          _id: '2',
          title: 'Data Structures Visualization',
          description: 'Interactive visualizations of common data structures',
          category: 'academic',
          fileType: 'video/mp4',
          fileSize: '15.2 MB',
          status: 'approved',
          uploadedBy: { name: 'Jane Smith' },
          createdAt: new Date(Date.now() - 172800000),
          views: 78,
          downloads: 23,
          tags: ['data-structures', 'algorithms', 'visualization']
        },
        {
          _id: '3',
          title: 'Machine Learning Basics',
          description: 'Fundamental concepts in machine learning',
          category: 'research',
          fileType: 'application/pdf',
          fileSize: '8.7 MB',
          status: 'rejected',
          uploadedBy: { name: 'Bob Wilson' },
          createdAt: new Date(Date.now() - 259200000),
          views: 12,
          downloads: 3,
          tags: ['machine-learning', 'ai', 'research']
        }
      ]);

      setOpportunities([
        {
          _id: '1',
          title: 'Frontend Developer Intern',
          description: 'Join our team to build modern web applications using React and Node.js',
          company: 'TechCorp',
          location: 'San Francisco, CA',
          type: 'internship',
          category: 'technology',
          salary: { min: 3000, max: 5000 },
          duration: { value: 3, unit: 'month' },
          applicationDeadline: new Date(Date.now() + 604800000),
          startDate: new Date(Date.now() + 2592000000),
          skills: ['React', 'JavaScript', 'CSS', 'Git'],
          tags: ['frontend', 'internship', 'react'],
          isActive: true,
          applications: [],
          views: 34,
          createdAt: new Date(Date.now() - 86400000)
        },
        {
          _id: '2',
          title: 'UI/UX Design Assistant',
          description: 'Help design beautiful and intuitive user interfaces',
          company: 'DesignStudio',
          location: 'Remote',
          type: 'part-time',
          category: 'design',
          salary: { min: 25, max: 35 },
          duration: { value: 6, unit: 'month' },
          applicationDeadline: new Date(Date.now() + 1209600000),
          startDate: new Date(Date.now() + 2592000000),
          skills: ['Figma', 'Adobe Creative Suite', 'User Research'],
          tags: ['design', 'ui-ux', 'remote'],
          isActive: true,
          applications: [],
          views: 56,
          createdAt: new Date(Date.now() - 172800000)
        }
      ]);

      setUsers([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'user',
          branch: 'Computer Science',
          USN: 'CS001',
          isActive: true,
          lastLogin: new Date(Date.now() - 3600000),
          createdAt: new Date(Date.now() - 2592000000)
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'user',
          branch: 'Electrical Engineering',
          USN: 'EE001',
          isActive: true,
          lastLogin: new Date(Date.now() - 7200000),
          createdAt: new Date(Date.now() - 5184000000)
        },
        {
          _id: '3',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          branch: 'Administration',
          USN: 'ADMIN001',
          isActive: true,
          lastLogin: new Date(Date.now() - 1800000),
          createdAt: new Date(Date.now() - 7776000000)
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  const handleContentRefresh = async () => {
    toast.success('Content refreshed!');
  };

  const handleOpportunityRefresh = async () => {
    toast.success('Opportunities refreshed!');
  };

  const handleContentUpload = async (formData) => {
    console.log('Uploading content:', formData);
    toast.success('Content uploaded successfully!');
    setShowContentUploadForm(false);
    handleContentRefresh();
  };

  const handleOpportunityCreate = async (formData) => {
    console.log('Creating opportunity:', formData);
    toast.success('Opportunity created successfully!');
    setShowOpportunityForm(false);
    handleOpportunityRefresh();
  };

  const handleContentApprove = async (content) => {
    console.log('Approving content:', content);
    toast.success(`Content "${content.title}" approved successfully!`);
    // Update local state
    setContent(prev => prev.map(item => 
      item._id === content._id ? { ...item, status: 'approved' } : item
    ));
  };

  const handleContentReject = async (content, reason) => {
    console.log('Rejecting content:', content, 'Reason:', reason);
    toast.success(`Content "${content.title}" rejected successfully!`);
    // Update local state
    setContent(prev => prev.map(item => 
      item._id === content._id ? { ...item, status: 'rejected' } : item
    ));
  };

  const handleContentDelete = async (content) => {
    if (window.confirm(`Are you sure you want to delete "${content.title}"?`)) {
      console.log('Deleting content:', content);
      toast.success('Content deleted successfully!');
      // Update local state
      setContent(prev => prev.filter(item => item._id !== content._id));
    }
  };

  const handleOpportunityDelete = async (opportunity) => {
    if (window.confirm(`Are you sure you want to delete "${opportunity.title}"?`)) {
      console.log('Deleting opportunity:', opportunity);
      toast.success('Opportunity deleted successfully!');
      // Update local state
      setOpportunities(prev => prev.filter(item => item._id !== opportunity._id));
    }
  };

  const handleOpportunityEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    setShowOpportunityForm(true);
  };

  const handleOpportunityUpdate = async (formData) => {
    console.log('Updating opportunity:', formData);
    toast.success('Opportunity updated successfully!');
    setShowOpportunityForm(false);
    setEditingOpportunity(null);
    handleOpportunityRefresh();
  };

  const handleUserToggleStatus = async (user) => {
    console.log('Toggling user status:', user);
    const newStatus = !user.isActive;
    toast.success(`User ${user.name} ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    // Update local state
    setUsers(prev => prev.map(item => 
      item._id === user._id ? { ...item, isActive: newStatus } : item
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome, Admin {user?.name}!</h1>
              <p className="text-purple-100">Manage your educational portal and monitor system activities.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Content</p>
                    <p className="text-2xl font-bold text-gray-900">{content.filter(c => c.status === 'pending').length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved Content</p>
                    <p className="text-2xl font-bold text-gray-900">{content.filter(c => c.status === 'approved').length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Opportunities</p>
                    <p className="text-2xl font-bold text-gray-900">{opportunities.filter(o => o.isActive).length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
                <p className="text-sm text-gray-600">Current system health and performance</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Database</h3>
                    <p className="text-sm text-green-600">Healthy</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">File Storage</h3>
                    <p className="text-sm text-green-600">Operational</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">API Services</h3>
                    <p className="text-sm text-green-600">Running</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-600">Latest system activities and user actions</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">New content uploaded: "Machine Learning Basics"</p>
                      <p className="text-xs text-gray-500">2 hours ago • Pending approval</p>
                    </div>
                  </div>
                  <div className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                    <div className="p-2 bg-green-100 rounded-lg mr-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Content approved: "Data Structures Visualization"</p>
                      <p className="text-xs text-gray-500">1 day ago • By Admin</p>
                    </div>
                  </div>
                  <div className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                    <div className="p-2 bg-purple-100 rounded-lg mr-4">
                      <UserPlus className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">New user registered: "Bob Wilson"</p>
                      <p className="text-xs text-gray-500">2 days ago • Computer Science</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <ContentList
            content={content}
            onRefresh={handleContentRefresh}
            onView={(content) => console.log('Viewing content:', content)}
            onDownload={(content) => console.log('Downloading content:', content)}
            onEdit={(content) => console.log('Editing content:', content)}
            onDelete={handleContentDelete}
            onApprove={handleContentApprove}
            onReject={handleContentReject}
            isAdmin={true}
            canCreate={true}
            canEdit={true}
            canModerate={true}
            showPendingOnly={false}
          />
        );

      case 'moderation':
        return (
          <ContentList
            content={content}
            onRefresh={handleContentRefresh}
            onView={(content) => console.log('Viewing content:', content)}
            onDownload={(content) => console.log('Downloading content:', content)}
            onEdit={(content) => console.log('Editing content:', content)}
            onDelete={handleContentDelete}
            onApprove={handleContentApprove}
            onReject={handleContentReject}
            isAdmin={true}
            canCreate={false}
            canEdit={true}
            canModerate={true}
            showPendingOnly={true}
          />
        );

      case 'opportunities':
        return (
          <OpportunityList
            opportunities={opportunities}
            onRefresh={handleOpportunityRefresh}
            onApply={(opportunity) => console.log('Applying for opportunity:', opportunity)}
            onEdit={handleOpportunityEdit}
            onDelete={handleOpportunityDelete}
            isAdmin={true}
            canCreate={true}
            canEdit={true}
          />
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <button
                onClick={() => console.log('Add new user')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? (
                              <>
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </>
                            ) : (
                              <>
                                <User className="w-3 h-3 mr-1" />
                                User
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.branch}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUserToggleStatus(user)}
                              className={`px-3 py-1 rounded text-xs font-medium ${
                                user.isActive
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="text-blue-600 hover:text-blue-900 text-xs font-medium">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
            <ContentUpload
              onSubmit={handleContentUpload}
              onCancel={() => setActiveTab('content')}
            />
          </div>
        );

      case 'create-opportunity':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingOpportunity ? 'Edit Opportunity' : 'Create New Opportunity'}
              </h2>
              <button
                onClick={() => setActiveTab('opportunities')}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                ← Back to Opportunities
              </button>
            </div>
            <OpportunityForm
              opportunity={editingOpportunity}
              onSubmit={editingOpportunity ? handleOpportunityUpdate : handleOpportunityCreate}
              onCancel={() => setActiveTab('opportunities')}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'content', label: 'Content Library', icon: BookOpen },
    { id: 'moderation', label: 'Content Moderation', icon: Shield },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'upload', label: 'Upload Content', icon: Plus },
    { id: 'create-opportunity', label: 'Create Opportunity', icon: Plus }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          activeTab === item.id
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              renderTabContent()
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
