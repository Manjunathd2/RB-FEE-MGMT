import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Settings } from 'lucide-react';
import apiService from '../../services/api';

const FeeStructures = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [feeCategories, setFeeCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fee Structure Form State
  const [structureForm, setStructureForm] = useState({
    show: false,
    editing: null,
    data: {
      name: '',
      class: '',
      academicYear: '2024-25',
      feeTypes: [],
      paymentPeriod: 'annually',
      lateFeeType: 'fixed',
      lateFeeAmount: 0,
      isActive: true
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch fee categories
      const categoriesResponse = await apiService.getFeeCategories();
      setFeeCategories(categoriesResponse);
      
      // Fetch fee structures
      const structuresResponse = await apiService.getFeeStructures();
      setFeeStructures(structuresResponse);
    } catch (error) {
      console.error('Error fetching fee structure data:', error);
      setFeeCategories([]);
      setFeeStructures([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getCategoryName = (categoryId) => {
    const category = feeCategories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const handleSaveStructure = async () => {
    try {
      if (structureForm.editing) {
        const updatedStructure = await apiService.updateFeeStructure(structureForm.editing, structureForm.data);
        setFeeStructures(prev => prev.map(struct => 
          struct._id === structureForm.editing ? updatedStructure : struct
        ));
      } else {
        const newStructure = await apiService.createFeeStructure(structureForm.data);
        setFeeStructures(prev => [...prev, newStructure]);
      }
      
      setStructureForm({ show: false, editing: null, data: {
        name: '', class: '', academicYear: '2024-25', feeTypes: [],
        paymentPeriod: 'annually', lateFeeType: 'fixed',
        lateFeeAmount: 0, isActive: true
      }});
    } catch (error) {
      console.error('Error saving structure:', error);
      alert('Error saving structure: ' + error.message);
    }
  };

  const handleDeleteStructure = async (structureId) => {
    if (confirm('Are you sure you want to delete this fee structure?')) {
      try {
        await apiService.deleteFeeStructure(structureId);
        setFeeStructures(prev => prev.filter(struct => struct._id !== structureId));
      } catch (error) {
        console.error('Error deleting structure:', error);
        alert('Error deleting structure: ' + error.message);
      }
    }
  };

  const addFeeType = () => {
    const newFeeType = {
      categoryId: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0]
    };
    setStructureForm({
      ...structureForm,
      data: {
        ...structureForm.data,
        feeTypes: [...structureForm.data.feeTypes, newFeeType]
      }
    });
  };

  const updateFeeType = (index, field, value) => {
    const updatedFeeTypes = [...structureForm.data.feeTypes];
    updatedFeeTypes[index][field] = field === 'amount' ? parseFloat(value) || 0 : value;
    setStructureForm({
      ...structureForm,
      data: {
        ...structureForm.data,
        feeTypes: updatedFeeTypes
      }
    });
  };

  const removeFeeType = (index) => {
    const updatedFeeTypes = structureForm.data.feeTypes.filter((_, i) => i !== index);
    setStructureForm({
      ...structureForm,
      data: {
        ...structureForm.data,
        feeTypes: updatedFeeTypes
      }
    });
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
        <h2 className="text-xl font-semibold">Fee Structures</h2>
        <button
          onClick={() => setStructureForm({ ...structureForm, show: true })}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Structure
        </button>
      </div>

      <div className="space-y-4">
        {feeStructures.map((structure) => (
          <div key={structure._id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{structure.name}</h3>
                  <p className="text-sm text-gray-600">
                    Class: {structure.class} | Academic Year: {structure.academicYear}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    structure.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {structure.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStructureForm({
                        show: true,
                        editing: structure._id,
                        data: structure
                      })}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteStructure(structure._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Fee Components</h4>
                  <div className="space-y-2">
                    {structure.feeTypes.map((fee, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{getCategoryName(fee.categoryId)}</span>
                        <span className="font-semibold">{formatCurrency(fee.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Structure Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Period:</span>
                      <span className="capitalize">{structure.paymentPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Late Fee:</span>
                      <span>
                        {structure.lateFeeType === 'percentage' ? 
                          `${structure.lateFeeAmount}%` : 
                          formatCurrency(structure.lateFeeAmount)
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold text-lg">
                        {formatCurrency(structure.feeTypes.reduce((sum, fee) => sum + fee.amount, 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Structure Form Modal */}
      {structureForm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {structureForm.editing ? 'Edit Fee Structure' : 'Add Fee Structure'}
                </h3>
                <button 
                  onClick={() => setStructureForm({ ...structureForm, show: false })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Structure Name</label>
                  <input
                    type="text"
                    value={structureForm.data.name}
                    onChange={(e) => setStructureForm({
                      ...structureForm,
                      data: { ...structureForm.data, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 10th Grade Fee Structure"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={structureForm.data.class}
                    onChange={(e) => setStructureForm({
                      ...structureForm,
                      data: { ...structureForm.data, class: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Class</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                      <option key={grade} value={`${grade}th Grade`}>{grade}th Grade</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <select
                    value={structureForm.data.academicYear}
                    onChange={(e) => setStructureForm({
                      ...structureForm,
                      data: { ...structureForm.data, academicYear: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2023-24">2023-24</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Period</label>
                  <select
                    value={structureForm.data.paymentPeriod}
                    onChange={(e) => setStructureForm({
                      ...structureForm,
                      data: { ...structureForm.data, paymentPeriod: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>

              {/* Fee Types */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Fee Components</h4>
                  <button
                    type="button"
                    onClick={addFeeType}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Fee Type
                  </button>
                </div>
                
                <div className="space-y-3">
                  {structureForm.data.feeTypes.map((feeType, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-lg">
                      <div>
                        <select
                          value={feeType.categoryId}
                          onChange={(e) => updateFeeType(index, 'categoryId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Fee Category</option>
                          {feeCategories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Amount"
                          value={feeType.amount}
                          onChange={(e) => updateFeeType(index, 'amount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          value={feeType.dueDate}
                          onChange={(e) => updateFeeType(index, 'dueDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => removeFeeType(index)}
                          className="w-full px-3 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Late Fee Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee Type</label>
                  <select
                    value={structureForm.data.lateFeeType}
                    onChange={(e) => setStructureForm({
                      ...structureForm,
                      data: { ...structureForm.data, lateFeeType: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Late Fee {structureForm.data.lateFeeType === 'percentage' ? 'Percentage' : 'Amount'}
                  </label>
                  <input
                    type="number"
                    value={structureForm.data.lateFeeAmount}
                    onChange={(e) => setStructureForm({
                      ...structureForm,
                      data: { ...structureForm.data, lateFeeAmount: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={structureForm.data.lateFeeType === 'percentage' ? '5' : '100'}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="structureActive"
                  checked={structureForm.data.isActive}
                  onChange={(e) => setStructureForm({
                    ...structureForm,
                    data: { ...structureForm.data, isActive: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="structureActive" className="ml-2 text-sm text-gray-700">
                  Active Structure
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setStructureForm({ ...structureForm, show: false })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStructure}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} className="mr-2" />
                Save Structure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructures;