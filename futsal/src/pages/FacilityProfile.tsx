import React from 'react';
import { Building2, MapPin, Clock, Star, Edit } from 'lucide-react';

const FacilityProfile = () => {
  const facility = {
    name: 'Elite Sports Arena',
    location: '123 Sports Street, Downtown City',
    description: 'Premium futsal facility with state-of-the-art pitches and amenities.',
    rating: 4.8,
    reviews: 156,
    amenities: ['Parking', 'Changing Rooms', 'Cafeteria', 'Equipment Rental', 'Wi-Fi'],
    operatingHours: {
      weekdays: '6:00 AM - 11:00 PM',
      weekends: '7:00 AM - 12:00 AM'
    },
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'info@elitesportsarena.com'
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Facility Profile</h1>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{facility.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {facility.location}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  {facility.rating} ({facility.reviews} reviews)
                </div>
              </div>
              <p className="text-gray-700">{facility.description}</p>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {facility.amenities.map((amenity, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Operating Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Weekdays: {facility.operatingHours.weekdays}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Weekends: {facility.operatingHours.weekends}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-sm text-gray-900">{facility.contact.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm text-gray-900">{facility.contact.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Bookings</span>
                <span className="text-sm font-medium text-gray-900">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-sm font-medium text-gray-900">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Revenue (MTD)</span>
                <span className="text-sm font-medium text-gray-900">$7,800</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Pitches</span>
                <span className="text-sm font-medium text-gray-900">4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityProfile;