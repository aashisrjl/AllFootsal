import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const container: any = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const item: any = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.75) 100%), url(https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1920)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for additional depth */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="min-h-[88vh] md:min-h-[92vh] flex items-center pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
            {/* Left: copy */}
            <motion.div
              className="lg:col-span-7 text-white"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                <Star className="h-4 w-4 text-emerald-300" />
                Nepal’s all‑in‑one futsal booking & management platform
              </motion.div>

              <motion.h1
                variants={item}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
              >
                Book futsal faster.
                <span className="block text-emerald-300">Play more.</span>
              </motion.h1>

              <motion.p variants={item} className="mt-5 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed">
                Discover venues, check real‑time slots, and manage bookings with confidence — built for players, futsal owners, and organizers.
              </motion.p>

              <motion.div variants={item} className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  onClick={() => {
                    // goto localhost:3002
                    navigate('/auth/register/footsal')
                  }}
                >
                  Register Your Futsal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/15 border border-white/15 backdrop-blur"
                  onClick={() => {
                    // goto localhost:3002
                    window.location.href = "http://localhost:3002";
                  }}
                >
                  Futsal Admin
                </Button>
              </motion.div>

              <motion.div variants={item} className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <CalendarDays className="h-4 w-4 text-emerald-300" />
                    Real‑time slots
                  </div>
                  <div className="mt-1 text-lg font-semibold">Instant booking</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="h-4 w-4 text-emerald-300" />
                    Nearby venues
                  </div>
                  <div className="mt-1 text-lg font-semibold">Search by location</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    Trusted platform
                  </div>
                  <div className="mt-1 text-lg font-semibold">Secure & reliable</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: booking preview card */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden"
              >
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-white/70 text-sm">Today</div>
                      <div className="text-white text-xl font-bold">Available slots</div>
                    </div>
                    <div className="rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/25 px-3 py-1 text-xs font-semibold">
                      Live preview
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {["6:00", "7:00", "8:00", "9:00", "10:00", "11:00"].map((t, i) => (
                      <div
                        key={t}
                        className={[
                          "rounded-xl px-3 py-3 text-center text-sm font-semibold border",
                          i % 4 === 0
                            ? "bg-white/5 text-white/50 border-white/10 line-through"
                            : "bg-emerald-500/15 text-white border-emerald-400/25",
                        ].join(" ")}
                      >
                        {t}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-white/80 text-sm">
                      Popular venues fill up fast. Book early.
                    </div>
                    <div className="flex items-center gap-1 text-emerald-200 text-sm font-semibold">
                      4.8 <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-7 py-5 border-t border-white/10 bg-black/10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-white">
                      <div className="text-sm text-white/70">Next step</div>
                      <div className="font-semibold">Choose a venue → confirm</div>
                    </div>
                    <Button
                      className="bg-white text-slate-900 hover:bg-white/90"
                      onClick={() => {
                        navigate("/futsals");
                      }}
                    >
                      See Futsals
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white/70"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
