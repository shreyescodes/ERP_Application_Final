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
  Upload,
  MessageSquare,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ContentList from '../content/ContentList';
import OpportunityList from '../opportunities/OpportunityList';
import ContentUpload from '../content/ContentUpload';
import OpportunityForm from '../opportunities/OpportunityForm';
import AdminComplaintList from '../complaints/AdminComplaintList';
import UserManagement from '../admin/UserManagement';
import AdminOverview from '../admin/AdminOverview';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [content, setContent] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
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
          branch: 'computer-science',
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
          branch: 'electrical-engineering',
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
          branch: 'administration',
          USN: 'ADMIN001',
          isActive: true,
          lastLogin: new Date(Date.now() - 1800000),
          createdAt: new Date(Date.now() - 7776000000)
        }
      ]);

      setComplaints([
        {
          _id: '1',
          subject: 'Network connectivity issues in Lab 3',
          message: 'Students are experiencing frequent disconnections while working on assignments. This is affecting our productivity.',
          category: 'technical',
          priority: 'high',
          status: 'open',
          submittedBy: { name: 'John Doe', _id: '1' },
          createdAt: new Date(Date.now() - 86400000),
          isUrgent: false,
          isAnonymous: false
        },
        {
          _id: '2',
          subject: 'Request for additional study materials',
          message: 'We need more reference books and digital resources for the Machine Learning course.',
          category: 'academic',
          priority: 'medium',
          status: 'assigned',
          submittedBy: { name: 'Jane Smith', _id: '2' },
          assignedTo: { name: 'Admin User', _id: '3' },
          assignedAt: new Date(Date.now() - 43200000),
          createdAt: new Date(Date.now() - 172800000),
          isUrgent: false,
          isAnonymous: false
        },
        {
          _id: '3',
          subject: 'Air conditioning not working properly',
          message: 'The temperature in the library is too high, making it uncomfortable for studying.',
          category: 'facility',
          priority: 'urgent',
          status: 'inProgress',
          submittedBy: { name: 'Bob Wilson', _id: '4' },
          assignedTo: { name: 'Admin User', _id: '3' },
          assignedAt: new Date(Date.now() - 86400000),
          createdAt: new Date(Date.now() - 259200000),
          isUrgent: true,
          isAnonymous: false
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

  const handleComplaintRefresh = async () => {
    toast.success('Complaints refreshed!');
  };

  const handleComplaintAssign = async (complaintId, userId) => {
    console.log('Assigning complaint:', complaintId, 'to user:', userId);
    const user = users.find(u => u._id === userId);
    if (user) {
      setComplaints(prev => prev.map(item => 
        item._id === complaintId 
          ? { ...item, status: 'assigned', assignedTo: user, assignedAt: new Date() }
          : item
      ));
      toast.success('Complaint assigned successfully!');
    }
  };

  const handleComplaintStatusUpdate = async (complaintId, status) => {
    console.log('Updating complaint status:', complaintId, 'to:', status);
    setComplaints(prev => prev.map(item => 
      item._id === complaintId ? { ...item, status } : item
    ));
    toast.success('Complaint status updated successfully!');
  };

  const handleComplaintDelete = async (complaint) => {
    if (window.confirm(`Are you sure you want to delete this complaint?`)) {
      console.log('Deleting complaint:', complaint);
      setComplaints(prev => prev.filter(item => item._id !== complaint._id));
      toast.success('Complaint deleted successfully!');
    }
  };

  const handleUserDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      console.log('Deleting user:', user);
      setUsers(prev => prev.filter(item => item._id !== user._id));
      toast.success('User deleted successfully!');
    }
  };

  const handleUserRoleUpdate = async (userId, newRole) => {
    console.log('Updating user role:', userId, 'to:', newRole);
    setUsers(prev => prev.map(item => 
      item._id === userId ? { ...item, role: newRole } : item
    ));
    toast.success('User role updated successfully!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <AdminOverview
            stats={{
              users: { current: users.length, previous: users.length - 2 },
              content: { current: content.length, previous: content.length - 1 },
              opportunities: { current: opportunities.length, previous: opportunities.length - 1 },
              complaints: { current: complaints.length, previous: complaints.length - 1 }
            }}
            recentContent={content.slice(0, 5)}
            recentComplaints={complaints.slice(0, 5)}
            recentOpportunities={opportunities.slice(0, 5)}
            recentUsers={users.slice(0, 5)}
            onViewContent={(content) => console.log('Viewing content:', content)}
            onViewComplaint={(complaint) => console.log('Viewing complaint:', complaint)}
            onViewOpportunity={(opportunity) => console.log('Viewing opportunity:', opportunity)}
            onViewUser={(user) => console.log('Viewing user:', user)}
          />
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
          <UserManagement
            users={users}
            onRefresh={handleContentRefresh}
            onEdit={(user) => console.log('Editing user:', user)}
            onDelete={handleUserDelete}
            onToggleStatus={handleUserToggleStatus}
            onUpdateRole={handleUserRoleUpdate}
            currentUser={user}
          />
        );

      case 'search':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Search</h2>
            <p className="text-gray-600">Use the advanced search to find content, opportunities, and users across the platform.</p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-800 text-sm">
                🔍 <strong>Admin Search:</strong> Navigate to the dedicated search page for comprehensive search capabilities with advanced filters, user management, and analytics.
              </p>
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

      case 'complaints':
        return (
          <AdminComplaintList
            complaints={complaints}
            onRefresh={handleComplaintRefresh}
            onEdit={(complaint) => console.log('Viewing complaint:', complaint)}
            onDelete={handleComplaintDelete}
            onAssign={handleComplaintAssign}
            onStatusUpdate={handleComplaintStatusUpdate}
            users={users}
          />
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
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'search', label: 'Search', icon: Search },
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
