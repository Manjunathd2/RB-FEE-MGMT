import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Users, GraduationCap, Calendar, Settings } from 'lucide-react';
import apiService from '../services/api';

const ClassDetails = ({ classId, onBack, isAdmin = true }) => {
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      fetchClassDetails();
      fetchClassStudents();
    }
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      const response = await apiService.getClass(classId);
      setClassData(response);
    } catch (error) {
      console.error('Error fetching class details:', error);
    }
  };

  const fetchClassStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStudents({ 
        class: classData?.name,
        limit: 100 
      });
      setStudents(response.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const getStudentsBySection = (sectionName) => {
    return students.filter(student => student.section === sectionName);
  };

  const getTotalCapacity = () => {
    return classData?.sections.reduce((total, section) => total + (section.capacity || 0), 0) || 0;
  };

  const getTotalStudents = () => {
    return students.length;
  };

  const handleEditClass = () => {
    // Handle edit class functionality
    console.log('Edit class:', classData._id);
  };

  const handleAddStudent = () => {
    // Handle add student functionality
    console.log('Add student to class:', classData._id);
  };

  const handleViewStudent = (studentId) => {
    // Handle view student functionality
    console.log('View student:', studentId);
  };

  if (!classData) {
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
          Back to Classes
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{classData.name}</h1>
            <p className="text-gray-600">Class details and student information</p>
          </div>
          {isAdmin && (
            <button 
              onClick={handleEditClass}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={20} className="mr-2" />
              Edit Class
            </button>
          )}
        </div>
      </div>

      {/* Class Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-6 text-center">
          <GraduationCap size={40} className="text-blue-600 mb-3 mx-auto" />
          <h3 className="text-2xl font-bold text-blue-600">{classData.grade}</h3>
          <p className="text-gray-600">Grade Level</p>
        </div>
        <div className="bg-white border border-cyan-200 rounded-lg shadow-sm p-6 text-center">
          <Settings size={40} className="text-cyan-600 mb-3 mx-auto" />
          <h3 className="text-2xl font-bold text-cyan-600">{classData.sections.length}</h3>
          <p className="text-gray-600">Sections</p>
        </div>
        <div className="bg-white border border-green-200 rounded-lg shadow-sm p-6 text-center">
          <Users size={40} className="text-green-600 mb-3 mx-auto" />
          <h3 className="text-2xl font-bold text-green-600">{getTotalStudents()}</h3>
          <p className="text-gray-600">Enrolled Students</p>
        </div>
        <div className="bg-white border border-yellow-200 rounded-lg shadow-sm p-6 text-center">
          <Calendar size={40} className="text-yellow-600 mb-3 mx-auto" />
          <h3 className="text-2xl font-bold text-yellow-600">{getTotalCapacity()}</h3>
          <p className="text-gray-600">Total Capacity</p>
        </div>
      </div>

      {/* Class Information and Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Class Information</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Class Name:</span>
                <span className="text-gray-900">{classData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Grade Level:</span>
                <span className="text-gray-900">{classData.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Academic Year:</span>
                <span className="text-gray-900">{classData.academicYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  classData.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {classData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Created:</span>
                <span className="text-gray-900">{new Date(classData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Last Updated:</span>
                <span className="text-gray-900">{new Date(classData.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Sections Overview</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-700">Section</th>
                    <th className="text-left py-2 font-medium text-gray-700">Capacity</th>
                    <th className="text-left py-2 font-medium text-gray-700">Enrolled</th>
                    <th className="text-left py-2 font-medium text-gray-700">Available</th>
                    <th className="text-left py-2 font-medium text-gray-700">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.sections.map((section) => {
                    const enrolled = getStudentsBySection(section.name).length;
                    const available = (section.capacity || 0) - enrolled;
                    const utilization = section.capacity ? Math.round((enrolled / section.capacity) * 100) : 0;
                    
                    return (
                      <tr key={section._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium">{section.name}</td>
                        <td className="py-3">{section.capacity}</td>
                        <td className="py-3">{enrolled}</td>
                        <td className="py-3">{available}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${
                                  utilization >= 90 ? 'bg-red-500' :
                                  utilization >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${utilization}%` }}
                              />
                            </div>
                            <span className="text-xs">{utilization}%</span>
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
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Enrolled Students</h2>
          {isAdmin && (
            <button 
              onClick={handleAddStudent}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users size={16} className="mr-2" />
              Add Student
            </button>
          )}
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Admission No.</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Student Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Section</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Parent Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{student.admissionNumber}</td>
                      <td className="py-3 px-4">{student.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {student.section}
                        </span>
                      </td>
                      <td className="py-3 px-4">{student.parentName}</td>
                      <td className="py-3 px-4">{student.parentPhone}</td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => handleViewStudent(student._id)}
                          className="px-3 py-1 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="text-gray-400 mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Enrolled</h3>
              <p className="text-gray-600 mb-4">No students are currently enrolled in this class.</p>
              {isAdmin && (
                <button 
                  onClick={handleAddStudent}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
                >
                  <Users size={20} className="mr-2" />
                  Add First Student
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;