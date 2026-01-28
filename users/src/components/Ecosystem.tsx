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
      className="relative py-20 sm:py-24 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-sm font-semibold text-emerald-800">
            Our Ecosystem
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Built for every role in futsal
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A connected platform that supports players and futsal owners — simplifying bookings, operations, and the overall experience.
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Players */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="group rounded-3xl border border-slate-200/70 bg-white shadow-sm hover:shadow-xl transition-all"
          >
            <div className="p-7 sm:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-semibold">
                    For Players
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900">
                    Find venues. Book instantly.
                  </h3>
                  <p className="mt-2 text-slate-600">
                    Discover futsals nearby and lock your slot in seconds.
                  </p>
                </div>
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
                  <Star className="h-6 w-6" />
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
                  <Search className="mt-0.5 h-5 w-5 text-emerald-700" />
                  <span className="text-slate-700">Discover futsal venues across Nepal</span>
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-emerald-700" />
                  <span className="text-slate-700">View available slots and book instantly</span>
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
                  <CreditCard className="mt-0.5 h-5 w-5 text-emerald-700" />
                  <span className="text-slate-700">Pay at venue or via QR (where available)</span>
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
                  <Star className="mt-0.5 h-5 w-5 text-emerald-700" />
                  <span className="text-slate-700">Rate and review your experience</span>
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
                  <User className="mt-0.5 h-5 w-5 text-emerald-700" />
                  <span className="text-slate-700">Build your futsal identity</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Owners */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            whileHover={{ y: -6 }}
            className="group rounded-3xl border border-slate-200/70 bg-white shadow-sm hover:shadow-xl transition-all"
          >
            <div className="p-7 sm:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="inline-flex items-center rounded-full bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1 text-xs font-semibold">
                    For Futsal Owners
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900">
                    Manage bookings professionally.
                  </h3>
                  <p className="mt-2 text-slate-600">
                    Centralize schedules, payments, and performance insights.
                  </p>
                </div>
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm">
                  <Building2 className="h-6 w-6" />
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
                  <Building2 className="mt-0.5 h-5 w-5 text-sky-700" />
                  <span className="text-slate-700">
                    Register your futsal and manage bookings from one place
                  </span>
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-sky-700" />
                  <span className="text-slate-700">Add multiple pitches and time slots easily</span>
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
                  <BarChart3 className="mt-0.5 h-5 w-5 text-sky-700" />
                  <span className="text-slate-700">Track customer activity, payments, and reports</span>
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
                  <QrCode className="mt-0.5 h-5 w-5 text-sky-700" />
                  <span className="text-slate-700">Enable digital payments & on‑site QR booking</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
