import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Calendar, TrendingUp, Users, DollarSign, FileText, Filter, Eye } from 'lucide-react';
import apiService from '../services/api';

const Reports = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    generateReport();
  }, [activeTab, selectedDate, selectedMonth, selectedClass]);

  const generateReport = async () => {
    setLoading(true);
    
    try {
      switch (activeTab) {
        case 'daily':
          const dailyData = await apiService.getDailyReport(selectedDate);
          setReportData(dailyData);
          break;
        case 'classwise':
          const classWiseData = await apiService.getClassWiseReport(selectedClass);
          setReportData(classWiseData);
          break;
        case 'monthly':
          const monthlyData = await apiService.getMonthlyReport(selectedMonth);
          setReportData(monthlyData);
          break;
        case 'overall':
          const overallData = await apiService.getOverallReport();
          setReportData(overallData);
          break;
        default:
          setReportData({});
      }
    } catch (error) {
      console.error('Error generating report:', error);
      // Fallback to mock data on error
      setReportData(generateMockReport());
    } finally {
      setLoading(false);
    }
  };

  const generateMockReport = () => {
    // Fallback mock data
    switch (activeTab) {
      case 'daily':
        return generateDailyReport();
      case 'classwise':
        return generateClassWiseReport();
      case 'monthly':
        return generateMonthlyReport();
      case 'overall':
        return generateOverallReport();
      default:
        return {};
    }
  };

  const generateDailyReport = () => {
    return {
      date: selectedDate,
      totalCollections: 125000,
      totalTransactions: 15,
      paymentMethods: {
        cash: { amount: 45000, count: 6 },
        online: { amount: 65000, count: 7 },
        cheque: { amount: 15000, count: 2 }
      },
      transactions: [
        { id: 1, student: 'John Smith', class: '10th', section: 'A', amount: 5000, method: 'Cash', time: '09:30 AM' },
        { id: 2, student: 'Emily Johnson', class: '9th', section: 'B', amount: 12000, method: 'Online', time: '10:15 AM' },
        { id: 3, student: 'Alice Brown', class: '8th', section: 'A', amount: 8000, method: 'Cheque', time: '11:00 AM' },
        { id: 4, student: 'David Wilson', class: '10th', section: 'B', amount: 15000, method: 'Online', time: '02:30 PM' },
        { id: 5, student: 'Sarah Davis', class: '7th', section: 'C', amount: 6000, method: 'Cash', time: '03:45 PM' }
      ],
      classWiseBreakdown: [
        { class: '7th', amount: 18000, transactions: 3 },
        { class: '8th', amount: 25000, transactions: 4 },
        { class: '9th', amount: 32000, transactions: 4 },
        { class: '10th', amount: 50000, transactions: 4 }
      ]
    };
  };

  const generateClassWiseReport = () => {
    return {
      class: selectedClass || 'All Classes',
      totalStudents: selectedClass ? 85 : 1250,
      totalFeeAmount: selectedClass ? 2125000 : 28750000,
      collectedAmount: selectedClass ? 1743750 : 23575000,
      pendingAmount: selectedClass ? 381250 : 5175000,
      collectionPercentage: selectedClass ? 82 : 82,
      sections: selectedClass ? [
        { section: 'A', students: 30, collected: 620000, pending: 130000, percentage: 83 },
        { section: 'B', students: 28, collected: 588000, pending: 112000, percentage: 84 },
        { section: 'C', students: 27, collected: 535750, pending: 139250, percentage: 79 }
      ] : [
        { class: '1st', students: 120, collected: 2400000, pending: 600000, percentage: 80 },
        { class: '2nd', students: 115, collected: 2415000, pending: 485000, percentage: 83 },
        { class: '3rd', students: 110, collected: 2310000, pending: 390000, percentage: 86 },
        { class: '4th', students: 105, collected: 2205000, pending: 345000, percentage: 86 },
        { class: '5th', students: 100, collected: 2100000, pending: 400000, percentage: 84 },
        { class: '6th', students: 95, collected: 1995000, pending: 405000, percentage: 83 },
        { class: '7th', students: 90, collected: 1890000, pending: 360000, percentage: 84 },
        { class: '8th', students: 85, collected: 1785000, pending: 365000, percentage: 83 },
        { class: '9th', students: 80, collected: 1680000, pending: 320000, percentage: 84 },
        { class: '10th', students: 75, collected: 1575000, pending: 375000, percentage: 81 },
        { class: '11th', students: 70, collected: 1470000, pending: 530000, percentage: 74 },
        { class: '12th', students: 65, collected: 1365000, pending: 635000, percentage: 68 }
      ],
      defaulters: selectedClass ? [
        { student: 'Michael Johnson', section: 'A', pending: 15000, overdue: 25 },
        { student: 'Lisa Wilson', section: 'B', pending: 12000, overdue: 18 },
        { student: 'Robert Davis', section: 'C', pending: 20000, overdue: 35 }
      ] : []
    };
  };

  const generateMonthlyReport = () => {
    const month = new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return {
      month: month,
      totalCollected: 2850000,
      totalTransactions: 485,
      averagePerDay: 91935,
      dailyBreakdown: [
        { date: '2024-12-01', amount: 125000, transactions: 15 },
        { date: '2024-12-02', amount: 98000, transactions: 12 },
        { date: '2024-12-03', amount: 156000, transactions: 18 },
        { date: '2024-12-04', amount: 87000, transactions: 11 },
        { date: '2024-12-05', amount: 134000, transactions: 16 },
        { date: '2024-12-06', amount: 112000, transactions: 14 },
        { date: '2024-12-07', amount: 145000, transactions: 17 }
      ],
      paymentMethodTrends: {
        cash: { amount: 1140000, percentage: 40 },
        online: { amount: 1425000, percentage: 50 },
        cheque: { amount: 285000, percentage: 10 }
      },
      classWiseCollection: [
        { class: '1st', amount: 285000, percentage: 10 },
        { class: '2nd', amount: 256500, percentage: 9 },
        { class: '3rd', amount: 228000, percentage: 8 },
        { class: '4th', amount: 256500, percentage: 9 },
        { class: '5th', amount: 285000, percentage: 10 },
        { class: '6th', amount: 228000, percentage: 8 },
        { class: '7th', amount: 256500, percentage: 9 },
        { class: '8th', amount: 285000, percentage: 10 },
        { class: '9th', amount: 228000, percentage: 8 },
        { class: '10th', amount: 256500, percentage: 9 },
        { class: '11th', amount: 199500, percentage: 7 },
        { class: '12th', amount: 171000, percentage: 6 }
      ]
    };
  };

  const generateOverallReport = () => {
    return {
      academicYear: '2024-25',
      totalStudents: 1250,
      totalFeeAmount: 28750000,
      collectedAmount: 23575000,
      pendingAmount: 5175000,
      collectionPercentage: 82,
      monthlyTrend: [
        { month: 'Apr', collected: 3500000, target: 4000000, percentage: 88 },
        { month: 'May', collected: 2800000, target: 3200000, percentage: 88 },
        { month: 'Jun', collected: 3200000, target: 3600000, percentage: 89 },
        { month: 'Jul', collected: 2900000, target: 3300000, percentage: 88 },
        { month: 'Aug', collected: 3100000, target: 3500000, percentage: 89 },
        { month: 'Sep', collected: 2600000, target: 3000000, percentage: 87 },
        { month: 'Oct', collected: 2800000, target: 3200000, percentage: 88 },
        { month: 'Nov', collected: 2675000, target: 3050000, percentage: 88 },
        { month: 'Dec', collected: 2850000, target: 3250000, percentage: 88 }
      ],
      paymentMethodDistribution: {
        cash: { amount: 9430000, percentage: 40 },
        online: { amount: 11787500, percentage: 50 },
        cheque: { amount: 2357500, percentage: 10 }
      },
      topPerformingClasses: [
        { class: '3rd', percentage: 92, collected: 2760000 },
        { class: '4th', percentage: 90, collected: 2700000 },
        { class: '2nd', percentage: 89, collected: 2670000 },
        { class: '5th', percentage: 88, collected: 2640000 },
        { class: '1st', percentage: 87, collected: 2610000 }
      ],
      defaultersSummary: {
        total: 225,
        critical: 45,
        overdue: 180,
        totalPending: 5175000
      }
    };
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const exportReport = () => {
    console.log('Exporting report:', activeTab, reportData);
    // Implement export functionality
  };

  const printReport = () => {
    window.print();
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Fee Reports</h1>
            <p className="text-gray-600">Comprehensive fee collection reports and analytics</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={printReport}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye size={16} className="mr-2" />
              Print
            </button>
            <button
              onClick={exportReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'daily', label: 'Daily Report', icon: Calendar },
              { id: 'classwise', label: 'Class-wise Report', icon: Users },
              { id: 'monthly', label: 'Monthly Report', icon: TrendingUp },
              { id: 'overall', label: 'Overall Report', icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center">
            {activeTab === 'daily' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            {activeTab === 'classwise' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Classes</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                    <option key={grade} value={`${grade}th`}>{grade}th Grade</option>
                  ))}
                </select>
              </div>
            )}
            
            {activeTab === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <button
              onClick={generateReport}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Filter size={16} className="mr-2" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Daily Report */}
          {activeTab === 'daily' && reportData.date && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-green-200 rounded-lg shadow-sm p-6 text-center">
                  <DollarSign size={40} className="text-green-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-green-600">{formatCurrency(reportData.totalCollections)}</h3>
                  <p className="text-gray-600">Total Collections</p>
                </div>
                <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-6 text-center">
                  <FileText size={40} className="text-blue-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-blue-600">{reportData.totalTransactions}</h3>
                  <p className="text-gray-600">Total Transactions</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg shadow-sm p-6 text-center">
                  <Calendar size={40} className="text-purple-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-purple-600">{new Date(reportData.date).toLocaleDateString()}</h3>
                  <p className="text-gray-600">Report Date</p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">Payment Methods Breakdown</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(reportData.paymentMethods).map(([method, data]) => (
                      <div key={method} className="text-center">
                        <h4 className="text-lg font-semibold capitalize mb-2">{method}</h4>
                        <div className="text-2xl font-bold text-blue-600 mb-1">{formatCurrency(data.amount)}</div>
                        <div className="text-sm text-gray-600">{data.count} transactions</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">Today's Transactions</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Time</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Student</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Class</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Amount</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-6">{transaction.time}</td>
                          <td className="py-3 px-6 font-semibold">{transaction.student}</td>
                          <td className="py-3 px-6">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {transaction.class} - {transaction.section}
                            </span>
                          </td>
                          <td className="py-3 px-6 font-semibold text-green-600">{formatCurrency(transaction.amount)}</td>
                          <td className="py-3 px-6">
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              {transaction.method}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Class-wise Report */}
          {activeTab === 'classwise' && reportData.totalStudents && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-6 text-center">
                  <Users size={40} className="text-blue-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-blue-600">{reportData.totalStudents}</h3>
                  <p className="text-gray-600">Total Students</p>
                </div>
                <div className="bg-white border border-green-200 rounded-lg shadow-sm p-6 text-center">
                  <DollarSign size={40} className="text-green-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-green-600">{formatCurrency(reportData.collectedAmount)}</h3>
                  <p className="text-gray-600">Collected</p>
                </div>
                <div className="bg-white border border-yellow-200 rounded-lg shadow-sm p-6 text-center">
                  <TrendingUp size={40} className="text-yellow-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-yellow-600">{formatCurrency(reportData.pendingAmount)}</h3>
                  <p className="text-gray-600">Pending</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg shadow-sm p-6 text-center">
                  <FileText size={40} className="text-purple-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-purple-600">{reportData.collectionPercentage}%</h3>
                  <p className="text-gray-600">Collection Rate</p>
                </div>
              </div>

              {/* Class/Section Breakdown */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">
                    {selectedClass ? `${selectedClass} Sections Breakdown` : 'Class-wise Collection Status'}
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">
                          {selectedClass ? 'Section' : 'Class'}
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Students</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Collected</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Pending</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Collection %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.sections.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-6 font-semibold">
                            {selectedClass ? item.section : item.class}
                          </td>
                          <td className="py-3 px-6">{item.students}</td>
                          <td className="py-3 px-6 text-green-600 font-semibold">{formatCurrency(item.collected)}</td>
                          <td className="py-3 px-6 text-red-600 font-semibold">{formatCurrency(item.pending)}</td>
                          <td className="py-3 px-6">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    item.percentage >= 90 ? 'bg-green-500' :
                                    item.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{item.percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Monthly Report */}
          {activeTab === 'monthly' && reportData.month && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-green-200 rounded-lg shadow-sm p-6 text-center">
                  <DollarSign size={40} className="text-green-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-green-600">{formatCurrency(reportData.totalCollected)}</h3>
                  <p className="text-gray-600">Total Collected</p>
                </div>
                <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-6 text-center">
                  <FileText size={40} className="text-blue-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-blue-600">{reportData.totalTransactions}</h3>
                  <p className="text-gray-600">Total Transactions</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg shadow-sm p-6 text-center">
                  <TrendingUp size={40} className="text-purple-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-purple-600">{formatCurrency(reportData.averagePerDay)}</h3>
                  <p className="text-gray-600">Daily Average</p>
                </div>
              </div>

              {/* Daily Breakdown Chart */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">Daily Collection Trend</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reportData.dailyBreakdown.map((day, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-lg font-bold text-green-600 mb-1">{formatCurrency(day.amount)}</div>
                        <div className="text-xs text-gray-500">{day.transactions} transactions</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Methods Distribution */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">Payment Methods Distribution</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(reportData.paymentMethodTrends).map(([method, data]) => (
                      <div key={method} className="text-center">
                        <h4 className="text-lg font-semibold capitalize mb-2">{method}</h4>
                        <div className="text-2xl font-bold text-blue-600 mb-1">{formatCurrency(data.amount)}</div>
                        <div className="text-sm text-gray-600">{data.percentage}% of total</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${data.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Overall Report */}
          {activeTab === 'overall' && reportData.academicYear && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-6 text-center">
                  <Users size={40} className="text-blue-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-blue-600">{reportData.totalStudents}</h3>
                  <p className="text-gray-600">Total Students</p>
                </div>
                <div className="bg-white border border-green-200 rounded-lg shadow-sm p-6 text-center">
                  <DollarSign size={40} className="text-green-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-green-600">{formatCurrency(reportData.collectedAmount)}</h3>
                  <p className="text-gray-600">Total Collected</p>
                </div>
                <div className="bg-white border border-yellow-200 rounded-lg shadow-sm p-6 text-center">
                  <TrendingUp size={40} className="text-yellow-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-yellow-600">{formatCurrency(reportData.pendingAmount)}</h3>
                  <p className="text-gray-600">Pending Amount</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg shadow-sm p-6 text-center">
                  <FileText size={40} className="text-purple-600 mb-3 mx-auto" />
                  <h3 className="text-2xl font-bold text-purple-600">{reportData.collectionPercentage}%</h3>
                  <p className="text-gray-600">Collection Rate</p>
                </div>
              </div>

              {/* Monthly Trend */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">Monthly Collection Trend</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {reportData.monthlyTrend.map((month, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-semibold text-gray-700 mb-2">{month.month}</div>
                        <div className="text-lg font-bold text-green-600 mb-1">{formatCurrency(month.collected)}</div>
                        <div className="text-xs text-gray-500 mb-2">Target: {formatCurrency(month.target)}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              month.percentage >= 90 ? 'bg-green-500' :
                              month.percentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${month.percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{month.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Performing Classes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">Top Performing Classes</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {reportData.topPerformingClasses.map((classData, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold">{classData.class} Grade</div>
                            <div className="text-sm text-gray-600">{formatCurrency(classData.collected)} collected</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">{classData.percentage}%</div>
                            <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${classData.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">Defaulters Summary</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{reportData.defaultersSummary.critical}</div>
                        <div className="text-sm text-gray-600">Critical Cases</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{reportData.defaultersSummary.overdue}</div>
                        <div className="text-sm text-gray-600">Overdue</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{reportData.defaultersSummary.total}</div>
                        <div className="text-sm text-gray-600">Total Defaulters</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{formatCurrency(reportData.defaultersSummary.totalPending)}</div>
                        <div className="text-sm text-gray-600">Total Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;