import React, { useState } from 'react';
import { User } from '../../types';
import { Kanban as KanbanIcon, Plus, MoreHorizontal, Calendar, User as UserIcon, Flag } from 'lucide-react';

interface KanbanProps {
  user: User;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  tags: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const mockKanbanData: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: '1',
        title: 'Update user permissions',
        description: 'Review and update user access permissions for new school',
        assignee: 'Sarah Admin',
        priority: 'high',
        dueDate: '2024-01-20',
        tags: ['security', 'urgent']
      },
      {
        id: '2',
        title: 'Generate monthly report',
        description: 'Create comprehensive monthly performance report',
        assignee: 'Mike Manager',
        priority: 'medium',
        dueDate: '2024-01-25',
        tags: ['reports', 'monthly']
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      {
        id: '3',
        title: 'Database optimization',
        description: 'Optimize database queries for better performance',
        assignee: 'John Provisioner',
        priority: 'high',
        dueDate: '2024-01-18',
        tags: ['database', 'performance']
      },
      {
        id: '4',
        title: 'Invoice processing',
        description: 'Process pending invoices for Q1',
        assignee: 'Lisa Clerk',
        priority: 'medium',
        dueDate: '2024-01-22',
        tags: ['billing', 'finance']
      }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    tasks: [
      {
        id: '5',
        title: 'School onboarding checklist',
        description: 'Review completed onboarding process for new schools',
        assignee: 'Sarah Admin',
        priority: 'low',
        dueDate: '2024-01-30',
        tags: ['onboarding', 'review']
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: '6',
        title: 'System backup verification',
        description: 'Verified all system backups are working correctly',
        assignee: 'John Provisioner',
        priority: 'high',
        dueDate: '2024-01-15',
        tags: ['backup', 'system']
      },
      {
        id: '7',
        title: 'User training materials',
        description: 'Created comprehensive training materials for new users',
        assignee: 'Mike Manager',
        priority: 'medium',
        dueDate: '2024-01-12',
        tags: ['training', 'documentation']
      }
    ]
  }
];

const Kanban: React.FC<KanbanProps> = ({ user }) => {
  const [columns, setColumns] = useState<Column[]>(mockKanbanData);
  const [showAddTask, setShowAddTask] = useState(false);

  if (!user.subscriptions.kanban) {
    return (
      <div className="text-center py-12">
        <KanbanIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Kanban Access Required</h3>
        <p className="text-gray-500">You need kanban module access to view this page.</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    const baseClasses = "w-3 h-3";
    switch (priority) {
      case 'high':
        return <Flag className={`${baseClasses} text-red-500`} />;
      case 'medium':
        return <Flag className={`${baseClasses} text-yellow-500`} />;
      case 'low':
        return <Flag className={`${baseClasses} text-green-500`} />;
      default:
        return <Flag className={`${baseClasses} text-gray-500`} />;
    }
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'border-t-blue-500';
      case 'in-progress':
        return 'border-t-yellow-500';
      case 'review':
        return 'border-t-purple-500';
      case 'done':
        return 'border-t-green-500';
      default:
        return 'border-t-gray-500';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <KanbanIcon className="w-8 h-8 mr-3 text-blue-600" />
              Kanban Board
            </h1>
            <p className="text-gray-600 mt-1">Manage tasks and track project progress</p>
          </div>
          <button 
            onClick={() => setShowAddTask(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      <div className="flex space-x-6 overflow-x-auto pb-6">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className={`bg-white rounded-xl shadow-sm border-t-4 ${getColumnColor(column.id)} border-l border-r border-b border-gray-200 overflow-hidden`}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                      {column.tasks.length}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {column.tasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h4>
                      <div className="flex items-center space-x-1">
                        {getPriorityIcon(task.priority)}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-3 h-3" />
                        <span>{task.assignee}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority} priority
                      </span>
                    </div>
                  </div>
                ))}

                <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add task
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <KanbanIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">{columns.reduce((sum, col) => sum + col.tasks.length, 0)}</h4>
            <p className="text-gray-600 text-sm">Total Tasks</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">{columns.find(col => col.id === 'in-progress')?.tasks.length || 0}</h4>
            <p className="text-gray-600 text-sm">In Progress</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Flag className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">{columns.find(col => col.id === 'done')?.tasks.length || 0}</h4>
            <p className="text-gray-600 text-sm">Completed</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <UserIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">4</h4>
            <p className="text-gray-600 text-sm">Team Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kanban;