import React from "react";

const TESTIMONIALS = [
  { name: "Suman", place: "Kathmandu", text: "Great turf & friendly staff. Always on time." },
  { name: "Maya", place: "Pokhara", text: "Easy booking and well-maintained pitch." },
  { name: "Ramesh", place: "Butwal", text: "Perfect for evening play. Lights are good." },
  { name: "Priya", place: "Lalitpur", text: "Good price and helpful owner. Will return!" },
  { name: "Bikash", place: "Dharan", text: "Spacious and clean. Parking is a bit tight though." },
  { name: "Anita", place: "Hetauda", text: "Great atmosphere. Recommended for 5v5." },
];

export default function TestimonialsMarquee() {
  // Duplicate items for seamless loop
  const row1 = [...TESTIMONIALS, ...TESTIMONIALS];
  const row2 = [...TESTIMONIALS.slice().reverse(), ...TESTIMONIALS.slice().reverse()];

  return (
    <section className="py-16 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-6 text-center">
          What Our Customers Say
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto font-medium">
          Real feedback from players across Nepal — honest, short, and helpful.
        </p>

        {/* Marquee Container */}
        <div className="space-y-6">
          {/* Row 1 - left to right */}
          <div className="relative overflow-hidden">
            <div
              className="flex gap-6 items-stretch animate-marquee-ltr"
              aria-hidden="true"
            >
              {row1.map((t, i) => (
                <article
                  key={`r1-${i}`}
                  className="w-72 min-w-[18rem] bg-white dark:bg-slate-900 rounded-2xl shadow-md dark:shadow-emerald-500/5 p-5 flex flex-col justify-between border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-lg shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{t.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.place}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium italic">"{t.text}"</p>
                </article>
              ))}
            </div>
          </div>

          {/* Row 2 - right to left (opposite) */}
          <div className="relative overflow-hidden">
            <div
              className="flex gap-6 items-stretch animate-marquee-rtl"
              aria-hidden="true"
            >
              {row2.map((t, i) => (
                <article
                  key={`r2-${i}`}
                  className="w-72 min-w-[18rem] bg-white dark:bg-slate-900 rounded-2xl shadow-md dark:shadow-emerald-500/5 p-5 flex flex-col justify-between border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-lg shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{t.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.place}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium italic">"{t.text}"</p>
                </article>
              ))}
            </div>
          </div>

          {/* Small note for accessibility */}
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center font-medium">
            Testimonials auto-scroll. Hover to pause.
          </p>
        </div>
      </div>

      {/* Inline styles for marquee animation. You can move these to your global CSS. */}
      <style>{`
        @keyframes marquee-ltr {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-rtl {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-ltr {
          animation: marquee-ltr 28s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 28s linear infinite;
        }
        /* Pause animation on hover for accessibility */
        .animate-marquee-ltr:hover,
        .animate-marquee-rtl:hover {
          animation-play-state: paused;
        }

        /* Reduce motion for users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-ltr,
          .animate-marquee-rtl {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
