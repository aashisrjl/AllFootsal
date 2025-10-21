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
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-24 bg-gradient-to-br from-white to-green-50 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 opacity-20 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-400 opacity-20 blur-3xl rounded-full -z-10"></div>

      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          className="text-5xl font-extrabold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Frequently Asked Questions
        </motion.h2>
        <p className="text-lg text-gray-600 mb-12">
          Everything you need to know about how NepFootsal helps you play, manage, and grow.
        </p>

        <div className="space-y-5 text-left">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-md border border-green-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-green-600 transition-transform duration-300 ${
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
                    className="px-6 pb-6 text-gray-600"
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
