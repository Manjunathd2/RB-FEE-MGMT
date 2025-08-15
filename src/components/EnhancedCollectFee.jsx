import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, DollarSign, CreditCard, Calendar, User, Receipt, FileText, Printer } from 'lucide-react';

const EnhancedCollectFee = ({ onBack }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [receiptModal, setReceiptModal] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState(null);
  const [paymentData, setPaymentData] = useState({
    feeBreakdown: [],
    totalAmount: 0,
    paymentAmount: '',
    method: 'cash',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, students]);

  const fetchStudents = () => {
    // Enhanced mock student data with detailed fee breakdown
    const mockStudents = [
      {
        _id: '1',
        name: 'John Smith',
        admissionNumber: 'ADM001',
        class: '10th',
        section: 'A',
        parentName: 'Robert Smith',
        parentPhone: '+1234567890',
        feeStructure: {
          tuitionFee: { amount: 6000, paid: 3000, due: 3000, dueDate: '2024-12-31' },
          libraryFee: { amount: 1500, paid: 1500, due: 0, dueDate: '2024-12-15' },
          labFee: { amount: 3500, paid: 0, due: 3500, dueDate: '2024-12-20' },
          examFee: { amount: 1200, paid: 0, due: 1200, dueDate: '2024-12-25' }
        },
        totalFee: 12200,
        paidAmount: 4500,
        pendingAmount: 7700,
        overpaidAmount: 0,
        lastPaymentDate: '2024-11-15',
        paymentHistory: [
          { date: '2024-11-15', amount: 3000, method: 'Cash', feeType: 'Tuition Fee', receiptNo: 'RCP001' },
          { date: '2024-10-20', amount: 1500, method: 'Online', feeType: 'Library Fee', receiptNo: 'RCP002' }
        ]
      },
      {
        _id: '2',
        name: 'Emily Johnson',
        admissionNumber: 'ADM002',
        class: '9th',
        section: 'B',
        parentName: 'Michael Johnson',
        parentPhone: '+1234567891',
        feeStructure: {
          tuitionFee: { amount: 5500, paid: 5500, due: 0, dueDate: '2024-12-31' },
          libraryFee: { amount: 1200, paid: 1200, due: 0, dueDate: '2024-12-15' },
          transportFee: { amount: 2000, paid: 1000, due: 1000, dueDate: '2024-12-30' }
        },
        totalFee: 8700,
        paidAmount: 7700,
        pendingAmount: 1000,
        overpaidAmount: 0,
        lastPaymentDate: '2024-12-01',
        paymentHistory: [
          { date: '2024-12-01', amount: 5500, method: 'Online', feeType: 'Tuition Fee', receiptNo: 'RCP003' },
          { date: '2024-11-10', amount: 1200, method: 'Cash', feeType: 'Library Fee', receiptNo: 'RCP004' },
          { date: '2024-10-15', amount: 1000, method: 'Cheque', feeType: 'Transport Fee', receiptNo: 'RCP005' }
        ]
      }
    ];
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  };

  const filterStudents = () => {
    let filtered = students;
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredStudents(filtered);
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    
    // Prepare fee breakdown for payment
    const feeBreakdown = Object.entries(student.feeStructure).map(([feeType, details]) => ({
      feeType: feeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      amount: details.amount,
      paid: details.paid,
      due: details.due,
      dueDate: details.dueDate,
      selected: details.due > 0,
      payAmount: details.due
    }));

    setPaymentData({
      feeBreakdown,
      totalAmount: feeBreakdown.reduce((sum, fee) => sum + (fee.selected ? fee.payAmount : 0), 0),
      paymentAmount: student.pendingAmount.toString(),
      method: 'cash',
      remarks: '',
      date: new Date().toISOString().split('T')[0]
    });
    setPaymentModal(true);
  };

  const handleFeeSelection = (index, field, value) => {
    const updatedBreakdown = [...paymentData.feeBreakdown];
    updatedBreakdown[index][field] = value;
    
    if (field === 'selected') {
      if (!value) {
        updatedBreakdown[index].payAmount = 0;
      } else {
        updatedBreakdown[index].payAmount = updatedBreakdown[index].due;
      }
    }

    const totalAmount = updatedBreakdown.reduce((sum, fee) => 
      sum + (fee.selected ? fee.payAmount : 0), 0
    );

    setPaymentData({
      ...paymentData,
      feeBreakdown: updatedBreakdown,
      totalAmount,
      paymentAmount: totalAmount.toString()
    });
  };

  const generateReceiptNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RCP${timestamp}${random}`;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const receiptNumber = generateReceiptNumber();
      const paidFees = paymentData.feeBreakdown.filter(fee => fee.selected && fee.payAmount > 0);
      
      const receipt = {
        receiptNumber,
        date: paymentData.date,
        student: selectedStudent,
        paidFees,
        totalPaid: paymentData.totalAmount,
        paymentMethod: paymentData.method,
        remarks: paymentData.remarks,
        remainingBalance: selectedStudent.pendingAmount - paymentData.totalAmount,
        schoolInfo: {
          name: 'Greenwood International School',
          address: '123 Education Street, Knowledge City',
          phone: '+1-234-567-8900',
          email: 'info@greenwood.edu'
        }
      };

      // Update student payment status
      const updatedStudents = students.map(student => {
        if (student._id === selectedStudent._id) {
          const updatedFeeStructure = { ...student.feeStructure };
          paidFees.forEach(fee => {
            const feeKey = fee.feeType.toLowerCase().replace(/\s+/g, '');
            if (updatedFeeStructure[feeKey]) {
              updatedFeeStructure[feeKey].paid += fee.payAmount;
              updatedFeeStructure[feeKey].due -= fee.payAmount;
            }
          });

          return {
            ...student,
            feeStructure: updatedFeeStructure,
            paidAmount: student.paidAmount + paymentData.totalAmount,
            pendingAmount: student.pendingAmount - paymentData.totalAmount,
            lastPaymentDate: paymentData.date,
            paymentHistory: [
              ...student.paymentHistory,
              ...paidFees.map(fee => ({
                date: paymentData.date,
                amount: fee.payAmount,
                method: paymentData.method,
                feeType: fee.feeType,
                receiptNo: receiptNumber
              }))
            ]
          };
        }
        return student;
      });

      setStudents(updatedStudents);
      setGeneratedReceipt(receipt);
      setPaymentModal(false);
      setReceiptModal(true);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    const receiptHTML = generateReceiptHTML(generatedReceipt);
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const generateReceiptHTML = (receipt) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Receipt - ${receipt.receiptNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .school-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .school-details { font-size: 12px; color: #666; }
          .receipt-title { font-size: 18px; font-weight: bold; margin: 20px 0; text-align: center; }
          .receipt-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .student-info, .payment-info { width: 48%; }
          .info-row { margin-bottom: 5px; }
          .label { font-weight: bold; }
          .fee-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .fee-table th, .fee-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .fee-table th { background-color: #f5f5f5; }
          .total-row { font-weight: bold; background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: right; }
          .signature { margin-top: 50px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">${receipt.schoolInfo.name}</div>
          <div class="school-details">
            ${receipt.schoolInfo.address}<br>
            Phone: ${receipt.schoolInfo.phone} | Email: ${receipt.schoolInfo.email}
          </div>
        </div>
        
        <div class="receipt-title">FEE PAYMENT RECEIPT</div>
        
        <div class="receipt-info">
          <div class="student-info">
            <div class="info-row"><span class="label">Receipt No:</span> ${receipt.receiptNumber}</div>
            <div class="info-row"><span class="label">Date:</span> ${new Date(receipt.date).toLocaleDateString()}</div>
            <div class="info-row"><span class="label">Student Name:</span> ${receipt.student.name}</div>
            <div class="info-row"><span class="label">Admission No:</span> ${receipt.student.admissionNumber}</div>
            <div class="info-row"><span class="label">Class:</span> ${receipt.student.class} - ${receipt.student.section}</div>
          </div>
          <div class="payment-info">
            <div class="info-row"><span class="label">Parent Name:</span> ${receipt.student.parentName}</div>
            <div class="info-row"><span class="label">Contact:</span> ${receipt.student.parentPhone}</div>
            <div class="info-row"><span class="label">Payment Method:</span> ${receipt.paymentMethod}</div>
            <div class="info-row"><span class="label">Remaining Balance:</span> ₹${receipt.remainingBalance.toLocaleString()}</div>
          </div>
        </div>
        
        <table class="fee-table">
          <thead>
            <tr>
              <th>Fee Type</th>
              <th>Amount Paid</th>
            </tr>
          </thead>
          <tbody>
            ${receipt.paidFees.map(fee => `
              <tr>
                <td>${fee.feeType}</td>
                <td>₹${fee.payAmount.toLocaleString()}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td><strong>Total Amount Paid</strong></td>
              <td><strong>₹${receipt.totalPaid.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
        
        ${receipt.remarks ? `<div><strong>Remarks:</strong> ${receipt.remarks}</div>` : ''}
        
        <div class="footer">
          <div class="signature">
            <div>Authorized Signature</div>
            <div style="margin-top: 40px; border-top: 1px solid #333; width: 200px; margin-left: auto;"></div>
          </div>
        </div>
      </body>
      </html>
    `;
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Enhanced Fee Collection</h1>
            <p className="text-gray-600">Process payments with detailed fee breakdown and receipt generation</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <User size={40} className="text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.admissionNumber}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Class:</span>
                  <span className="text-sm font-medium">{student.class} - {student.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Fee:</span>
                  <span className="text-sm font-medium">{formatCurrency(student.totalFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Paid:</span>
                  <span className="text-sm font-medium text-green-600">{formatCurrency(student.paidAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending:</span>
                  <span className="text-sm font-medium text-red-600">{formatCurrency(student.pendingAmount)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleSelectStudent(student)}
                  disabled={student.pendingAmount === 0}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                    student.pendingAmount > 0
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <DollarSign size={16} className="mr-2" />
                  {student.pendingAmount > 0 ? 'Collect Fee' : 'Fully Paid'}
                </button>
                
                <button
                  onClick={() => {
                    setSelectedStudent(student);
                    // Show payment history modal (implement if needed)
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText size={16} className="mr-2" />
                  Payment History
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {paymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Student Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedStudent.name}</div>
                    <div><strong>Admission No:</strong> {selectedStudent.admissionNumber}</div>
                    <div><strong>Class:</strong> {selectedStudent.class} - {selectedStudent.section}</div>
                    <div><strong>Parent:</strong> {selectedStudent.parentName}</div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                    <input
                      type="date"
                      value={paymentData.date}
                      onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select
                      value={paymentData.method}
                      onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="online">Online Transfer</option>
                      <option value="cheque">Cheque</option>
                      <option value="card">Card Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                    <textarea
                      value={paymentData.remarks}
                      onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Optional remarks..."
                    />
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Fee Breakdown</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 border-b">Select</th>
                        <th className="text-left py-3 px-4 border-b">Fee Type</th>
                        <th className="text-left py-3 px-4 border-b">Total Amount</th>
                        <th className="text-left py-3 px-4 border-b">Already Paid</th>
                        <th className="text-left py-3 px-4 border-b">Due Amount</th>
                        <th className="text-left py-3 px-4 border-b">Pay Amount</th>
                        <th className="text-left py-3 px-4 border-b">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentData.feeBreakdown.map((fee, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={fee.selected}
                              onChange={(e) => handleFeeSelection(index, 'selected', e.target.checked)}
                              disabled={fee.due === 0}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="py-3 px-4 font-medium">{fee.feeType}</td>
                          <td className="py-3 px-4">{formatCurrency(fee.amount)}</td>
                          <td className="py-3 px-4 text-green-600">{formatCurrency(fee.paid)}</td>
                          <td className="py-3 px-4 text-red-600">{formatCurrency(fee.due)}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={fee.payAmount}
                              onChange={(e) => handleFeeSelection(index, 'payAmount', parseInt(e.target.value) || 0)}
                              disabled={!fee.selected || fee.due === 0}
                              max={fee.due}
                              min="0"
                              className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(fee.dueDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="5" className="py-3 px-4 font-bold text-right">Total Payment:</td>
                        <td className="py-3 px-4 font-bold text-lg text-green-600">
                          {formatCurrency(paymentData.totalAmount)}
                        </td>
                        <td className="py-3 px-4"></td>
                      </tr>
                    </tfoot>
                  </table>
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
                  disabled={paymentData.totalAmount === 0}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Receipt size={16} className="mr-2" />
                  Process Payment & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptModal && generatedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Payment Receipt</h3>
                <button 
                  onClick={() => setReceiptModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Receipt Preview */}
              <div className="border border-gray-300 p-6 bg-white">
                <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                  <h2 className="text-2xl font-bold">{generatedReceipt.schoolInfo.name}</h2>
                  <p className="text-sm text-gray-600">{generatedReceipt.schoolInfo.address}</p>
                  <p className="text-sm text-gray-600">
                    Phone: {generatedReceipt.schoolInfo.phone} | Email: {generatedReceipt.schoolInfo.email}
                  </p>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">FEE PAYMENT RECEIPT</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="mb-2"><strong>Receipt No:</strong> {generatedReceipt.receiptNumber}</div>
                    <div className="mb-2"><strong>Date:</strong> {new Date(generatedReceipt.date).toLocaleDateString()}</div>
                    <div className="mb-2"><strong>Student:</strong> {generatedReceipt.student.name}</div>
                    <div className="mb-2"><strong>Admission No:</strong> {generatedReceipt.student.admissionNumber}</div>
                    <div className="mb-2"><strong>Class:</strong> {generatedReceipt.student.class} - {generatedReceipt.student.section}</div>
                  </div>
                  <div>
                    <div className="mb-2"><strong>Parent:</strong> {generatedReceipt.student.parentName}</div>
                    <div className="mb-2"><strong>Contact:</strong> {generatedReceipt.student.parentPhone}</div>
                    <div className="mb-2"><strong>Payment Method:</strong> {generatedReceipt.paymentMethod}</div>
                    <div className="mb-2"><strong>Remaining Balance:</strong> {formatCurrency(generatedReceipt.remainingBalance)}</div>
                  </div>
                </div>
                
                <table className="w-full border border-gray-300 mb-6">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-4 border-b">Fee Type</th>
                      <th className="text-left py-2 px-4 border-b">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedReceipt.paidFees.map((fee, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{fee.feeType}</td>
                        <td className="py-2 px-4 border-b">{formatCurrency(fee.payAmount)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="py-2 px-4">Total Amount Paid</td>
                      <td className="py-2 px-4">{formatCurrency(generatedReceipt.totalPaid)}</td>
                    </tr>
                  </tbody>
                </table>
                
                {generatedReceipt.remarks && (
                  <div className="mb-6">
                    <strong>Remarks:</strong> {generatedReceipt.remarks}
                  </div>
                )}
                
                <div className="text-right mt-12">
                  <div>Authorized Signature</div>
                  <div className="mt-8 border-t border-gray-800 w-48 ml-auto"></div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setReceiptModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={printReceipt}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Printer size={16} className="mr-2" />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCollectFee;