import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar.jsx';
import TopNav from './components/Layout/TopNav.jsx';
import Dashboard from './Dashboard.jsx';
import StudentManagement from './components/StudentManagement.jsx';
import PaymentHistory from './components/PaymentHistory.jsx';
import Settings from './components/Settings.jsx';
import ClassDetails from './components/ClassDetails.jsx';
import ClassList from './components/ClassList.jsx';
import ClassForm from './components/ClassForm.jsx';
import CollectFee from './components/CollectFee.jsx';
import EnhancedCollectFee from './components/EnhancedCollectFee.jsx';
import FeeStructure from './components/FeeStructure.jsx';
import AddStudent from './components/AddStudent.jsx';
import DefaultersList from './components/DefaultersList.jsx';
import Reports from './components/Reports.jsx';
import AcademicYear from './components/AcademicManagement/AcademicYear.jsx';
import AcademicArchive from './components/AcademicManagement/AcademicArchive.jsx';
import StudentPromotion from './components/AcademicManagement/StudentPromotion.jsx';
import FeeBalanceCarryForward from './components/FeeManagement/FeeBalanceCarryForward.jsx';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [editingClassId, setEditingClassId] = useState(null);
  const [user] = useState({
    name: 'Admin User',
    email: 'admin@school.com',
    role: 'Administrator'
  });

  const handleModuleChange = (moduleId) => {
    setActiveModule(moduleId);
    setSelectedClassId(null);
    setEditingClassId(null);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Implement logout logic
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <Dashboard 
            onViewClass={(classId) => {
              setSelectedClassId(classId);
              setActiveModule('classDetails');
            }}
            onViewClassList={() => setActiveModule('classList')}
            onCollectFee={() => setActiveModule('collectFee')}
            onAddStudent={() => setActiveModule('addStudent')}
            onDefaultersList={() => setActiveModule('defaultersList')}
            onReports={() => setActiveModule('reports')}
            onFeeStructure={() => setActiveModule('feeStructure')}
            onEnhancedCollectFee={() => setActiveModule('enhancedCollectFee')}
            onStudentManagement={() => setActiveModule('studentManagement')}
            onPaymentHistory={() => setActiveModule('paymentHistory')}
            onSettings={() => setActiveModule('settings')}
          />
        );
      
      case 'studentManagement':
        return (
          <StudentManagement 
            onBack={() => setActiveModule('dashboard')}
            onAddStudent={() => setActiveModule('addStudent')}
          />
        );
      
      case 'addStudent':
        return (
          <AddStudent 
            onBack={() => setActiveModule('studentManagement')}
            onSave={() => setActiveModule('studentManagement')}
          />
        );
      
      case 'classList':
        return (
          <ClassList 
            onViewClass={(classId) => {
              setSelectedClassId(classId);
              setActiveModule('classDetails');
            }}
            onEditClass={(classId) => {
              setEditingClassId(classId);
              setActiveModule('classForm');
            }}
            onAddClass={() => {
              setEditingClassId(null);
              setActiveModule('classForm');
            }}
            onBackToDashboard={() => setActiveModule('dashboard')}
            isAdmin={true}
          />
        );
      
      case 'classDetails':
        return (
          <ClassDetails 
            classId={selectedClassId}
            onBack={() => setActiveModule('classList')}
            onEditClass={(classId) => {
              setEditingClassId(classId);
              setActiveModule('classForm');
            }}
            onAddStudent={() => setActiveModule('addStudent')}
            isAdmin={true}
          />
        );
      
      case 'classForm':
        return (
          <ClassForm 
            classId={editingClassId}
            onBack={() => {
              setActiveModule('classList');
              setEditingClassId(null);
            }}
            onSave={() => {
              setActiveModule('classList');
              setEditingClassId(null);
            }}
          />
        );
      
      case 'collectFee':
        return <CollectFee onBack={() => setActiveModule('dashboard')} />;
      
      case 'enhancedCollectFee':
        return <EnhancedCollectFee onBack={() => setActiveModule('dashboard')} />;
      
      case 'feeStructure':
        return <FeeStructure onBack={() => setActiveModule('dashboard')} />;
      
      case 'paymentHistory':
        return <PaymentHistory onBack={() => setActiveModule('dashboard')} />;
      
      case 'defaultersList':
        return <DefaultersList onBack={() => setActiveModule('dashboard')} />;
      
      case 'reports':
        return <Reports onBack={() => setActiveModule('dashboard')} />;
      
      case 'settings':
        return <Settings onBack={() => setActiveModule('dashboard')} />;
      
      case 'academicYear':
        return <AcademicYear onBack={() => setActiveModule('dashboard')} />;
      
      case 'academicArchive':
        return <AcademicArchive onBack={() => setActiveModule('dashboard')} />;
      
      case 'studentPromotion':
        return <StudentPromotion onBack={() => setActiveModule('dashboard')} />;
      
      case 'feeBalanceCarryForward':
        return <FeeBalanceCarryForward onBack={() => setActiveModule('dashboard')} />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col">
        <TopNav 
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

export default App;