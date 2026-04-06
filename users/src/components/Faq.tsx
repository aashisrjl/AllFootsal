import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "What is NepFootsal?",
    answer:
      "NepFootsal is a digital futsal ecosystem that connects players, venues, and organizers across Nepal. You can book futsal courts, manage tournaments, and grow your futsal community — all in one platform.",
  },
  {
    question: "How can I register my futsal venue?",
    answer:
      "Simply create an account, go to the ‘Register Futsal’ section, and fill out your venue details. After registration, you can choose a subscription plan and start managing your bookings and schedules online.",
  },
  {
    question: "Do I need a subscription to list my futsal?",
    answer:
      "Yes, futsal owners can choose from flexible subscription plans — NPR 999/month, NPR 5,000 for 6 months, or NPR 10,000 for 1 year — to access all management and analytics tools.",
  },
  {
    question: "Can players book futsal courts online?",
    answer:
      "Absolutely! Players can browse listed futsals, view available time slots, and book directly through our secure online booking system.",
  },
  {
    question: "Is NepFootsal available across Nepal?",
    answer:
      "Yes! Our platform is expanding nationwide, and we aim to connect futsal venues, players, and tournaments from every region of Nepal.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Header Section */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 text-sm font-bold text-emerald-800 dark:text-emerald-400">
              Support Center
            </div>
            <h2 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Frequently asked questions
            </h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Find answers to common questions about booking, management, and the NepFootsal ecosystem.
            </p>

            <div className="mt-10 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-emerald-500/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Still have questions?</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">We're here to help you 24/7.</p>
                </div>
              </div>
              <button
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-emerald-600 px-6 py-4 text-sm font-bold text-white hover:bg-slate-800 dark:hover:bg-emerald-700 transition-all shadow-lg"
                onClick={() => (window.location.href = "/contact")}
              >
                Contact Support
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* FAQ Accordion Section */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={`group rounded-3xl border transition-all duration-300 overflow-hidden ${
                  activeIndex === index
                    ? "bg-white dark:bg-slate-900 border-emerald-500/30 shadow-2xl dark:shadow-emerald-500/10"
                    : "bg-transparent border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <button
                  className="w-full flex justify-between items-center gap-6 px-7 py-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span
                    className={`text-lg sm:text-xl font-bold tracking-tight transition-colors duration-300 ${
                      activeIndex === index
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      activeIndex === index
                        ? "bg-emerald-500 border-emerald-500 text-white rotate-180"
                        : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-400"
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-7 pb-7 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        <div className="h-px w-10 bg-emerald-500/30 mb-5" />
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
  );
}
