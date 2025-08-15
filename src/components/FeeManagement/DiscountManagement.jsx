import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Users, Search } from 'lucide-react';
import apiService from '../../services/api';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [students, setStudents] = useState([]);
  const [feeCategories, setFeeCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Discount Form State
  const [discountForm, setDiscountForm] = useState({
    show: false,
    editing: null,
    data: {
      studentId: '',
      studentName: '',
      discountType: 'percentage',
      discountValue: '',
      feeTypes: [],
      reason: '',
      approvedBy: '',
      validFrom: '',
      validTo: ''
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch discounts
      const discountsResponse = await apiService.getDiscounts();
      setDiscounts(discountsResponse.discounts || []);
      
      // Fetch students for dropdown
      const studentsResponse = await apiService.getStudents({ limit: 100 });
      setStudents(studentsResponse.students || []);
      
      // Fetch fee categories
      const categoriesResponse = await apiService.getFeeCategories();
      setFeeCategories(categoriesResponse);
    } catch (error) {
      console.error('Error fetching discount data:', error);
      setDiscounts([]);
      setStudents([]);
      setFeeCategories([]);
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

  const handleSaveDiscount = async () => {
    try {
      // Find selected student
      const selectedStudent = students.find(s => s._id === discountForm.data.studentId);
      if (!selectedStudent) {
        alert('Please select a student');
        return;
      }

      const discountData = {
        ...discountForm.data,
        studentName: selectedStudent.name,
        discountValue: parseFloat(discountForm.data.discountValue)
      };
      
      if (discountForm.editing) {
        const updatedDiscount = await apiService.updateDiscount(discountForm.editing, discountData);
        setDiscounts(prev => prev.map(disc => 
          disc._id === discountForm.editing ? updatedDiscount : disc
        ));
      } else {
        const newDiscount = await apiService.createDiscount(discountData);
        setDiscounts(prev => [...prev, newDiscount]);
      }
      
      setDiscountForm({ show: false, editing: null, data: {
        studentId: '', studentName: '', discountType: 'percentage',
        discountValue: '', feeTypes: [], reason: '', approvedBy: '',
        validFrom: '', validTo: ''
      }});
    } catch (error) {
      console.error('Error saving discount:', error);
      alert('Error saving discount: ' + error.message);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      try {
        await apiService.deleteDiscount(discountId);
        setDiscounts(prev => prev.filter(disc => disc._id !== discountId));
      } catch (error) {
        console.error('Error deleting discount:', error);
        alert('Error deleting discount: ' + error.message);
      }
    }
  };

  const handleFeeTypeToggle = (categoryId) => {
    const currentFeeTypes = discountForm.data.feeTypes;
    const updatedFeeTypes = currentFeeTypes.includes(categoryId)
      ? currentFeeTypes.filter(id => id !== categoryId)
      : [...currentFeeTypes, categoryId];
    
    setDiscountForm({
      ...discountForm,
      data: { ...discountForm.data, feeTypes: updatedFeeTypes }
    });
  };

  const filteredDiscounts = discounts.filter(discount =>
    discount.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discount.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h2 className="text-xl font-semibold">Discounts & Concessions</h2>
        <button
          onClick={() => setDiscountForm({ ...discountForm, show: true })}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Discount
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="relative max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search discounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Student</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Discount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Applied To</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Reason</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Valid Period</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.map((discount) => (
                <tr key={discount._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">
                    <div>
                      <div className="font-semibold">{discount.studentName}</div>
                      <div className="text-sm text-gray-600">
                        {discount.studentId?.admissionNumber || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <span className="font-semibold">
                      {discount.discountType === 'percentage' ? 
                        `${discount.discountValue}%` : 
                        formatCurrency(discount.discountValue)
                      }
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex flex-wrap gap-1">
                      {discount.feeTypes.map((feeType) => (
                        <span key={feeType._id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {feeType.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <div>
                      <div className="text-sm">{discount.reason}</div>
                      <div className="text-xs text-gray-500">By: {discount.approvedBy}</div>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <div className="text-sm">
                      <div>{new Date(discount.validFrom).toLocaleDateString()}</div>
                      <div className="text-gray-500">to {new Date(discount.validTo).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDiscountForm({
                          show: true,
                          editing: discount._id,
                          data: {
                            ...discount,
                            feeTypes: discount.feeTypes.map(ft => ft._id)
                          }
                        })}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteDiscount(discount._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discount Form Modal */}
      {discountForm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {discountForm.editing ? 'Edit Discount' : 'Add Discount'}
                </h3>
                <button 
                  onClick={() => setDiscountForm({ ...discountForm, show: false })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                  <select
                    value={discountForm.data.studentId}
                    onChange={(e) => setDiscountForm({
                      ...discountForm,
                      data: { ...discountForm.data, studentId: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.admissionNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select
                    value={discountForm.data.discountType}
                    onChange={(e) => setDiscountForm({
                      ...discountForm,
                      data: { ...discountForm.data, discountType: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount {discountForm.data.discountType === 'percentage' ? 'Percentage' : 'Amount'}
                  </label>
                  <input
                    type="number"
                    value={discountForm.data.discountValue}
                    onChange={(e) => setDiscountForm({
                      ...discountForm,
                      data: { ...discountForm.data, discountValue: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={discountForm.data.discountType === 'percentage' ? '10' : '1000'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Approved By</label>
                  <input
                    type="text"
                    value={discountForm.data.approvedBy}
                    onChange={(e) => setDiscountForm({
                      ...discountForm,
                      data: { ...discountForm.data, approvedBy: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Principal, Admin, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  value={discountForm.data.reason}
                  onChange={(e) => setDiscountForm({
                    ...discountForm,
                    data: { ...discountForm.data, reason: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Reason for discount (e.g., Merit Scholarship, Financial Aid)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
                  <input
                    type="date"
                    value={discountForm.data.validFrom}
                    onChange={(e) => setDiscountForm({
                      ...discountForm,
                      data: { ...discountForm.data, validFrom: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid To</label>
                  <input
                    type="date"
                    value={discountForm.data.validTo}
                    onChange={(e) => setDiscountForm({
                      ...discountForm,
                      data: { ...discountForm.data, validTo: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apply to Fee Types</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {feeCategories.map(category => (
                    <div key={category._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`fee-${category._id}`}
                        checked={discountForm.data.feeTypes.includes(category._id)}
                        onChange={() => handleFeeTypeToggle(category._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`fee-${category._id}`} className="ml-2 text-sm text-gray-700">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setDiscountForm({ ...discountForm, show: false })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDiscount}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} className="mr-2" />
                Save Discount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagement;