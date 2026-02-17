import React from 'react';
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { name: 'Today\'s Bookings', value: '8', icon: Calendar, change: '+2', changeType: 'increase' },
    { name: 'Today\'s Revenue', value: '$420', icon: DollarSign, change: '+12%', changeType: 'increase' },
    { name: 'Active Players', value: '156', icon: Users, change: '+5', changeType: 'increase' },
    { name: 'Occupancy Rate', value: '78%', icon: TrendingUp, change: '+8%', changeType: 'increase' },
  ];

  const todayBookings = [
    { time: '08:00 - 09:00', pitch: 'Pitch A', player: 'John Smith', status: 'confirmed' },
    { time: '09:00 - 10:00', pitch: 'Pitch B', player: 'Mike Johnson', status: 'confirmed' },
    { time: '10:00 - 11:00', pitch: 'Pitch A', player: 'Sarah Wilson', status: 'pending' },
    { time: '14:00 - 15:00', pitch: 'Pitch C', player: 'Team Alpha', status: 'confirmed' },
    { time: '16:00 - 17:00', pitch: 'Pitch A', player: 'David Brown', status: 'confirmed' },
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
                  <Icon className="h-8 w-8 text-green-600" />
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
                  from yesterday
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Today's Bookings</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todayBookings.map((booking, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.time}</p>
                    <p className="text-sm text-gray-500">{booking.pitch} • {booking.player}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Weekly Revenue</h3>
          </div>
          <div className="p-6 flex items-center justify-center h-64 bg-gray-50">
            <p className="text-gray-500">Revenue chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;