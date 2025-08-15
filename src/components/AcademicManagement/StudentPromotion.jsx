import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { ArrowLeft, TrendingUp, Users, CheckCircle, X, Search, Filter } from 'lucide-react';

const StudentPromotion = ({ onBack }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [promotionData, setPromotionData] = useState({
    fromYear: '2024-25',
    toYear: '2025-26',
    promotionDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedClass, students]);

  const fetchStudents = async () => {
    try {
      const response = await apiService.getStudentsForPromotion({
        class: selectedClass,
        academicYear: promotionData.fromYear
      });
      
      // Map API response to component format
      const studentsForPromotion = response.map(student => ({
        id: student._id,
        name: student.name,
        admissionNumber: student.admissionNumber,
        currentClass: student.class,
        section: student.section,
        rollNumber: student.admissionNumber.slice(-3),
        parentName: student.parentName,
        performance: student.performance,
        attendance: student.attendance,
        isEligible: student.isEligible,
        nextClass: student.nextClass,
        remarks: student.remarks
      }));
      
      setStudents(studentsForPromotion);
      setFilteredStudents(studentsForPromotion);
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
      filtered = filtered.filter(student => student.currentClass === selectedClass);
    }

    setFilteredStudents(filtered);
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    const eligibleStudents = filteredStudents.filter(student => student.isEligible);
    if (selectedStudents.length === eligibleStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(eligibleStudents.map(student => student.id));
    }
  };

  const handlePromoteStudents = async () => {
    if (selectedStudents.length === 0) {
      alert('Please select students to promote');
      return;
    }

    if (!confirm(`Are you sure you want to promote ${selectedStudents.length} students?`)) {
      return;
    }

    setLoading(true);
    
    try {
      await apiService.promoteStudents({
        studentIds: selectedStudents,
        fromYear: promotionData.fromYear,
        toYear: promotionData.toYear,
        promotionDate: promotionData.promotionDate
      });

      setSelectedStudents([]);
      await fetchStudents();
      alert(`Successfully promoted ${selectedStudents.length} students!`);
    } catch (error) {
      console.error('Error promoting students:', error);
      alert('Error promoting students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Average': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const uniqueClasses = [...new Set(students.map(student => student.currentClass))];

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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Promotion</h1>
            <p className="text-gray-600">Promote students to next academic year</p>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp size={24} className="text-green-600" />
            <span className="text-lg font-semibold text-green-600">Promotion Management</span>
          </div>
        </div>
      </div>

      {/* Promotion Settings */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Promotion Settings</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Academic Year</label>
              <input
                type="text"
                value={promotionData.fromYear}
                onChange={(e) => setPromotionData({ ...promotionData, fromYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Academic Year</label>
              <input
                type="text"
                value={promotionData.toYear}
                onChange={(e) => setPromotionData({ ...promotionData, toYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Date</label>
              <input
                type="date"
                value={promotionData.promotionDate}
                onChange={(e) => setPromotionData({ ...promotionData, promotionDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name or Admission No"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Classes</option>
                {uniqueClasses.map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSelectAll}
                className="w-full flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <CheckCircle size={16} className="mr-2" />
                Select All Eligible
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={handlePromoteStudents}
                disabled={selectedStudents.length === 0 || loading}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Promoting...
                  </>
                ) : (
                  <>
                    <TrendingUp size={16} className="mr-2" />
                    Promote Selected ({selectedStudents.length})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Students for Promotion ({filteredStudents.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Select</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Student Details</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Current Class</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Performance</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Attendance</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Promotion</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelection(student.id)}
                      disabled={!student.isEligible}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.admissionNumber}</div>
                      <div className="text-sm text-gray-500">Roll: {student.rollNumber}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {student.currentClass} - {student.section}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(student.performance)}`}>
                      {student.performance}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-semibold ${getAttendanceColor(student.attendance)}`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {student.isEligible ? (
                        <>
                          <CheckCircle size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">
                            {student.currentClass} → {student.nextClass}
                          </span>
                        </>
                      ) : (
                        <>
                          <X size={16} className="text-red-600 mr-2" />
                          <span className="text-sm text-red-600">Not Eligible</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{student.remarks}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="text-gray-400 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
          <p className="text-gray-600">No students match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default StudentPromotion;