import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  CreditCard,
  Target,
  Activity,
  FileText,
  MapPin,
  PieChart,
  BarChart3,
  Globe,
  Settings
} from 'lucide-react';

const Dashboard = ({ onViewClass, onViewClassList, onCollectFee, onAddStudent, onDefaultersList, onReports, onFeeStructure, onEnhancedCollectFee, onStudentManagement, onPaymentHistory, onSettings }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState({
    totalStudents: 1250,
    totalCollected: 18500000,
    totalDue: 22500000,
    totalOutstanding: 4000000,
    collectionPercentage: 82,
    recentPayments: [
      { id: '1', student: 'John Smith', amount: 5000, date: '2024-12-15', method: 'Cash' },
      { id: '2', student: 'Emily Johnson', amount: 1000, date: '2024-12-20', method: 'Online' },
      { id: '3', student: 'Alice Brown', amount: 18000, date: '2024-12-10', method: 'Bank Transfer' },
      { id: '4', student: 'Michael Davis', amount: 12000, date: '2024-12-18', method: 'Online' },
      { id: '5', student: 'Sarah Wilson', amount: 8500, date: '2024-12-19', method: 'Cash' }
    ],
    monthlyCollection: [
      { month: 'Apr', amount: 2500000, target: 2800000 },
      { month: 'May', amount: 1800000, target: 2000000 },
      { month: 'Jun', amount: 2200000, target: 2400000 },
      { month: 'Jul', amount: 1900000, target: 2100000 },
      { month: 'Aug', amount: 2100000, target: 2300000 },
      { month: 'Sep', amount: 1600000, target: 1800000 },
      { month: 'Oct', amount: 1800000, target: 2000000 },
      { month: 'Nov', amount: 2000000, target: 2200000 },
      { month: 'Dec', amount: 2100000, target: 2300000 }
    ],
    classWiseCollection: [
      { class: '1st', collected: 85, total: 100, students: 120, amount: 2400000 },
      { class: '2nd', collected: 90, total: 100, students: 115, amount: 2415000 },
      { class: '3rd', collected: 78, total: 100, students: 110, amount: 2310000 },
      { class: '4th', collected: 88, total: 100, students: 105, amount: 2205000 },
      { class: '5th', collected: 92, total: 100, students: 100, amount: 2100000 },
      { class: '6th', collected: 75, total: 100, students: 95, amount: 1995000 },
      { class: '7th', collected: 80, total: 100, students: 90, amount: 1890000 },
      { class: '8th', collected: 85, total: 100, students: 85, amount: 1785000 },
      { class: '9th', collected: 70, total: 100, students: 80, amount: 1680000 },
      { class: '10th', collected: 65, total: 100, students: 75, amount: 1575000 },
      { class: '11th', collected: 68, total: 100, students: 70, amount: 1470000 },
      { class: '12th', collected: 72, total: 100, students: 65, amount: 1365000 }
    ],
    // Analytics data
    studentDemographics: {
      byLocation: [
        { city: 'Mumbai', students: 285, percentage: 22.8, amount: 7125000 },
        { city: 'Delhi', students: 200, percentage: 16.0, amount: 5000000 },
        { city: 'Bangalore', students: 175, percentage: 14.0, amount: 4375000 },
        { city: 'Chennai', students: 150, percentage: 12.0, amount: 3750000 },
        { city: 'Hyderabad', students: 125, percentage: 10.0, amount: 3125000 },
        { city: 'Pune', students: 100, percentage: 8.0, amount: 2500000 },
        { city: 'Kolkata', students: 90, percentage: 7.2, amount: 2250000 },
        { city: 'Ahmedabad', students: 75, percentage: 6.0, amount: 1875000 },
        { city: 'Others', students: 50, percentage: 4.0, amount: 1250000 }
      ],
      byState: [
        { state: 'Maharashtra', students: 385, percentage: 30.8, amount: 9625000 },
        { state: 'Delhi', students: 200, percentage: 16.0, amount: 5000000 },
        { state: 'Karnataka', students: 175, percentage: 14.0, amount: 4375000 },
        { state: 'Tamil Nadu', students: 150, percentage: 12.0, amount: 3750000 },
        { state: 'Telangana', students: 125, percentage: 10.0, amount: 3125000 },
        { state: 'West Bengal', students: 90, percentage: 7.2, amount: 2250000 },
        { state: 'Gujarat', students: 75, percentage: 6.0, amount: 1875000 },
        { state: 'Others', students: 50, percentage: 4.0, amount: 1250000 }
      ],
      feeStructure: [
        { grade: '1st-3rd', annualFee: 20000, students: 345, totalAmount: 6900000, collected: 5865000 },
        { grade: '4th-6th', annualFee: 22000, students: 300, totalAmount: 6600000, collected: 5610000 },
        { grade: '7th-9th', annualFee: 25000, students: 255, totalAmount: 6375000, collected: 5100000 },
        { grade: '10th-12th', annualFee: 28000, students: 210, totalAmount: 5880000, collected: 4200000 },
        { grade: 'Special Programs', annualFee: 35000, students: 140, totalAmount: 4900000, collected: 3675000 }
      ]
    }
  });

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const getCollectionStatus = (percentage) => {
    if (percentage >= 90) return { color: 'success', label: 'Excellent', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    if (percentage >= 75) return { color: 'warning', label: 'Good', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
    return { color: 'danger', label: 'Needs Attention', bgColor: 'bg-red-100', textColor: 'text-red-800' };
  };

  const getTotalCollectedFromDemographics = () => {
    return stats.studentDemographics.byLocation.reduce((total, location) => total + location.amount, 0);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">School Fee Management Dashboard</h1>
        <p className="text-gray-600">Comprehensive overview for Academic Year 2024-25</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Activity size={16} className="inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 size={16} className="inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-6 text-center">
              <Users size={40} className="text-blue-600 mb-3 mx-auto" />
              <h3 className="text-2xl font-bold text-blue-600">{stats.totalStudents}</h3>
              <p className="text-gray-600">Total Students</p>
            </div>
            <div className="bg-white border border-green-200 rounded-lg shadow-sm p-6 text-center">
              <DollarSign size={40} className="text-green-600 mb-3 mx-auto" />
              <h3 className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCollected)}</h3>
              <p className="text-gray-600">Total Collected</p>
            </div>
            <div className="bg-white border border-cyan-200 rounded-lg shadow-sm p-6 text-center">
              <Target size={40} className="text-cyan-600 mb-3 mx-auto" />
              <h3 className="text-2xl font-bold text-cyan-600">{formatCurrency(stats.totalDue)}</h3>
              <p className="text-gray-600">Total Due</p>
            </div>
            <div className="bg-white border border-yellow-200 rounded-lg shadow-sm p-6 text-center">
              <AlertCircle size={40} className="text-yellow-600 mb-3 mx-auto" />
              <h3 className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.totalOutstanding)}</h3>
              <p className="text-gray-600">Outstanding</p>
            </div>
          </div>

          {/* Collection Progress */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Overall Collection Progress</h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{stats.collectionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 mb-4">
                <div
                  className="bg-green-500 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500"
                  style={{ width: `${stats.collectionPercentage}%` }}
                >
                  {stats.collectionPercentage}%
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-500">Collected</div>
                  <div className="font-bold text-green-600">{formatCurrency(stats.totalCollected)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Remaining</div>
                  <div className="font-bold text-yellow-600">{formatCurrency(stats.totalOutstanding)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Students Paid</div>
                  <div className="font-bold">{Math.round(stats.totalStudents * stats.collectionPercentage / 100)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Students Pending</div>
                  <div className="font-bold text-red-600">{stats.totalStudents - Math.round(stats.totalStudents * stats.collectionPercentage / 100)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Payments */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Payments</h2>
                <Calendar size={20} className="text-gray-500" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.recentPayments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                      <div>
                        <div className="font-semibold text-gray-900">{payment.student}</div>
                        <div className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">₹{payment.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{payment.method}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Collection Trend */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Monthly Collection Trend</h2>
                <TrendingUp size={20} className="text-gray-500" />
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.monthlyCollection.slice(-6).map((month, index) => {
                    const percentage = (month.amount / month.target) * 100;
                    return (
                      <div key={index} className="text-center">
                        <div className="font-bold text-gray-700">{month.month}</div>
                        <div className="text-green-600 font-semibold">{formatCurrency(month.amount)}</div>
                        <div className="text-xs text-gray-500">Target: {formatCurrency(month.target)}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${percentage >= 90 ? 'bg-green-500' : percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{Math.round(percentage)}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Class-wise Collection Status */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Class-wise Collection Status</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {stats.classWiseCollection.map((classData, index) => {
                  const percentage = (classData.collected / classData.total) * 100;
                  const status = getCollectionStatus(percentage);
                  
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                      <div className="font-semibold text-gray-900 mb-2">{classData.class}</div>
                      <div className="text-sm text-gray-600 mb-2">{classData.students} students</div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className={`h-3 rounded-full ${
                            status.color === 'success' ? 'bg-green-500' :
                            status.color === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="font-bold text-gray-700">{Math.round(percentage)}%</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${status.bgColor} ${status.textColor} mt-1`}>
                        {status.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{formatCurrency(classData.amount)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <>
          {/* Analytics Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-purple-200 rounded-lg shadow-sm p-6 text-center">
              <Globe size={40} className="text-purple-600 mb-3 mx-auto" />
              <h3 className="text-2xl font-bold text-purple-600">{stats.studentDemographics.byLocation.length}</h3>
              <p className="text-gray-600">Cities Covered</p>
            </div>
            <div className="bg-white border border-indigo-200 rounded-lg shadow-sm p-6 text-center">
              <MapPin size={40} className="text-indigo-600 mb-3 mx-auto" />
              <h3 className="text-2xl font-bold text-indigo-600">{stats.studentDemographics.byState.length}</h3>
              <p className="text-gray-600">States Covered</p>
            </div>
            <div className="bg-white border border-pink-200 rounded-lg shadow-sm p-6 text-center">
              <PieChart size={40} className="text-pink-600 mb-3 mx-auto" />
              <h3 className="text-2xl font-bold text-pink-600">{formatCurrency(getTotalCollectedFromDemographics())}</h3>
              <p className="text-gray-600">Geographic Revenue</p>
            </div>
          </div>

          {/* Student Demographics by Location */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <MapPin size={20} className="mr-2 text-blue-600" />
                  Students by City
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.studentDemographics.byLocation.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">{location.city}</span>
                          <span className="text-sm text-gray-600">{location.students} students</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${location.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">{location.percentage}%</span>
                          <span className="text-xs font-medium text-green-600">{formatCurrency(location.amount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <Globe size={20} className="mr-2 text-green-600" />
                  Students by State
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.studentDemographics.byState.map((state, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">{state.state}</span>
                          <span className="text-sm text-gray-600">{state.students} students</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${state.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">{state.percentage}%</span>
                          <span className="text-xs font-medium text-green-600">{formatCurrency(state.amount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fee Structure Analysis */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <DollarSign size={20} className="mr-2 text-purple-600" />
                Fee Structure & Collection Analysis
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Grade Range</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Annual Fee</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Students</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Total Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Collected</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Collection %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.studentDemographics.feeStructure.map((fee, index) => {
                      const collectionPercentage = (fee.collected / fee.totalAmount) * 100;
                      const status = getCollectionStatus(collectionPercentage);
                      
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{fee.grade}</td>
                          <td className="py-3 px-4">{formatCurrency(fee.annualFee)}</td>
                          <td className="py-3 px-4">{fee.students}</td>
                          <td className="py-3 px-4 font-semibold">{formatCurrency(fee.totalAmount)}</td>
                          <td className="py-3 px-4 font-semibold text-green-600">{formatCurrency(fee.collected)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    status.color === 'success' ? 'bg-green-500' :
                                    status.color === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${collectionPercentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{Math.round(collectionPercentage)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => onEnhancedCollectFee && onEnhancedCollectFee()}
              className="flex items-center justify-center px-4 py-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <CreditCard size={20} className="mr-2" />
              Enhanced Fee Collection
            </button>
            <button 
              onClick={() => onStudentManagement && onStudentManagement()}
              className="flex items-center justify-center px-4 py-3 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Users size={20} className="mr-2" />
              Student Management
            </button>
            <button 
              onClick={() => onFeeStructure && onFeeStructure()}
              className="flex items-center justify-center px-4 py-3 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <Settings size={20} className="mr-2" />
              Fee Structure
            </button>
            <button 
              onClick={() => onPaymentHistory && onPaymentHistory()}
              className="flex items-center justify-center px-4 py-3 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <FileText size={20} className="mr-2" />
              Payment History
            </button>
            <button 
              onClick={() => onViewClassList && onViewClassList()}
              className="flex items-center justify-center px-4 py-3 border border-cyan-300 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors"
            >
              <Activity size={20} className="mr-2" />
              Manage Classes
            </button>
            <button 
              onClick={() => onDefaultersList && onDefaultersList()}
              className="flex items-center justify-center px-4 py-3 border border-yellow-300 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              <AlertCircle size={20} className="mr-2" />
              Defaulters List
            </button>
            <button 
              onClick={() => onCollectFee && onCollectFee()}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DollarSign size={20} className="mr-2" />
              Basic Fee Collection
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <button 
              onClick={() => onAddStudent && onAddStudent()}
              className="flex items-center justify-center px-4 py-3 border border-teal-300 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
            >
              <Users size={20} className="mr-2" />
              Add Student
            </button>
            <button 
              onClick={() => onReports && onReports()}
              className="flex items-center justify-center px-4 py-3 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <FileText size={20} className="mr-2" />
              Generate Reports
            </button>
            <button 
              onClick={() => onSettings && onSettings()}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings size={20} className="mr-2" />
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;