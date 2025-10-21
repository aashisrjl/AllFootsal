import { Search, MapPin, CreditCard, Star, User, Building2, BarChart3, QrCode, ShieldCheck, Users, FileCheck, TrendingUp } from 'lucide-react';

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4">
            Our Ecosystem
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            {/* <div className="text-5xl mb-6">⚽</div> */}
            <h3 className="text-3xl font-bold text-gray-900 mb-6">For Players</h3>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <Search className="text-green-600 flex-shrink-0 mt-1" size={24} />
                <span>Search futsal venues across Nepal</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-green-600 flex-shrink-0 mt-1" size={24} />
                <span>View available time slots and book instantly</span>
              </li>
              <li className="flex items-start gap-3">
                <CreditCard className="text-green-600 flex-shrink-0 mt-1" size={24} />
                <span>Pay at the futsal or via QR code</span>
              </li>
              <li className="flex items-start gap-3">
                <Star className="text-green-600 flex-shrink-0 mt-1" size={24} />
                <span>Rate and review your playing experience</span>
              </li>
              <li className="flex items-start gap-3">
                <User className="text-green-600 flex-shrink-0 mt-1" size={24} />
                <span>Build your own futsal profile</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            {/* <div className="text-5xl mb-6">🏟️</div> */}
            <h3 className="text-3xl font-bold text-gray-900 mb-6">For Futsal Owners</h3>
            <ul className="space-y-4 text-gray-700 text-lg mb-6">
              <li className="flex items-start gap-3">
                <Building2 className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <span>Register your futsal and manage all bookings from one dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <span>Add multiple pitches and time slots</span>
              </li>
              <li className="flex items-start gap-3">
                <BarChart3 className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <span>Track customer bookings and payments</span>
              </li>
              <li className="flex items-start gap-3">
                <QrCode className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <span>Get AI-powered insights and review summaries</span>
              </li>
            </ul>
            {/* <div className="bg-white p-6 rounded-xl mt-6">
              <p className="font-bold text-gray-900 mb-3">Choose subscription plans:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between items-center">
                  <span>Monthly</span>
                  <span className="font-bold text-blue-600">NPR 999</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>6 Months</span>
                  <span className="font-bold text-blue-600">NPR 5,000</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Yearly</span>
                  <span className="font-bold text-blue-600">NPR 10,000</span>
                </li>
              </ul>
            </div> */}
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            {/* <div className="text-5xl mb-6">🧑‍💼</div> */}
            <h3 className="text-3xl font-bold text-gray-900 mb-6">For Admins</h3>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <ShieldCheck className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                <span>Approve futsal registrations and manage subscriptions</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                <span>Monitor bookings across all venues</span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                <span>View platform analytics and reports</span>
              </li>
              <li className="flex items-start gap-3">
                <FileCheck className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                <span>Manage user reviews and resolve disputes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
