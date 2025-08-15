import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { ArrowLeft, Calendar, Plus, Edit, Trash2, Save, X, CheckCircle, Clock } from 'lucide-react';

const AcademicYear = ({ onBack }) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    startDate: '',
    endDate: '',
    isActive: false,
    description: ''
  });

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await apiService.getAcademicYears();
      setAcademicYears(response);
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingYear) {
        // Update existing year
        await apiService.updateAcademicYear(editingYear, formData);
      } else {
        // Add new year
        await apiService.createAcademicYear(formData);
      }
      
      await fetchAcademicYears();
      resetForm();
    } catch (error) {
      console.error('Error saving academic year:', error);
      alert('Error saving academic year: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      year: '',
      startDate: '',
      endDate: '',
      isActive: false,
      description: ''
    });
    setShowForm(false);
    setEditingYear(null);
  };

  const handleEdit = (year) => {
    setFormData({
      year: year.year,
      startDate: new Date(year.startDate).toISOString().split('T')[0],
      endDate: new Date(year.endDate).toISOString().split('T')[0],
      isActive: year.isActive,
      description: year.description
    });
    setEditingYear(year._id);
    setShowForm(true);
  };

  const handleDelete = async (yearId) => {
    if (confirm('Are you sure you want to delete this academic year?')) {
      try {
        await apiService.deleteAcademicYear(yearId);
        await fetchAcademicYears();
      } catch (error) {
        console.error('Error deleting academic year:', error);
        alert('Error deleting academic year: ' + error.message);
      }
    }
  };

  const handleSetActive = async (yearId) => {
    try {
      await apiService.updateAcademicYear(yearId, { isActive: true });
      await fetchAcademicYears();
    } catch (error) {
      console.error('Error setting active year:', error);
      alert('Error setting active year: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Academic Year Management</h1>
            <p className="text-gray-600">Manage academic years and sessions</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Academic Year
          </button>
        </div>
      </div>

      {/* Academic Years Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {academicYears.map((year) => (
          <div key={year._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar size={24} className="text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">{year.year}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {year.isActive ? (
                    <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      <CheckCircle size={12} className="mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      <Clock size={12} className="mr-1" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{new Date(year.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">{new Date(year.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{year.studentsCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Classes:</span>
                  <span className="font-medium">{year.classesCount}</span>
                </div>
              </div>

              {year.description && (
                <p className="text-sm text-gray-600 mb-4">{year.description}</p>
              )}

              <div className="flex gap-2">
                {!year.isActive && (
                  <button
                    onClick={() => handleSetActive(year._id)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    Set Active
                  </button>
                )}
                <button
                  onClick={() => handleEdit(year)}
                  className="flex-1 px-3 py-2 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(year._id)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors text-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {editingYear ? 'Edit Academic Year' : 'Add Academic Year'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g., 2024-25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Set as active academic year
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  {editingYear ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicYear;