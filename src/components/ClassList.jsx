import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, Trash2, Users, GraduationCap, ArrowLeft } from 'lucide-react';
import apiService from '../services/api';

const ClassList = ({ onViewClass, onEditClass, onAddClass, onBackToDashboard, isAdmin = true }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    classId: '',
    className: ''
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getClasses();
      setClasses(response);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId) => {
    try {
      await apiService.deleteClass(classId);
      setClasses(classes.filter(cls => cls._id !== classId));
      setDeleteModal({ show: false, classId: '', className: '' });
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const getTotalCapacity = (classData) => {
    return classData.sections.reduce((total, section) => total + (section.capacity || 0), 0);
  };

  const handleViewClass = (classId) => {
    if (onViewClass) {
      onViewClass(classId);
    }
  };

  const handleEditClass = (classId) => {
    console.log('Editing class:', classId);
    if (onEditClass) {
      onEditClass(classId);
    } else {
      console.error('onEditClass callback not provided');
    }
  };

  const handleAddClass = () => {
    console.log('Adding new class');
    if (onAddClass) {
      onAddClass();
    } else {
      console.error('onAddClass callback not provided');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={onBackToDashboard}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Class Management</h1>
            <p className="text-gray-600">Manage classes and sections for Academic Year 2024-25</p>
          </div>
          {isAdmin && (
            <button 
              onClick={handleAddClass}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Class
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classData) => (
          <div key={classData._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <div className="flex items-center">
                <GraduationCap size={24} className="text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">{classData.name}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                classData.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {classData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-blue-600">{classData.sections.length}</h4>
                  <p className="text-sm text-gray-600">Sections</p>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-cyan-600">{getTotalCapacity(classData)}</h4>
                  <p className="text-sm text-gray-600">Total Capacity</p>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="text-sm font-medium text-gray-700 mb-2">Sections:</h6>
                <div className="flex flex-wrap gap-1">
                  {classData.sections.map((section) => (
                    <span key={section._id} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {section.name} ({section.capacity || 0})
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <div>Academic Year: {classData.academicYear}</div>
                <div>Created: {new Date(classData.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-b-lg">
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewClass(classData._id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm"
                  title="View Details"
                >
                  <Eye size={16} className="mr-1" />
                  View
                </button>
                {isAdmin && (
                  <>
                    <button 
                      onClick={() => handleEditClass(classData._id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors text-sm"
                      title="Edit Class"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors text-sm"
                      onClick={() => setDeleteModal({
                        show: true,
                        classId: classData._id,
                        className: classData.name
                      })}
                      title="Delete Class"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap size={64} className="text-gray-400 mb-4 mx-auto" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Classes Found</h3>
          <p className="text-gray-600 mb-6">Start by creating your first class to organize students.</p>
          {isAdmin && (
            <button 
              onClick={handleAddClass}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus size={20} className="mr-2" />
              Create First Class
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <button 
                  onClick={() => setDeleteModal({ show: false, classId: '', className: '' })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the class <strong>{deleteModal.className}</strong>?
              </p>
              <p className="text-red-600 text-sm">
                <strong>Warning:</strong> This action cannot be undone. All sections and associated data will be removed.
              </p>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button 
                onClick={() => setDeleteModal({ show: false, classId: '', className: '' })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteModal.classId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassList;