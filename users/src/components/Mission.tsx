import { motion } from "framer-motion";
import { Target, Users, TrendingUp } from "lucide-react";

export default function Mission() {
  return (
    <section
      id="mission"
      className="relative py-24 bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-300 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-400 opacity-20 blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Header Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-xl sm:text-2xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
            To digitalize Nepal’s futsal ecosystem — empowering players, venues, and organizers with technology that simplifies booking, management, and community growth.
          </p>
        </motion.div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* Empower Players */}
          <motion.div
            className="bg-white rounded-2xl shadow-md hover:shadow-lg p-8 transition-all duration-300 border border-green-100"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-4">
              <Target className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Empower Players
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Help players discover futsal venues, connect with teammates, and
              participate in tournaments effortlessly — all through one
              platform.
            </p>
          </motion.div>

          {/* Build Community */}
          <motion.div
            className="bg-white rounded-2xl shadow-md hover:shadow-lg p-8 transition-all duration-300 border border-green-100"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Build Community
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Create a thriving futsal community where players, venues, and
              organizers come together to share, grow, and celebrate the game.
            </p>
          </motion.div>

          {/* Drive Growth */}
          <motion.div
            className="bg-white rounded-2xl shadow-md hover:shadow-lg p-8 transition-all duration-300 border border-green-100"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-4">
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Drive Growth
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Empower futsal owners and organizers with smart management tools
              and analytics that promote sustainable business growth.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
