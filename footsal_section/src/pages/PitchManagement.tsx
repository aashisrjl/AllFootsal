import React from 'react';
import { MapPin, Plus, Edit, ToggleLeft, ToggleRight, Wrench } from 'lucide-react';

const PitchManagement = () => {
  const pitches = [
    { 
      id: 1, 
      name: 'Pitch A', 
      pricePerHour: 50, 
      isActive: true, 
      surface: 'Artificial Grass',
      size: '40m x 20m',
      bookingsToday: 6,
      revenue: 300,
      isUnderMaintenance: false
    },
    { 
      id: 2, 
      name: 'Pitch B', 
      pricePerHour: 45, 
      isActive: true, 
      surface: 'Artificial Grass',
      size: '35m x 20m',
      bookingsToday: 4,
      revenue: 180,
      isUnderMaintenance: false
    },
    { 
      id: 3, 
      name: 'Pitch C', 
      pricePerHour: 40, 
      isActive: false, 
      surface: 'Concrete',
      size: '30m x 18m',
      bookingsToday: 0,
      revenue: 0,
      isUnderMaintenance: true
    },
  ];

  const togglePitchStatus = (id: number) => {
    console.log(`Toggle pitch ${id} status`);
  };

  const editPitch = (id: number) => {
    console.log(`Edit pitch ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pitch Management</h1>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Pitch
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pitches</p>
              <p className="text-2xl font-semibold text-gray-900">{pitches.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ToggleRight className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Pitches</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pitches.filter(p => p.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Wrench className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Maintenance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pitches.filter(p => p.isUnderMaintenance).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">$</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${pitches.reduce((sum, p) => sum + p.revenue, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pitches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pitches.map((pitch) => (
          <div key={pitch.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{pitch.name}</h3>
                <div className="flex items-center space-x-2">
                  {pitch.isUnderMaintenance ? (
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                      Maintenance
                    </span>
                  ) : (
                    <button
                      onClick={() => togglePitchStatus(pitch.id)}
                      className="flex items-center"
                    >
                      {pitch.isActive ? (
                        <ToggleRight className="h-6 w-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price per hour</span>
                  <span className="text-sm font-medium text-gray-900">${pitch.pricePerHour}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Surface</span>
                  <span className="text-sm font-medium text-gray-900">{pitch.surface}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Size</span>
                  <span className="text-sm font-medium text-gray-900">{pitch.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bookings today</span>
                  <span className="text-sm font-medium text-gray-900">{pitch.bookingsToday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue today</span>
                  <span className="text-sm font-medium text-gray-900">${pitch.revenue}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => editPitch(pitch.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                  View Schedule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PitchManagement;