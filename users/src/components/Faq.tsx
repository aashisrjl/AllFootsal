import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 sm:py-24 bg-white"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800">
            FAQ
          </div>
          <motion.h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Frequently asked questions
          </motion.h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Everything you need to know about how NepFootsal helps you play, manage, and grow.
          </p>
        </motion.div>

        <div className="mt-10 space-y-4 text-left">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-sm border border-slate-200/70 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                className="w-full flex justify-between items-center gap-4 px-5 sm:px-6 py-5 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-emerald-700 transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 sm:px-6 pb-6 text-slate-600 leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
