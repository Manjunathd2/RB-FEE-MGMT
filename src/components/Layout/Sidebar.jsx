import React from 'react';
import { 
  Home, 
  Users, 
  GraduationCap, 
  DollarSign, 
  CreditCard, 
  FileText, 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  Calendar,
  UserCheck,
  TrendingUp,
  Archive,
  Target
} from 'lucide-react';

const Sidebar = ({ activeModule, onModuleChange, isCollapsed, onToggleCollapse }) => {
  const menuItems = [
    {
      category: 'Dashboard',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home }
      ]
    },
    {
      category: 'Student Management',
      items: [
        { id: 'studentManagement', label: 'Students', icon: Users },
        { id: 'addStudent', label: 'Add Student', icon: UserCheck },
        { id: 'studentPromotion', label: 'Student Promotion', icon: TrendingUp }
      ]
    },
    {
      category: 'Academic Management',
      items: [
        { id: 'academicYear', label: 'Academic Year', icon: Calendar },
        { id: 'classList', label: 'Classes', icon: GraduationCap },
        { id: 'academicArchive', label: 'Academic Archive', icon: Archive }
      ]
    },
    {
      category: 'Fee Management',
      items: [
        { id: 'feeStructure', label: 'Fee Structure', icon: Settings },
        { id: 'enhancedCollectFee', label: 'Collect Fees', icon: CreditCard },
        { id: 'collectFee', label: 'Quick Collection', icon: DollarSign },
        { id: 'feeBalanceCarryForward', label: 'Balance Carry Forward', icon: Target },
        { id: 'paymentHistory', label: 'Payment History', icon: FileText }
      ]
    },
    {
      category: 'Reports & Analytics',
      items: [
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'defaultersList', label: 'Defaulters', icon: AlertTriangle }
      ]
    },
    {
      category: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold">School Admin</h1>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="mt-8">
        {menuItems.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            {!isCollapsed && (
              <div className="px-4 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {category.category}
                </h3>
              </div>
            )}
            <ul className="space-y-1">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onModuleChange(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white border-r-4 border-blue-400'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <Icon size={20} className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                      {!isCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;