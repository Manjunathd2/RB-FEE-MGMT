import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Edit, Eye, Trash2, Users, Download, Filter, UserCheck, UserX } from 'lucide-react';
import apiService from '../services/api';

const StudentManagement = ({ onBack, onAddStudent }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, studentId: '', studentName: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedClass, selectedSection, statusFilter, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStudents({
        page: 1,
        limit: 100,
        search: searchTerm,
        class: selectedClass,
        section: selectedSection,
        status: statusFilter
      });
      
      const studentsWithFeeStatus = response.students.map(student => ({
        ...student,
        feeStatus: student.pendingAmount === 0 ? 'paid' : 
                  student.paidAmount > 0 ? 'partial' : 'unpaid'
      }));
      
      setStudents(studentsWithFeeStatus);
      setFilteredStudents(studentsWithFeeStatus);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

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

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(student => student.isActive);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(student => !student.isActive);
      }
    }

    setFilteredStudents(filtered);
  };

  const getStatusBadge = (feeStatus) => {
    const statusConfig = {
      paid: { class: 'bg-green-100 text-green-800', label: 'Paid' },
      partial: { class: 'bg-yellow-100 text-yellow-800', label: 'Partial' },
      unpaid: { class: 'bg-red-100 text-red-800', label: 'Unpaid' }
    };
    return statusConfig[feeStatus] || statusConfig.unpaid;
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setViewModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    // For now, show an alert. In production, this would navigate to edit form
    alert(`Edit functionality for ${student.name} will be implemented in the edit form.`);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await apiService.deleteStudent(studentId);
      setStudents(students.filter(student => student._id !== studentId));
      setDeleteModal({ show: false, studentId: '', studentName: '' });
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleExportData = () => {
    console.log('Exporting student data');
    // Implement export functionality
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Management</h1>
            <p className="text-gray-600">Manage student records and information</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                console.log('Add Student button clicked');
                if (onAddStudent) {
                  onAddStudent();
                } else {
                  console.error('onAddStudent callback not provided');
                }
              }}
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
          <Users size={32} className="text-blue-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-blue-600">{filteredStudents.length}</h3>
          <p className="text-gray-600">Total Students</p>
        </div>
        <div className="bg-white border border-green-200 rounded-lg shadow-sm p-6 text-center">
          <UserCheck size={32} className="text-green-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-green-600">{filteredStudents.filter(s => s.isActive).length}</h3>
          <p className="text-gray-600">Active Students</p>
        </div>
        <div className="bg-white border border-red-200 rounded-lg shadow-sm p-6 text-center">
          <UserX size={32} className="text-red-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-red-600">{filteredStudents.filter(s => !s.isActive).length}</h3>
          <p className="text-gray-600">Inactive Students</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg shadow-sm p-6 text-center">
          <Users size={32} className="text-purple-600 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold text-purple-600">
            {new Set(filteredStudents.map(s => s.class)).size}
          </h3>
          <p className="text-gray-600">Classes</p>
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedClass('');
                  setSelectedSection('');
                  setStatusFilter('all');
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

      {/* Students Table */}
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
                <th className="text-left py-3 px-6 font-medium text-gray-700">Parent Contact</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Fee Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const feeStatusConfig = getStatusBadge(student.feeStatus);
                return (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.admissionNumber}</div>
                        <div className="text-sm text-gray-500">DOB: {new Date(student.dateOfBirth).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {student.class} - {student.section}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="font-semibold">{student.parentName}</div>
                        <div className="text-gray-600">{student.parentPhone}</div>
                        <div className="text-gray-600">{student.parentEmail}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${feeStatusConfig.class}`}>
                          {feeStatusConfig.label}
                        </span>
                        <div className="text-sm">
                          <div>Total: {formatCurrency(student.totalFee)}</div>
                          <div className="text-red-600">Pending: {formatCurrency(student.pendingAmount)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewStudent(student)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Edit Student"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({
                            show: true,
                            studentId: student._id,
                            studentName: student.name
                          })}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Student Modal */}
      {viewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Student Details</h3>
                <button 
                  onClick={() => setViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedStudent.name}</div>
                    <div><strong>Admission No:</strong> {selectedStudent.admissionNumber}</div>
                    <div><strong>Date of Birth:</strong> {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</div>
                    <div><strong>Gender:</strong> {selectedStudent.gender}</div>
                    <div><strong>Blood Group:</strong> {selectedStudent.bloodGroup}</div>
                    <div><strong>Medical Conditions:</strong> {selectedStudent.medicalConditions}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Academic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Class:</strong> {selectedStudent.class}</div>
                    <div><strong>Section:</strong> {selectedStudent.section}</div>
                    <div><strong>Academic Year:</strong> {selectedStudent.academicYear}</div>
                    <div><strong>Admission Date:</strong> {new Date(selectedStudent.admissionDate).toLocaleDateString()}</div>
                    <div><strong>Previous School:</strong> {selectedStudent.previousSchool}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Parent/Guardian Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Parent Name:</strong> {selectedStudent.parentName}</div>
                    <div><strong>Phone:</strong> {selectedStudent.parentPhone}</div>
                    <div><strong>Email:</strong> {selectedStudent.parentEmail}</div>
                    <div><strong>Emergency Contact:</strong> {selectedStudent.emergencyContact}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Fee Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Total Fee:</strong> {formatCurrency(selectedStudent.totalFee)}</div>
                    <div><strong>Paid Amount:</strong> {formatCurrency(selectedStudent.paidAmount)}</div>
                    <div><strong>Pending Amount:</strong> {formatCurrency(selectedStudent.pendingAmount)}</div>
                    <div><strong>Fee Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusBadge(selectedStudent.feeStatus).class}`}>
                        {getStatusBadge(selectedStudent.feeStatus).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Address</h4>
                <p className="text-sm text-gray-600">{selectedStudent.address}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong>{deleteModal.studentName}</strong>?
              </p>
              <p className="text-red-600 text-sm">
                <strong>Warning:</strong> This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button 
                onClick={() => setDeleteModal({ show: false, studentId: '', studentName: '' })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteStudent(deleteModal.studentId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;