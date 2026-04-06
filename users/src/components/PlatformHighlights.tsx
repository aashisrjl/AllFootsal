import { motion } from "framer-motion";
import { Building, Layout, Smartphone } from "lucide-react";
import user_page from "@/assets/ui-img/users.png";
import owner_page from "@/assets/ui-img/futsal-owner.png";
import admin_page from "@/assets/ui-img/admin.png";

export default function PlatformHighlights() {
  return (
    <section id="platforms" className="py-20 sm:py-24 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-400">
            Platforms
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            One ecosystem, three portals
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A tailored experience for players, venue owners, and administrators
            — with consistent design and powerful tools.
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-14">
          {/* Player portal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl dark:hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden">
                <div className="p-6 sm:p-7 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-red-400/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <span className="h-3 w-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Player Portal
                  </div>
                </div>
                <div className="h-[22rem] flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800">
                  <img
                    src={user_page}
                    alt="Player Portal"
                    className="h-full w-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.05,
              }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                NepFootsal Player Portal
              </h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                Find nearby futsals, compare slots, and reserve confidently —
                designed for speed on mobile.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Real-time availability of pitches",
                  "Instant booking confirmation",
                  "Location-based discovery",
                  "Reviews and ratings",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 group hover:border-emerald-500/30 transition-colors"
                  >
                    <span className="mt-0.5 h-6 w-6 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Owner portal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                NepFootsal Owner Portal
              </h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                A clean dashboard to manage pitches, schedules, payments, and
                day‑to‑day operations.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Manage pitches and booking slots",
                  "Daily, weekly, and monthly analytics",
                  "On-site QR for easy payments",
                  "Subscription and renewal tracking",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 group hover:border-sky-500/30 transition-colors"
                  >
                    <span className="mt-0.5 h-6 w-6 rounded-full bg-sky-600/15 dark:bg-sky-500/10 text-sky-800 dark:text-sky-400 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.05,
              }}
            >
              <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl dark:hover:shadow-sky-500/5 transition-all duration-300 overflow-hidden">
                <div className="p-6 sm:p-7 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-red-400/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <span className="h-3 w-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Owner Portal
                  </div>
                </div>
                <div className="h-[22rem] flex items-center justify-center bg-gradient-to-br from-sky-600 to-cyan-600 dark:from-sky-700 dark:to-cyan-800">
                  <img
                    src={owner_page}
                    alt="Owner Portal"
                    className="h-full w-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Admin dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl dark:hover:shadow-violet-500/5 transition-all duration-300 overflow-hidden">
                <div className="p-6 sm:p-7 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-red-400/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <span className="h-3 w-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Admin Dashboard
                  </div>
                </div>
                <div className="h-[22rem] flex items-center justify-center bg-gradient-to-br from-violet-600 to-purple-600 dark:from-violet-700 dark:to-purple-900">
                  <img
                    src={admin_page}
                    alt="Admin Dashboard"
                    className="h-full w-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.05,
              }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                NepFootsal Admin Dashboard
              </h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                Tools for administrators to keep the ecosystem healthy and
                growing.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Manage all futsals and users",
                  "Track revenue and subscriptions",
                  "Analyze booking data by region",
                  "AI-powered review summarization",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 group hover:border-violet-500/30 transition-colors"
                  >
                    <span className="mt-0.5 h-6 w-6 rounded-full bg-violet-600/15 dark:bg-violet-500/10 text-violet-800 dark:text-violet-400 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
