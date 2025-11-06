import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  CreditCard,
  Star,
  User,
  Building2,
  BarChart3,
  QrCode,
} from "lucide-react";

export default function Ecosystem() {
  return (
    <section
      id="ecosystem"
      className="relative py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden"
    >
      {/* Decorative background circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Our Ecosystem
        </motion.h2>

        <motion.p
          className="text-lg sm:text-xl text-gray-600 mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          A connected platform that empowers <strong>players</strong> and{" "}
          <strong>futsal owners</strong> — simplifying bookings, management, and
          gameplay experiences.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Players Card */}
          <motion.div
            className="bg-gradient-to-br from-green-100 to-emerald-200 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02]"
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-3">
            For Players
            </h3>
            <ul className="space-y-5 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <Search className="text-green-600 mt-1" size={24} />
                <span>Discover futsal venues across Nepal</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-green-600 mt-1" size={24} />
                <span>View available slots and book instantly</span>
              </li>
              <li className="flex items-start gap-3">
                <CreditCard className="text-green-600 mt-1" size={24} />
                <span>Pay at the venue or securely via QR</span>
              </li>
              <li className="flex items-start gap-3">
                <Star className="text-green-600 mt-1" size={24} />
                <span>Rate and share your game experience</span>
              </li>
              <li className="flex items-start gap-3">
                <User className="text-green-600 mt-1" size={24} />
                <span>Create your personal futsal identity</span>
              </li>
            </ul>
          </motion.div>

          {/* Futsal Owners Card */}
          <motion.div
            className="bg-gradient-to-br from-blue-100 to-cyan-200 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02]"
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-3">
            For Futsal Owners
            </h3>
            <ul className="space-y-5 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <Building2 className="text-blue-600 mt-1" size={24} />
                <span>
                  Register your futsal and manage all bookings from one dashboard
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-600 mt-1" size={24} />
                <span>Add multiple pitches and time slots easily</span>
              </li>
              <li className="flex items-start gap-3">
                <BarChart3 className="text-blue-600 mt-1" size={24} />
                <span>Track customer activity, payments, and reports</span>
              </li>
              <li className="flex items-start gap-3">
                <QrCode className="text-blue-600 mt-1" size={24} />
                <span>Enable digital payments and instant QR booking</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
