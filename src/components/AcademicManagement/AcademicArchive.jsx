import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { ArrowLeft, Archive, Download, Eye, Search, Filter, Calendar, Users, FileText } from 'lucide-react';

const AcademicArchive = ({ onBack }) => {
  const [archivedData, setArchivedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchivedData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, selectedYear, selectedType, archivedData]);

  const fetchArchivedData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getArchivedData({
        type: selectedType,
        academicYear: selectedYear
      });
      setArchivedData(response);
      setFilteredData(response);
    } catch (error) {
      console.error('Error fetching archived data:', error);
      // Fallback to empty array on error
      setArchivedData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = archivedData;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(item => item.academicYear === selectedYear);
    }

    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    setFilteredData(filtered);
  };

  const handleDownload = (item) => {
    console.log('Downloading:', item.title);
    // Implement download functionality
  };

  const handleView = (item) => {
    console.log('Viewing:', item.title);
    // Implement view functionality
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Academic Year': return Calendar;
      case 'Student Records': return Users;
      case 'Fee Records': return FileText;
      case 'Class Records': return Archive;
      default: return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Academic Year': return 'bg-blue-100 text-blue-800';
      case 'Student Records': return 'bg-green-100 text-green-800';
      case 'Fee Records': return 'bg-purple-100 text-purple-800';
      case 'Class Records': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueYears = [...new Set(archivedData.map(item => item.academicYear))];
  const uniqueTypes = [...new Set(archivedData.map(item => item.type))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Academic Archive</h1>
            <p className="text-gray-600">Access archived academic data and records</p>
          </div>
          <div className="flex items-center space-x-2">
            <Archive size={24} className="text-blue-600" />
            <span className="text-lg font-semibold text-blue-600">Archive Management</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-6 text-center">
          <Archive size={32} className="text-blue-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-blue-600">{filteredData.length}</h3>
          <p className="text-gray-600">Archived Items</p>
        </div>
        <div className="bg-white border border-green-200 rounded-lg shadow-sm p-6 text-center">
          <FileText size={32} className="text-green-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-green-600">
            {filteredData.reduce((sum, item) => sum + item.recordsCount, 0).toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Records</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg shadow-sm p-6 text-center">
          <Calendar size={32} className="text-purple-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-purple-600">{uniqueYears.length}</h3>
          <p className="text-gray-600">Academic Years</p>
        </div>
        <div className="bg-white border border-orange-200 rounded-lg shadow-sm p-6 text-center">
          <Download size={32} className="text-orange-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-orange-600">
            {filteredData.reduce((sum, item) => sum + parseInt(item.size), 0)} MB
          </h3>
          <p className="text-gray-600">Total Size</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search archives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedYear('');
                  setSelectedType('');
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

      {/* Archive Items */}
      <div className="space-y-4">
        {filteredData.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          return (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <TypeIcon size={24} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Academic Year:</span>
                          <div className="font-medium">{item.academicYear}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Archived Date:</span>
                          <div className="font-medium">{new Date(item.archivedDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Records:</span>
                          <div className="font-medium">{item.recordsCount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <div className="font-medium">{item.size}</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-gray-500 text-sm">Categories:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.categories.map((category, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleView(item)}
                      className="flex items-center px-3 py-2 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(item)}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      <Download size={14} className="mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Archive size={48} className="text-gray-400 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Archives Found</h3>
          <p className="text-gray-600">No archived data matches your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default AcademicArchive;