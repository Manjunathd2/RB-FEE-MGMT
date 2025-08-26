import React, { useState } from 'react';
import { User } from '../../types';
import { Building, Plus, Search, MapPin, Users, Calendar, Edit, Eye, MoreHorizontal } from 'lucide-react';

interface SchoolManagementProps {
  user: User;
}

const mockSchools = [
  { 
    id: '1', 
    name: 'Lincoln High School', 
    location: 'Springfield, IL', 
    students: 1245, 
    teachers: 67, 
    established: '1995',
    status: 'active',
    subscription: 'premium'
  },
  { 
    id: '2', 
    name: 'Roosevelt Middle School', 
    location: 'Chicago, IL', 
    students: 892, 
    teachers: 43, 
    established: '2001',
    status: 'active',
    subscription: 'standard'
  },
  { 
    id: '3', 
    name: 'Washington Elementary', 
    location: 'Rockford, IL', 
    students: 456, 
    teachers: 28, 
    established: '1987',
    status: 'pending',
    subscription: 'basic'
  },
  { 
    id: '4', 
    name: 'Kennedy Academy', 
    location: 'Peoria, IL', 
    students: 234, 
    teachers: 18, 
    established: '2010',
    status: 'inactive',
    subscription: 'premium'
  }
];

const SchoolManagement: React.FC<SchoolManagementProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSchools = mockSchools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Building className="w-8 h-8 mr-3 text-blue-600" />
              School Management
            </h1>
            <p className="text-gray-600 mt-1">Manage schools and their configurations</p>
          </div>
          {user.role === 'provisioning' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add School
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search schools by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <div key={school.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{school.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {school.location}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(school.status)}`}>
                    {school.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">Students</span>
                  </div>
                  <span className="font-medium text-gray-900">{school.students.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">Teachers</span>
                  </div>
                  <span className="font-medium text-gray-900">{school.teachers}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">Established</span>
                  </div>
                  <span className="font-medium text-gray-900">{school.established}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionColor(school.subscription)}`}>
                  {school.subscription}
                </span>
                
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  {(user.role === 'provisioning' || user.role === 'schoolAdmin') && (
                    <button className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
          <p className="text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default SchoolManagement;