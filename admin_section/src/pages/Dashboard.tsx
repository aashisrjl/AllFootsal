import React from 'react';
import { Building, Users, CreditCard, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { name: 'Total Facilities', value: '12', icon: Building, change: '+2', changeType: 'increase' },
    { name: 'Active Users', value: '1,234', icon: Users, change: '+15%', changeType: 'increase' },
    { name: 'Monthly Revenue', value: '$12,345', icon: CreditCard, change: '+8%', changeType: 'increase' },
    { name: 'Growth Rate', value: '23%', icon: TrendingUp, change: '+3%', changeType: 'increase' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  from last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New facility registered', facility: 'Premium Sports Center', time: '2 hours ago' },
              { action: 'Subscription renewed', facility: 'City Futsal Arena', time: '4 hours ago' },
              { action: 'User complaint resolved', facility: 'Downtown Sports Hub', time: '6 hours ago' },
              { action: 'Maintenance scheduled', facility: 'Elite Futsal Complex', time: '1 day ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.facility}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;