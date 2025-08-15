import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, DollarSign } from 'lucide-react';
import apiService from '../../services/api';

const FeeCategories = () => {
  const [feeCategories, setFeeCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fee Category Form State
  const [categoryForm, setCategoryForm] = useState({
    show: false,
    editing: null,
    data: {
      name: '',
      description: '',
      defaultAmount: '',
      isOptional: false,
      category: 'academic'
    }
  });

  useEffect(() => {
    fetchFeeCategories();
  }, []);

  const fetchFeeCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFeeCategories();
      setFeeCategories(response);
    } catch (error) {
      console.error('Error fetching fee categories:', error);
      setFeeCategories([]);
    } finally {
      setLoading(false);
    }
  };

const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

  const handleSaveCategory = async () => {
    try {
      const categoryData = {
        ...categoryForm.data,
        defaultAmount: parseFloat(categoryForm.data.defaultAmount)
      };
      
      if (categoryForm.editing) {
        const updatedCategory = await apiService.updateFeeCategory(categoryForm.editing, categoryData);
        setFeeCategories(prev => prev.map(cat => 
          cat._id === categoryForm.editing ? updatedCategory : cat
        ));
      } else {
        const newCategory = await apiService.createFeeCategory(categoryData);
        setFeeCategories(prev => [...prev, newCategory]);
      }
      
      setCategoryForm({ show: false, editing: null, data: {
        name: '', description: '', defaultAmount: '', isOptional: false, category: 'academic'
      }});
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category: ' + error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (confirm('Are you sure you want to delete this fee category?')) {
      try {
        await apiService.deleteFeeCategory(categoryId);
        setFeeCategories(prev => prev.filter(cat => cat._id !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Fee Categories</h2>
        <button
          onClick={() => setCategoryForm({ ...categoryForm, show: true })}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeCategories.map((category) => (
          <div key={category._id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCategoryForm({
                    show: true,
                    editing: category._id,
                    data: category
                  })}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteCategory(category._id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Default Amount:</span>
                <span className="font-semibold">{formatCurrency(category.defaultAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  category.isOptional ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {category.isOptional ? 'Optional' : 'Mandatory'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="text-sm font-medium capitalize">{category.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Form Modal */}
      {categoryForm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {categoryForm.editing ? 'Edit Fee Category' : 'Add Fee Category'}
                </h3>
                <button 
                  onClick={() => setCategoryForm({ ...categoryForm, show: false })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={categoryForm.data.name}
                  onChange={(e) => setCategoryForm({
                    ...categoryForm,
                    data: { ...categoryForm.data, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Tuition Fee"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={categoryForm.data.description}
                  onChange={(e) => setCategoryForm({
                    ...categoryForm,
                    data: { ...categoryForm.data, description: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Brief description of the fee"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Amount</label>
                <input
                  type="number"
                  value={categoryForm.data.defaultAmount}
                  onChange={(e) => setCategoryForm({
                    ...categoryForm,
                    data: { ...categoryForm.data, defaultAmount: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Type</label>
                <select
                  value={categoryForm.data.category}
                  onChange={(e) => setCategoryForm({
                    ...categoryForm,
                    data: { ...categoryForm.data, category: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="academic">Academic</option>
                  <option value="admission">Admission</option>
                  <option value="transport">Transport</option>
                  <option value="miscellaneous">Miscellaneous</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isOptional"
                  checked={categoryForm.data.isOptional}
                  onChange={(e) => setCategoryForm({
                    ...categoryForm,
                    data: { ...categoryForm.data, isOptional: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isOptional" className="ml-2 text-sm text-gray-700">
                  Optional Fee
                </label>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setCategoryForm({ ...categoryForm, show: false })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} className="mr-2" />
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeCategories;