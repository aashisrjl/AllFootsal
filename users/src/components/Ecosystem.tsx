import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  CalendarDays,
  BarChart3,
  Compass,
} from "lucide-react";

export default function Ecosystem() {
  return (
    <section
      id="ecosystem"
      className="relative py-20 sm:py-24 bg-slate-950 overflow-hidden"
    >
      {/* subtle background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-60 w-60 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-200 backdrop-blur">
            The Complete Futsal Ecosystem
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Everything you need to play, organize, and grow
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A connected experience for players, team organizers, and futsal venues—built to make every match easier to find, manage, and celebrate.
          </p>
        </motion.div>

        {/* four-pillars grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {/* Find Venues */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="group rounded-2xl border border-emerald-400/40 bg-gradient-to-b from-emerald-500/20 via-emerald-500/10 to-slate-950/60 px-5 py-6 sm:px-6 sm:py-7 shadow-[0_18px_45px_rgba(15,118,110,0.35)] backdrop-blur"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/60 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Find Venues
                </span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg">
                <Compass className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Discover and book futsal venues
            </h3>
            <p className="mt-2 text-sm text-emerald-100/90">
              Search across Nepal, compare facilities, and secure your preferred pitch in a few taps.
            </p>
          </motion.div>

          {/* Connect Players */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="group rounded-2xl border border-sky-400/40 bg-gradient-to-b from-sky-500/20 via-sky-500/10 to-slate-950/60 px-5 py-6 sm:px-6 sm:py-7 shadow-[0_18px_45px_rgba(56,189,248,0.35)] backdrop-blur"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 border border-sky-400/60 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
                  Connect Players
                </span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Build your squad and community
            </h3>
            <p className="mt-2 text-sm text-sky-100/90">
              Find teammates, fill missing players, and stay connected with your regular futsal circle.
            </p>
          </motion.div>

          {/* Manage Events */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="group rounded-2xl border border-emerald-400/30 bg-gradient-to-b from-emerald-400/15 via-slate-800/60 to-slate-950/80 px-5 py-6 sm:px-6 sm:py-7 shadow-[0_18px_45px_rgba(15,23,42,0.7)] backdrop-blur"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 border border-emerald-300/50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Manage Events
                </span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-emerald-300 flex items-center justify-center shadow-lg">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Organize tournaments with ease
            </h3>
            <p className="mt-2 text-sm text-slate-200">
              Create fixtures, manage schedules, and keep everyone updated from one central place.
            </p>
          </motion.div>

          {/* Track Success */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="group rounded-2xl border border-emerald-400/30 bg-gradient-to-b from-emerald-500/25 via-slate-900/70 to-slate-950 px-5 py-6 sm:px-6 sm:py-7 shadow-[0_18px_45px_rgba(22,163,74,0.45)] backdrop-blur"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-300/70 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-50">
                  Track Success
                </span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Monitor performance & milestones
            </h3>
            <p className="mt-2 text-sm text-emerald-50/95">
              Follow player stats, team progress, and venue performance so every win is visible and celebrated.
            </p>
          </motion.div>
        </motion.div>

        {/* bottom strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-12 rounded-2xl border border-slate-700/70 bg-slate-900/70 px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur"
        >
          <div>
            <p className="text-sm font-semibold text-slate-200 uppercase tracking-[0.22em]">
              One platform. Many ways to play.
            </p>
            <p className="mt-1 text-sm sm:text-base text-slate-300">
              From casual evening games to full tournaments, the ecosystem keeps everyone in sync.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="h-4 w-4 text-emerald-300" />
            Live today across major futsal hubs in Nepal.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
