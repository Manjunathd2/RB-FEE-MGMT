import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Calendar, DollarSign, Receipt, Download, Filter, Eye } from 'lucide-react';

const PaymentHistory = ({ onBack }) => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptModal, setReceiptModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchTerm, selectedClass, paymentMethod, dateRange, payments]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPayments({
        page: 1,
        limit: 100,
        search: searchTerm,
        class: selectedClass,
        paymentMethod,
        startDate: dateRange.from,
        endDate: dateRange.to
      });
      
      const paymentsWithFormattedData = response.payments.map(payment => ({
        ...payment,
        date: payment.paymentDate,
        student: payment.student || { name: 'Unknown', admissionNumber: 'N/A', class: 'N/A', section: 'N/A' },
        parent: { name: payment.student?.parentName || 'N/A', phone: payment.student?.parentPhone || 'N/A' },
        paymentMethod: payment.paymentMethod
      }));
      
      setPayments(paymentsWithFormattedData);
      setFilteredPayments(paymentsWithFormattedData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Fallback to empty array on error
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(payment => payment.student.class === selectedClass);
    }

    if (paymentMethod) {
      filtered = filtered.filter(payment => payment.paymentMethod.toLowerCase() === paymentMethod.toLowerCase());
    }

    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return paymentDate >= fromDate && paymentDate <= toDate;
      });
    }

    setFilteredPayments(filtered);
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getTotalAmount = () => {
    return filteredPayments.reduce((total, payment) => total + payment.totalAmount, 0);
  };

  const getPaymentMethodBadge = (method) => {
    const methodConfig = {
      cash: { class: 'bg-green-100 text-green-800', label: 'Cash' },
      online: { class: 'bg-blue-100 text-blue-800', label: 'Online' },
      cheque: { class: 'bg-yellow-100 text-yellow-800', label: 'Cheque' },
      card: { class: 'bg-purple-100 text-purple-800', label: 'Card' }
    };
    return methodConfig[method.toLowerCase()] || { class: 'bg-gray-100 text-gray-800', label: method };
  };

  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setReceiptModal(true);
  };

  const handleExportData = () => {
    console.log('Exporting payment history data');
    // Implement export functionality
  };

  const printReceipt = () => {
    if (selectedPayment) {
      const printWindow = window.open('', '_blank');
      const receiptHTML = generateReceiptHTML(selectedPayment);
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateReceiptHTML = (payment) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${payment.receiptNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .school-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .receipt-title { font-size: 18px; font-weight: bold; margin: 20px 0; text-align: center; }
          .receipt-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .fee-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .fee-table th, .fee-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .fee-table th { background-color: #f5f5f5; }
          .total-row { font-weight: bold; background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">Greenwood International School</div>
          <div>123 Education Street, Knowledge City</div>
          <div>Phone: +1-234-567-8900 | Email: info@greenwood.edu</div>
        </div>
        
        <div class="receipt-title">PAYMENT RECEIPT</div>
        
        <div class="receipt-info">
          <div>
            <div><strong>Receipt No:</strong> ${payment.receiptNumber}</div>
            <div><strong>Date:</strong> ${new Date(payment.date).toLocaleDateString()}</div>
            <div><strong>Student:</strong> ${payment.student.name}</div>
            <div><strong>Admission No:</strong> ${payment.student.admissionNumber}</div>
            <div><strong>Class:</strong> ${payment.student.class} - ${payment.student.section}</div>
          </div>
          <div>
            <div><strong>Parent:</strong> ${payment.parent.name}</div>
            <div><strong>Contact:</strong> ${payment.parent.phone}</div>
            <div><strong>Payment Method:</strong> ${payment.paymentMethod}</div>
            <div><strong>Collected By:</strong> ${payment.collectedBy}</div>
          </div>
        </div>
        
        <table class="fee-table">
          <thead>
            <tr>
              <th>Fee Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${payment.feeDetails.map(fee => `
              <tr>
                <td>${fee.feeType}</td>
                <td>₹${fee.amount.toLocaleString()}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td><strong>Total Amount Paid</strong></td>
              <td><strong>₹${payment.totalAmount.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
        
        ${payment.remarks ? `<div><strong>Remarks:</strong> ${payment.remarks}</div>` : ''}
        
        <div style="text-align: right; margin-top: 50px;">
          <div>Authorized Signature</div>
          <div style="margin-top: 40px; border-top: 1px solid #333; width: 200px; margin-left: auto;"></div>
        </div>
      </body>
      </html>
    `;
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
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment History</h1>
            <p className="text-gray-600">Complete record of all fee payments</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Amount</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(getTotalAmount())}</div>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-6 text-center">
          <Receipt size={32} className="text-blue-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-blue-600">{filteredPayments.length}</h3>
          <p className="text-gray-600">Total Payments</p>
        </div>
        <div className="bg-white border border-green-200 rounded-lg shadow-sm p-6 text-center">
          <DollarSign size={32} className="text-green-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-green-600">{formatCurrency(getTotalAmount())}</h3>
          <p className="text-gray-600">Total Amount</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg shadow-sm p-6 text-center">
          <Calendar size={32} className="text-purple-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-purple-600">
            {filteredPayments.length > 0 ? Math.round(getTotalAmount() / filteredPayments.length) : 0}
          </h3>
          <p className="text-gray-600">Avg Payment</p>
        </div>
        <div className="bg-white border border-yellow-200 rounded-lg shadow-sm p-6 text-center">
          <Filter size={32} className="text-yellow-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-yellow-600">
            {new Set(filteredPayments.map(p => p.paymentMethod)).size}
          </h3>
          <p className="text-gray-600">Payment Methods</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Student, Receipt No"
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
                <option value="8th">8th Grade</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Methods</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="cheque">Cheque</option>
                <option value="card">Card</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedClass('');
                  setPaymentMethod('');
                  setDateRange({ from: '', to: '' });
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} className="mr-2" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Payment Records ({filteredPayments.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Receipt Details</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Student</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Fee Details</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Payment Info</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Collected By</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => {
                const methodConfig = getPaymentMethodBadge(payment.paymentMethod);
                return (
                  <tr key={payment._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{payment.receiptNumber}</div>
                        <div className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold">{payment.student.name}</div>
                        <div className="text-sm text-gray-500">{payment.student.admissionNumber}</div>
                        <div className="text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {payment.student.class} - {payment.student.section}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {payment.feeDetails.map((fee, index) => (
                          <div key={index} className="text-sm">
                            <span className="text-gray-600">{fee.feeType}:</span>
                            <span className="font-semibold ml-1">{formatCurrency(fee.amount)}</span>
                          </div>
                        ))}
                        <div className="text-sm font-bold text-green-600 pt-1 border-t">
                          Total: {formatCurrency(payment.totalAmount)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${methodConfig.class}`}>
                          {methodConfig.label}
                        </span>
                        {payment.remarks && (
                          <div className="text-sm text-gray-600">{payment.remarks}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="font-semibold">{payment.collectedBy}</div>
                        <div className="text-gray-600">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleViewReceipt(payment)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        <Eye size={14} className="mr-1" />
                        View Receipt
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {receiptModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Payment Receipt</h3>
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
              <div className="border border-gray-300 p-6 bg-white">
                <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                  <h2 className="text-2xl font-bold">Greenwood International School</h2>
                  <p className="text-sm text-gray-600">123 Education Street, Knowledge City</p>
                  <p className="text-sm text-gray-600">Phone: +1-234-567-8900 | Email: info@greenwood.edu</p>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">PAYMENT RECEIPT</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="mb-2"><strong>Receipt No:</strong> {selectedPayment.receiptNumber}</div>
                    <div className="mb-2"><strong>Date:</strong> {new Date(selectedPayment.date).toLocaleDateString()}</div>
                    <div className="mb-2"><strong>Student:</strong> {selectedPayment.student.name}</div>
                    <div className="mb-2"><strong>Admission No:</strong> {selectedPayment.student.admissionNumber}</div>
                    <div className="mb-2"><strong>Class:</strong> {selectedPayment.student.class} - {selectedPayment.student.section}</div>
                  </div>
                  <div>
                    <div className="mb-2"><strong>Parent:</strong> {selectedPayment.parent.name}</div>
                    <div className="mb-2"><strong>Contact:</strong> {selectedPayment.parent.phone}</div>
                    <div className="mb-2"><strong>Payment Method:</strong> {selectedPayment.paymentMethod}</div>
                    <div className="mb-2"><strong>Collected By:</strong> {selectedPayment.collectedBy}</div>
                  </div>
                </div>
                
                <table className="w-full border border-gray-300 mb-6">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-4 border-b">Fee Type</th>
                      <th className="text-left py-2 px-4 border-b">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayment.feeDetails.map((fee, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{fee.feeType}</td>
                        <td className="py-2 px-4 border-b">{formatCurrency(fee.amount)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="py-2 px-4">Total Amount Paid</td>
                      <td className="py-2 px-4">{formatCurrency(selectedPayment.totalAmount)}</td>
                    </tr>
                  </tbody>
                </table>
                
                {selectedPayment.remarks && (
                  <div className="mb-6">
                    <strong>Remarks:</strong> {selectedPayment.remarks}
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
                  <Receipt size={16} className="mr-2" />
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

export default PaymentHistory;