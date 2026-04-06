import { motion } from "framer-motion";
import { Target, Users, TrendingUp } from "lucide-react";

export default function Mission() {
  return (
    <section
      id="mission"
      className="relative py-20 sm:py-24 bg-white dark:bg-slate-950 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-400">
            Our Mission
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Digitalize Nepal’s futsal ecosystem
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Empower players, venues, and organizers with technology that simplifies booking, day‑to‑day management, and community growth.
          </p>
        </motion.div>

        {/* Mission Cards */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {/* Empower Players */}
          <motion.div
            className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-all duration-300 p-7 sm:p-8"
            whileHover={{ y: -6 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-3">
                <Target className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Empower players
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
              Help players discover futsal venues, connect with teammates, and
              participate in tournaments effortlessly — all through one
              platform.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Build Community */}
          <motion.div
            className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-all duration-300 p-7 sm:p-8"
            whileHover={{ y: -6 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-3">
                <Users className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Build community
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
              Create a thriving futsal community where players, venues, and
              organizers come together to share, grow, and celebrate the game.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Drive Growth */}
          <motion.div
            className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-all duration-300 p-7 sm:p-8"
            whileHover={{ y: -6 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-3">
                <TrendingUp className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Drive growth
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
              Empower futsal owners and organizers with smart management tools
              and analytics that promote sustainable business growth.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
