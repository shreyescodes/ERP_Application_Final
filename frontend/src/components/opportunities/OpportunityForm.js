import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Building, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const OpportunityForm = ({ opportunity = null, onSubmit, onCancel, mode = 'create' }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: opportunity?.title || '',
    description: opportunity?.description || '',
    company: opportunity?.company || '',
    location: opportunity?.location || '',
    type: opportunity?.type || '',
    category: opportunity?.category || '',
    requirements: opportunity?.requirements?.join(', ') || '',
    skills: opportunity?.skills?.join(', ') || '',
    salary: opportunity?.salary || '',
    duration: opportunity?.duration || '',
    applicationDeadline: opportunity?.applicationDeadline ? 
      new Date(opportunity.applicationDeadline).toISOString().split('T')[0] : '',
    startDate: opportunity?.startDate ? 
      new Date(opportunity.startDate).toISOString().split('T')[0] : '',
    tags: opportunity?.tags?.join(', ') || ''
  });
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const opportunityTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];
  const categories = ['Technology', 'Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Other'];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setPhoto(acceptedFiles[0]);
        toast.success(`Photo "${acceptedFiles[0].name}" selected`);
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        toast.error('Photo is too large. Maximum size is 10MB.');
      } else {
        toast.error('Only image files are allowed.');
      }
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.company || 
        !formData.location || !formData.type || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      if (photo) {
        formDataToSend.append('photo', photo);
      }

      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key].trim());
        }
      });

      const url = mode === 'edit' ? `/api/opportunities/${opportunity._id}` : '/api/opportunities';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      const result = await response.json();
      toast.success(result.message || `${mode === 'edit' ? 'Updated' : 'Created'} successfully!`);
      
      if (onSubmit) {
        onSubmit(result.data);
      }
      
    } catch (error) {
      console.error('Opportunity form error:', error);
      toast.error(error.message || 'Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    toast.success('Photo removed');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'edit' ? 'Edit Opportunity' : 'Create New Opportunity'}
        </h2>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Photo (Optional)
          </label>
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}>
            <input {...getInputProps()} />
            {photo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <img src={URL.createObjectURL(photo)} alt="Preview" className="h-16 w-16 object-cover rounded" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{photo.name}</div>
                    <div className="text-sm text-gray-500">{(photo.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>
                <button type="button" onClick={removePhoto} className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 bg-red-50 hover:bg-red-100 transition-colors">
                  <X size={16} className="mr-1" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isDragActive ? 'Drop the photo here' : 'Drag & drop a photo here'}
                  </p>
                  <p className="text-sm text-gray-500">or click to browse files</p>
                </div>
                <p className="text-xs text-gray-400">Max file size: 10MB • Supported: JPG, PNG, GIF, WebP</p>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} 
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                   placeholder="e.g., Software Engineer Intern" required />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} 
                      rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                      placeholder="Describe the opportunity..." required />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" id="company" name="company" value={formData.company} onChange={handleInputChange} 
                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                     placeholder="Company name" required />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} 
                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                     placeholder="City, State or Remote" required />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
            <select id="type" name="type" value={formData.type} onChange={handleInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" required>
              <option value="">Select type</option>
              {opportunityTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select id="category" name="category" value={formData.category} onChange={handleInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" required>
              <option value="">Select category</option>
              {categories.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
            <input type="text" id="salary" name="salary" value={formData.salary} onChange={handleInputChange} 
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                   placeholder="e.g., $50,000 - $70,000" />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleInputChange} 
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                   placeholder="e.g., 3 months, Permanent" />
          </div>

          <div>
            <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="date" id="applicationDeadline" name="applicationDeadline" value={formData.applicationDeadline} 
                     onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                     min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="date" id="startDate" name="startDate" value={formData.startDate} 
                     onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
            <textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleInputChange} 
                      rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                      placeholder="e.g., Bachelor's degree, 2+ years experience..." />
            <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <textarea id="skills" name="skills" value={formData.skills} onChange={handleInputChange} 
                      rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                      placeholder="e.g., JavaScript, React, Python..." />
            <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleInputChange} 
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                   placeholder="e.g., remote, entry-level, startup" />
            <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button type="button" onClick={onCancel} 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          )}
          <button type="submit" disabled={isSubmitting} 
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isSubmitting ? 'Submitting...' : (mode === 'edit' ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OpportunityForm;
