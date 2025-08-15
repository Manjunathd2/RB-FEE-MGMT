import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { ArrowLeft, Target, DollarSign, Users, CheckCircle, AlertTriangle, Download } from 'lucide-react';

const FeeBalanceCarryForward = ({ onBack }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [carryForwardData, setCarryForwardData] = useState({
    fromYear: '2024-25',
    toYear: '2025-26',
    carryForwardDate: new Date().toISOString().split('T')[0],
    adjustmentType: 'advance', // 'advance' or 'due'
    remarks: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentsWithBalances();
  }, []);

  const fetchStudentsWithBalances = async () => {
    try {
      const response = await apiService.getStudentsWithBalances({
        balanceType: carryForwardData.adjustmentType
      });
      
      // Map API response to component format
      const studentsWithBalances = response.map(student => ({
        id: student._id,
        name: student.name,
        admissionNumber: student.admissionNumber,
        class: student.class,
        section: student.section,
        totalFee: student.totalFee,
        paidAmount: student.paidAmount,
        balance: student.balance,
        balanceType: student.balanceType,
        parentName: student.parentName,
        lastPaymentDate: student.lastPaymentDate
      }));
      
      setStudents(studentsWithBalances);
    } catch (error) {
      console.error('Error fetching students with balances:', error);
    }
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    const filteredStudents = students.filter(student => 
      carryForwardData.adjustmentType === 'advance' 
        ? student.balanceType === 'advance'
        : student.balanceType === 'due'
    );
    
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
  };

  const handleCarryForward = async () => {
    if (selectedStudents.length === 0) {
      alert('Please select students for balance carry forward');
      return;
    }

    const selectedStudentData = students.filter(student => selectedStudents.includes(student.id));
    const totalAmount = selectedStudentData.reduce((sum, student) => sum + Math.abs(student.balance), 0);

    if (!confirm(`Are you sure you want to carry forward balances for ${selectedStudents.length} students? Total amount: ₹${totalAmount.toLocaleString()}`)) {
      return;
    }

    setLoading(true);
    
    try {
      await apiService.carryForwardBalances({
        studentIds: selectedStudents,
        fromYear: carryForwardData.fromYear,
        toYear: carryForwardData.toYear,
        carryForwardDate: carryForwardData.carryForwardDate,
        remarks: carryForwardData.remarks
      });

      setSelectedStudents([]);
      await fetchStudentsWithBalances();
      alert(`Successfully carried forward balances for ${selectedStudents.length} students!`);
    } catch (error) {
      console.error('Error carrying forward balances:', error);
      alert('Error carrying forward balances. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const selectedStudentData = students.filter(student => selectedStudents.includes(student.id));
    console.log('Generating carry forward report for:', selectedStudentData);
    // Implement report generation
  };

  const formatCurrency = (amount) => {
    return `₹${Math.abs(amount).toLocaleString()}`;
  };

  const getBalanceColor = (balanceType) => {
    return balanceType === 'advance' ? 'text-green-600' : 'text-red-600';
  };

  const getBalanceIcon = (balanceType) => {
    return balanceType === 'advance' ? CheckCircle : AlertTriangle;
  };

  const filteredStudents = students.filter(student => 
    carryForwardData.adjustmentType === 'advance' 
      ? student.balanceType === 'advance'
      : student.balanceType === 'due'
  );

  const totalCarryForwardAmount = filteredStudents
    .filter(student => selectedStudents.includes(student.id))
    .reduce((sum, student) => sum + Math.abs(student.balance), 0);

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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Fee Balance Carry Forward</h1>
            <p className="text-gray-600">Carry forward student fee balances to next academic year</p>
          </div>
          <div className="flex items-center space-x-2">
            <Target size={24} className="text-purple-600" />
            <span className="text-lg font-semibold text-purple-600">Balance Management</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-green-200 rounded-lg shadow-sm p-6 text-center">
          <CheckCircle size={32} className="text-green-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-green-600">
            {students.filter(s => s.balanceType === 'advance').length}
          </h3>
          <p className="text-gray-600">Advance Payments</p>
        </div>
        <div className="bg-white border border-red-200 rounded-lg shadow-sm p-6 text-center">
          <AlertTriangle size={32} className="text-red-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-red-600">
            {students.filter(s => s.balanceType === 'due').length}
          </h3>
          <p className="text-gray-600">Due Amounts</p>
        </div>
        <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-6 text-center">
          <Users size={32} className="text-blue-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-blue-600">{selectedStudents.length}</h3>
          <p className="text-gray-600">Selected Students</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg shadow-sm p-6 text-center">
          <DollarSign size={32} className="text-purple-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-purple-600">{formatCurrency(totalCarryForwardAmount)}</h3>
          <p className="text-gray-600">Total Amount</p>
        </div>
      </div>

      {/* Carry Forward Settings */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Carry Forward Settings</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Academic Year</label>
              <input
                type="text"
                value={carryForwardData.fromYear}
                onChange={(e) => setCarryForwardData({ ...carryForwardData, fromYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Academic Year</label>
              <input
                type="text"
                value={carryForwardData.toYear}
                onChange={(e) => setCarryForwardData({ ...carryForwardData, toYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Carry Forward Date</label>
              <input
                type="date"
                value={carryForwardData.carryForwardDate}
                onChange={(e) => setCarryForwardData({ ...carryForwardData, carryForwardDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Balance Type</label>
              <select
                value={carryForwardData.adjustmentType}
                onChange={(e) => setCarryForwardData({ ...carryForwardData, adjustmentType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="advance">Advance Payments</option>
                <option value="due">Due Amounts</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
            <textarea
              value={carryForwardData.remarks}
              onChange={(e) => setCarryForwardData({ ...carryForwardData, remarks: e.target.value })}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional remarks for carry forward..."
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSelectAll}
              className="flex items-center px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <CheckCircle size={16} className="mr-2" />
              Select All {carryForwardData.adjustmentType === 'advance' ? 'Advance' : 'Due'} Balances
            </button>
            <button
              onClick={generateReport}
              disabled={selectedStudents.length === 0}
              className="flex items-center px-4 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
            >
              <Download size={16} className="mr-2" />
              Generate Report
            </button>
            <button
              onClick={handleCarryForward}
              disabled={selectedStudents.length === 0 || loading}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Target size={16} className="mr-2" />
                  Carry Forward Selected ({selectedStudents.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            Students with {carryForwardData.adjustmentType === 'advance' ? 'Advance' : 'Due'} Balances ({filteredStudents.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Select</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Student Details</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Class</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Fee Summary</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Balance</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Last Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const BalanceIcon = getBalanceIcon(student.balanceType);
                return (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentSelection(student.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.admissionNumber}</div>
                        <div className="text-sm text-gray-500">{student.parentName}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {student.class} - {student.section}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div>Total Fee: {formatCurrency(student.totalFee)}</div>
                        <div>Paid: {formatCurrency(student.paidAmount)}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <BalanceIcon size={16} className={`mr-2 ${getBalanceColor(student.balanceType)}`} />
                        <span className={`font-semibold ${getBalanceColor(student.balanceType)}`}>
                          {formatCurrency(student.balance)}
                          <div className="text-xs text-gray-500">
                            {student.balanceType === 'advance' ? 'Advance' : 'Due'}
                          </div>
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {new Date(student.lastPaymentDate).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Target size={48} className="text-gray-400 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Balances Found</h3>
          <p className="text-gray-600">
            No students have {carryForwardData.adjustmentType === 'advance' ? 'advance payments' : 'due amounts'} to carry forward.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeeBalanceCarryForward;