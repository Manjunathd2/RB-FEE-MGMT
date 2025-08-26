import React from 'react';
import { User } from '../../types';
import { Users, Building, CreditCard, BarChart3, TrendingUp, Activity } from 'lucide-react';

interface OverviewProps {
  user: User;
}

const Overview: React.FC<OverviewProps> = ({ user }) => {
  const getMetrics = () => {
    switch (user.role) {
      case 'provisioning':
        return [
          { title: 'Total Schools', value: '247', change: '+12', icon: Building, color: 'blue' },
          { title: 'Active Users', value: '15,234', change: '+324', icon: Users, color: 'green' },
          { title: 'Revenue', value: '$84,250', change: '+8.2%', icon: CreditCard, color: 'purple' },
          { title: 'System Uptime', value: '99.9%', change: '+0.1%', icon: Activity, color: 'orange' }
        ];
      case 'schoolAdmin':
        return [
          { title: 'Students', value: '1,234', change: '+45', icon: Users, color: 'blue' },
          { title: 'Teachers', value: '87', change: '+3', icon: Users, color: 'green' },
          { title: 'Monthly Cost', value: '$2,340', change: '-5%', icon: CreditCard, color: 'purple' },
          { title: 'Performance', value: '94%', change: '+2%', icon: TrendingUp, color: 'orange' }
        ];
      case 'schoolManager':
        return [
          { title: 'Active Tasks', value: '156', change: '+12', icon: Activity, color: 'blue' },
          { title: 'Completed', value: '89%', change: '+5%', icon: TrendingUp, color: 'green' },
          { title: 'Reports', value: '23', change: '+7', icon: BarChart3, color: 'purple' },
          { title: 'Efficiency', value: '92%', change: '+3%', icon: Activity, color: 'orange' }
        ];
      case 'clerk':
        return [
          { title: 'Invoices', value: '47', change: '+8', icon: CreditCard, color: 'blue' },
          { title: 'Processed', value: '98%', change: '+1%', icon: TrendingUp, color: 'green' },
          { title: 'Pending', value: '12', change: '-3', icon: Activity, color: 'purple' },
          { title: 'Tasks Done', value: '156', change: '+14', icon: Activity, color: 'orange' }
        ];
      default:
        return [];
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'purple':
        return 'bg-purple-500 text-white';
      case 'orange':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const metrics = getMetrics();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your dashboard today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${getColorClasses(metric.color)} flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  metric.change.startsWith('+') 
                    ? 'bg-green-100 text-green-700' 
                    : metric.change.startsWith('-')
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-sm">{metric.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'User login', user: 'Sarah Chen', time: '2 minutes ago' },
              { action: 'Report generated', user: 'Mike Johnson', time: '15 minutes ago' },
              { action: 'Invoice processed', user: 'Lisa Wong', time: '1 hour ago' },
              { action: 'New school added', user: 'John Smith', time: '3 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Access</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Role</span>
              <span className="text-sm text-blue-700 font-semibold capitalize">
                {user.role === 'schoolAdmin' ? 'School Admin' : 
                 user.role === 'schoolManager' ? 'School Manager' : 
                 user.role === 'provisioning' ? 'Provisioning Team' : 
                 user.role}
              </span>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Module Access</h4>
              {Object.entries(user.subscriptions).map(([module, hasAccess]) => (
                <div key={module} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700 capitalize">{module}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    hasAccess 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {hasAccess ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;