import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, DollarSign, CreditCard, Calendar, User, Receipt } from 'lucide-react';
import apiService from '../services/api';

const CollectFee = ({ onBack }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'cash',
    description: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedClass, selectedSection, students]);

  const fetchStudents = async () => {
    try {
      const response = await apiService.getStudents({ limit: 100 });
      const studentsWithStatus = response.students.map(student => ({
        ...student,
        status: student.pendingAmount === 0 ? 'paid' : 
               student.paidAmount > 0 ? 'partial' : 'unpaid',
        lastPaymentDate: student.updatedAt // Mock last payment date
      }));
      
      setStudents(studentsWithStatus);
      setFilteredStudents(studentsWithStatus);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(student => student.class === selectedClass);
    }

    if (selectedSection) {
      filtered = filtered.filter(student => student.section === selectedSection);
    }

    setFilteredStudents(filtered);
  };

  const handleCollectFee = (student) => {
    setSelectedStudent(student);
    setPaymentData({
      amount: student.pendingAmount.toString(),
      method: 'cash',
      description: `Fee payment for ${student.name}`,
      dueDate: new Date().toISOString().split('T')[0]
    });
    setPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentData = {
        studentId: selectedStudent._id,
        feeDetails: [{ feeType: 'Fee Payment', amount: parseInt(paymentData.amount) }],
        totalAmount: parseInt(paymentData.amount),
        paymentMethod: paymentData.method,
        remarks: paymentData.description,
        collectedBy: 'Admin User'
      };
      
      const response = await apiService.createPayment(paymentData);
      
      // Update student payment status
      const updatedStudents = students.map(student => {
        if (student._id === selectedStudent._id) {
          const newPaidAmount = student.paidAmount + parseInt(paymentData.amount);
          const newPendingAmount = student.totalFee - newPaidAmount;
          return {
            ...student,
            paidAmount: newPaidAmount,
            pendingAmount: newPendingAmount,
            lastPaymentDate: new Date().toISOString().split('T')[0],
            status: newPendingAmount === 0 ? 'paid' : 'partial'
          };
        }
        return student;
      });

      setStudents(updatedStudents);
      setPaymentModal(false);
      setSelectedStudent(null);
      setPaymentData({ amount: '', method: 'cash', description: '', dueDate: '' });
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { class: 'bg-green-100 text-green-800', label: 'Paid' },
      partial: { class: 'bg-yellow-100 text-yellow-800', label: 'Partial' },
      unpaid: { class: 'bg-red-100 text-red-800', label: 'Unpaid' }
    };
    return statusConfig[status] || statusConfig.unpaid;
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Collect Fee</h1>
            <p className="text-gray-600">Process fee payments from students</p>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard size={24} className="text-green-600" />
            <span className="text-lg font-semibold text-green-600">Fee Collection</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Student</label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name or Admission No."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Classes</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Students ({filteredStudents.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Student Details</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Class/Section</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Fee Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Last Payment</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const statusConfig = getStatusBadge(student.status);
                return (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
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
                      <div className="space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                          {statusConfig.label}
                        </span>
                        <div className="text-sm">
                          <div>Total: {formatCurrency(student.totalFee)}</div>
                          <div>Paid: {formatCurrency(student.paidAmount)}</div>
                          <div className="font-semibold text-red-600">
                            Pending: {formatCurrency(student.pendingAmount)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        {student.lastPaymentDate ? 
                          new Date(student.lastPaymentDate).toLocaleDateString() : 
                          'No payment yet'
                        }
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {student.pendingAmount > 0 ? (
                        <button
                          onClick={() => handleCollectFee(student)}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <DollarSign size={16} className="mr-2" />
                          Collect Fee
                        </button>
                      ) : (
                        <span className="text-green-600 font-medium">Fully Paid</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Collect Fee Payment</h3>
                <button 
                  onClick={() => setPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-6">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <User size={20} className="text-gray-500 mr-2" />
                  <span className="font-semibold">{selectedStudent.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Admission No: {selectedStudent.admissionNumber}</div>
                  <div>Class: {selectedStudent.class} - {selectedStudent.section}</div>
                  <div>Pending Amount: {formatCurrency(selectedStudent.pendingAmount)}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                    max={selectedStudent.pendingAmount}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="card">Card Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={paymentData.description}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Receipt size={16} className="mr-2" />
                      Collect Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectFee;