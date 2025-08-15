import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, AlertTriangle, Phone, Mail, Calendar, DollarSign, Download, Filter } from 'lucide-react';
import apiService from '../services/api';

const DefaultersList = ({ onBack }) => {
  const [defaulters, setDefaulters] = useState([]);
  const [filteredDefaulters, setFilteredDefaulters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [overdueFilter, setOverdueFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDefaulters();
  }, []);

  useEffect(() => {
    filterDefaulters();
  }, [searchTerm, selectedClass, selectedSection, overdueFilter, defaulters]);

  const fetchDefaulters = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDefaulters({
        class: selectedClass,
        section: selectedSection,
        overdueDays: overdueFilter === 'critical' ? 45 : 0
      });
      
      // Add mock overdue days and status since not in API
      const defaultersWithStatus = response.map(student => ({
        ...student,
        overdueDays: Math.floor(Math.random() * 60) + 1,
        status: Math.random() > 0.7 ? 'critical' : 'overdue',
        dueDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastPaymentDate: student.updatedAt
      }));
      
      setDefaulters(defaultersWithStatus);
      setFilteredDefaulters(defaultersWithStatus);
    } catch (error) {
      console.error('Error fetching defaulters:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDefaulters = () => {
    let filtered = defaulters;

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(student => student.class === selectedClass);
    }

    if (selectedSection) {
      filtered = filtered.filter(student => student.section === selectedSection);
    }

    if (overdueFilter !== 'all') {
      if (overdueFilter === 'critical') {
        filtered = filtered.filter(student => student.status === 'critical');
      } else if (overdueFilter === 'overdue') {
        filtered = filtered.filter(student => student.status === 'overdue');
      }
    }

    setFilteredDefaulters(filtered);
  };

  const getStatusBadge = (status, overdueDays) => {
    if (status === 'critical' || overdueDays > 45) {
      return { class: 'bg-red-100 text-red-800', label: 'Critical', icon: '🚨' };
    } else if (status === 'overdue' || overdueDays > 0) {
      return { class: 'bg-yellow-100 text-yellow-800', label: 'Overdue', icon: '⚠️' };
    }
    return { class: 'bg-gray-100 text-gray-800', label: 'Pending', icon: '⏳' };
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const handleSendReminder = (student) => {
    console.log('Sending reminder to:', student.name);
    // Implement reminder functionality
  };

  const handleExportData = () => {
    console.log('Exporting defaulters data');
    // Implement export functionality
  };

  const getTotalPendingAmount = () => {
    return filteredDefaulters.reduce((total, student) => total + student.pendingAmount, 0);
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Fee Defaulters List</h1>
            <p className="text-gray-600">Students with pending or overdue fee payments</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Pending</div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(getTotalPendingAmount())}</div>
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
        <div className="bg-white border border-red-200 rounded-lg shadow-sm p-6 text-center">
          <AlertTriangle size={32} className="text-red-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-red-600">{filteredDefaulters.filter(s => s.status === 'critical').length}</h3>
          <p className="text-gray-600">Critical Cases</p>
        </div>
        <div className="bg-white border border-yellow-200 rounded-lg shadow-sm p-6 text-center">
          <Calendar size={32} className="text-yellow-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-yellow-600">{filteredDefaulters.filter(s => s.status === 'overdue').length}</h3>
          <p className="text-gray-600">Overdue</p>
        </div>
        <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-6 text-center">
          <DollarSign size={32} className="text-blue-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-blue-600">{filteredDefaulters.length}</h3>
          <p className="text-gray-600">Total Defaulters</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg shadow-sm p-6 text-center">
          <Phone size={32} className="text-purple-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-purple-600">
            {Math.round((filteredDefaulters.reduce((sum, s) => sum + s.overdueDays, 0) / filteredDefaulters.length) || 0)}
          </h3>
          <p className="text-gray-600">Avg Overdue Days</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, Admission No, Parent"
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
                value={overdueFilter}
                onChange={(e) => setOverdueFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="critical">Critical (45+ days)</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedClass('');
                  setSelectedSection('');
                  setOverdueFilter('all');
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} className="mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Defaulters Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Defaulters ({filteredDefaulters.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Student Details</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Class/Section</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Fee Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Overdue Info</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Parent Contact</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDefaulters.map((student) => {
                const statusConfig = getStatusBadge(student.status, student.overdueDays);
                return (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.admissionNumber}</div>
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
                          {statusConfig.icon} {statusConfig.label}
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
                      <div className="text-sm">
                        <div className="font-semibold text-red-600">{student.overdueDays} days overdue</div>
                        <div className="text-gray-600">Due: {new Date(student.dueDate).toLocaleDateString()}</div>
                        <div className="text-gray-600">
                          Last Payment: {student.lastPaymentDate ? 
                            new Date(student.lastPaymentDate).toLocaleDateString() : 
                            'No payment yet'
                          }
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="font-semibold">{student.parentName}</div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Phone size={14} className="mr-1" />
                          {student.parentPhone}
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Mail size={14} className="mr-1" />
                          {student.parentEmail}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleSendReminder(student)}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          <Mail size={14} className="mr-1" />
                          Send Reminder
                        </button>
                        <button
                          className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          <Phone size={14} className="mr-1" />
                          Call Parent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDefaulters.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle size={48} className="text-gray-400 mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Defaulters Found</h3>
            <p className="text-gray-600">No students match the current filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultersList;