import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { ArrowLeft, Save, Plus, Edit, Trash2 } from 'lucide-react';

const ClassForm = ({ classId, onBack, onSave }) => {
  const isEditing = Boolean(classId);

  const [formData, setFormData] = useState({
    name: '',
    grade: 1,
    academicYear: '2024-25',
    isActive: true,
  });

  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({ name: '', capacity: 30 });
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
useEffect(() => {
  const fetchActiveAcademicYear = async () => {
    try {
      const response = await apiService.getActiveAcademicYear(); // Should return something like { year: '2025-26' }
      if (response?.year && !isEditing) {
        setFormData(prev => ({
          ...prev,
          academicYear: response.year,
        }));
        console.log('Setting academic year to:', response.year);
      }
    } catch (error) {
      console.error('Error fetching active academic year:', error);
    }
  };

  fetchActiveAcademicYear();
}, [isEditing]);



  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Class name is required';
    if (formData.grade < 1 || formData.grade > 12) newErrors.grade = 'Grade must be between 1 and 12';
    if (sections.length === 0) newErrors.sections = 'At least one section is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const classData = {
        ...formData,
        sections
      };

      if (isEditing) {
        await apiService.updateClass(classId, classData);
      } else {
        await apiService.createClass(classData);
      }

      if (onSave) {
        onSave(classData);
      }

      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Error saving class: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               name === 'grade' ? parseInt(value) : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addSection = () => {
    if (!newSection.name.trim()) return;
    
    const section = {
      _id: generateId(),
      name: newSection.name.trim(),
      capacity: newSection.capacity
    };
    
    setSections(prev => [...prev, section]);
    setNewSection({ name: '', capacity: 30 });
    
    if (errors.sections) {
      setErrors(prev => ({ ...prev, sections: '' }));
    }
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };
  const updateSection = (index, updatedSection) => {
    setSections(prev => prev.map((section, i) => i === index ? updatedSection : section));
    setEditingSection(null);
  };

  const removeSection = (index) => {
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  const startEditingSection = (index) => {
    setEditingSection({ index, data: { ...sections[index] } });
  };

  const cancelEditingSection = () => {
    setEditingSection(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Classes
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {isEditing ? 'Edit Class' : 'Add New Class'}
        </h1>
        <p className="text-gray-600">
          {isEditing ? 'Update class information and sections' : 'Create a new class with sections'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Class Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Class Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Class Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., 1st Grade, Class 10"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.grade ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                    {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Year 
                    </label>
                    <input
  type="text"
  id="academicYear"
  name="academicYear"
  value={formData.academicYear}
  readOnly
  className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:ring-0 cursor-not-allowed"
/>

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections Management */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Sections</h2>
              </div>
              <div className="p-6">
                {/* Add New Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Section name (e.g., A, B, C)"
                      value={newSection.name}
                      onChange={(e) => setNewSection(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Capacity"
                      min="1"
                      max="100"
                      value={newSection.capacity}
                      onChange={(e) => setNewSection(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={addSection}
                      disabled={!newSection.name.trim()}
                      className="w-full flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Section
                    </button>
                  </div>
                </div>

                {errors.sections && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errors.sections}
                  </div>
                )}

                {/* Existing Sections */}
                {sections.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Section Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Capacity</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sections.map((section, index) => (
                          <tr key={section._id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              {editingSection?.index === index ? (
                                <input
                                  type="text"
                                  value={editingSection.data.name}
                                  onChange={(e) => setEditingSection(prev => prev ? {
                                    ...prev,
                                    data: { ...prev.data, name: e.target.value }
                                  } : null)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              ) : (
                                <span className="font-medium">{section.name}</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {editingSection?.index === index ? (
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={editingSection.data.capacity}
                                  onChange={(e) => setEditingSection(prev => prev ? {
                                    ...prev,
                                    data: { ...prev.data, capacity: parseInt(e.target.value) || 0 }
                                  } : null)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              ) : (
                                section.capacity
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {editingSection?.index === index ? (
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => updateSection(index, editingSection.data)}
                                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                  >
                                    <Save size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEditingSection}
                                    className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => startEditingSection(index)}
                                    className="px-2 py-1 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeSection(index)}
                                    className="px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    {isEditing ? 'Update Class' : 'Create Class'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Class Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border sticky top-6">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Class Summary</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="font-medium text-gray-700">Class Name:</span>
                <div className="text-gray-900">{formData.name || 'Not set'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Grade Level:</span>
                <div className="text-gray-900">{formData.grade}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Academic Year:</span>
                <div className="text-gray-900">{formData.academicYear}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    formData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Sections:</span>
                <div className="text-gray-900">{sections.length}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Capacity:</span>
                <div className="text-gray-900">
                  {sections.reduce((total, section) => total + (section.capacity || 0), 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassForm;