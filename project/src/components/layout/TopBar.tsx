import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../../types';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

const getRoleDisplayName = (role: User['role']) => {
  switch (role) {
    case 'provisioning':
      return 'Provisioning Team';
    case 'schoolAdmin':
      return 'School Admin';
    case 'schoolManager':
      return 'School Manager';
    case 'clerk':
      return 'Clerk';
    default:
      return role;
  }
};

const getRoleColor = (role: User['role']) => {
  switch (role) {
    case 'provisioning':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'schoolAdmin':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'schoolManager':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'clerk':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const TopBar: React.FC<TopBarProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;