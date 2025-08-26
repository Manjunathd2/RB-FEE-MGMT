import React from 'react';
import { 
  Home, 
  Users, 
  Building, 
  Settings, 
  CreditCard, 
  BarChart3, 
  Kanban as KanbanIcon, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { User, NavigationItem } from '../../types';

interface SidebarProps {
  user: User;
  activeModule: string;
  onModuleChange: (module: string) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'overview',
    name: 'Overview',
    icon: 'Home',
    roles: ['provisioning', 'schoolAdmin', 'schoolManager', 'clerk']
  },
  {
    id: 'users',
    name: 'User Management',
    icon: 'Users',
    roles: ['provisioning', 'schoolAdmin']
  },
  {
    id: 'schools',
    name: 'School Management',
    icon: 'Building',
    roles: ['provisioning', 'schoolAdmin']
  },
  {
    id: 'provisioning',
    name: 'Provisioning',
    icon: 'Settings',
    roles: ['provisioning']
  },
  {
    id: 'billing',
    name: 'Billing',
    icon: 'CreditCard',
    roles: ['provisioning', 'schoolAdmin', 'clerk'],
    requiresSubscription: 'billing'
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: 'BarChart3',
    roles: ['provisioning', 'schoolAdmin', 'schoolManager'],
    requiresSubscription: 'reports'
  },
  {
    id: 'kanban',
    name: 'Kanban Board',
    icon: 'KanbanIcon',
    roles: ['provisioning', 'schoolAdmin', 'schoolManager', 'clerk'],
    requiresSubscription: 'kanban'
  }
];

const getIcon = (iconName: string) => {
  const icons = {
    Home,
    Users,
    Building,
    Settings,
    CreditCard,
    BarChart3,
    KanbanIcon
  };
  const IconComponent = icons[iconName as keyof typeof icons];
  return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
};

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  activeModule, 
  onModuleChange, 
  isCollapsed, 
  onToggleCollapsed 
}) => {
  const getVisibleItems = () => {
    return navigationItems.filter(item => {
      // Check role permission
      if (!item.roles.includes(user.role)) {
        return false;
      }
      
      // Check subscription requirement
      if (item.requiresSubscription && !user.subscriptions[item.requiresSubscription]) {
        return false;
      }
      
      return true;
    });
  };

  const visibleItems = getVisibleItems();

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Admin</span>
            </div>
          )}
          <button
            onClick={onToggleCollapsed}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {visibleItems.map((item) => {
            const isActive = activeModule === item.id;
            const isDisabled = item.requiresSubscription && !user.subscriptions[item.requiresSubscription];
            
            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && onModuleChange(item.id)}
                className={`
                  w-full flex items-center px-3 py-3 rounded-lg text-left transition-all
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : isDisabled 
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${isCollapsed ? 'justify-center' : 'space-x-3'}
                `}
                disabled={isDisabled}
                title={isCollapsed ? item.name : ''}
              >
                <div className={`${isActive ? 'text-white' : isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                  {getIcon(item.icon)}
                </div>
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
                {!isCollapsed && isDisabled && (
                  <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    Pro
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Active Subscriptions</h4>
              <div className="space-y-1">
                {Object.entries(user.subscriptions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 capitalize">{key}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      value 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {value ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;