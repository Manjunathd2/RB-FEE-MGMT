import React, { useState } from 'react';
import { User } from '../types';
import Sidebar from './layout/Sidebar';
import TopBar from './layout/TopBar';
import UserManagement from './modules/UserManagement';
import SchoolManagement from './modules/SchoolManagement';
import Provisioning from './modules/Provisioning';
import Billing from './modules/Billing';
import Reports from './modules/Reports';
import Kanban from './modules/Kanban';
import Overview from './modules/Overview';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeModule, setActiveModule] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderModule = () => {
    switch (activeModule) {
      case 'overview':
        return <Overview user={user} />;
      case 'users':
        return <UserManagement user={user} />;
      case 'schools':
        return <SchoolManagement user={user} />;
      case 'provisioning':
        return <Provisioning user={user} />;
      case 'billing':
        return <Billing user={user} />;
      case 'reports':
        return <Reports user={user} />;
      case 'kanban':
        return <Kanban user={user} />;
      default:
        return <Overview user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        user={user}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapsed={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} onLogout={onLogout} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;