import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompleteEcosystem() {
  return (
    <section className="relative py-20 sm:py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 opacity-40 dark:opacity-100 bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.1),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.1),transparent_55%)] dark:bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.35),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.25),transparent_55%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-white">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-4 py-1.5 text-sm font-bold text-slate-800 dark:text-white/90 backdrop-blur">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            Complete ecosystem
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Everything futsal needs, in one platform
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-white/75 max-w-3xl mx-auto leading-relaxed font-medium">
            One place to play, manage, and grow — designed for players, owners, and admins with a consistent, professional experience.
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "For Players",
              icon: <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-200" />,
              items: ["Find and book venues", "Connect with players", "Review and rate futsals"],
            },
            {
              title: "For Owners",
              icon: <ShieldCheck className="h-5 w-5 text-sky-600 dark:text-sky-200" />,
              items: ["Manage bookings & pitches", "View analytics & reports", "Enable QR payments"],
            },
            {
              title: "For Admins",
              icon: <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-200" />,
              items: ["Oversee platform operations", "Approve registrations", "Track revenue & insights"],
            },
          ].map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.06 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md p-7 shadow-sm hover:shadow-xl dark:hover:shadow-emerald-500/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">{card.title}</h3>
              </div>
              <ul className="mt-6 space-y-3 text-slate-600 dark:text-white/80">
                {card.items.map((t) => (
                  <li key={t} className="flex items-start gap-3 group font-medium">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-300/80 group-hover:scale-125 transition-transform" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="mt-14 sm:mt-16 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md p-7 sm:p-10 shadow-lg dark:shadow-emerald-500/5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Join the AllFutsal community</h3>
              <p className="mt-3 text-slate-600 dark:text-white/75 max-w-2xl leading-relaxed font-medium">
                Connect with venues and players across Nepal — a trusted hub built to make futsal simpler and more accessible.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
              onClick={() => {
                window.location.href = "/forum";
              }}
            >
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
