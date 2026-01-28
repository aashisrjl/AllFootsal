import { logo_transparent } from "@/assets/images";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Thank you for subscribing!");
    setEmail("");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            {/* <h3 className="text-2xl font-bold mb-4 text-green-400">NepFootsal</h3> */}
            <img
              src={logo_transparent}
              alt="NepFutsal Logo"
              className="h-20 w-auto object-contain mb-5 transition-transform duration-300 hover:scale-105"
            />
            <p className="text-slate-300/80 mb-4 leading-relaxed">
              Nepal's first all-in-one futsal management and booking platform.
            </p>
            <p className="text-slate-300/80 mb-4 font-semibold">
              allfootsal.com
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-white/70 hover:text-emerald-300 transition"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-white/70 hover:text-emerald-300 transition"
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-white/70 hover:text-emerald-300 transition"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-white/70 hover:text-emerald-300 transition"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-slate-300/80 hover:text-emerald-300 transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("mission")}
                  className="text-slate-300/80 hover:text-emerald-300 transition"
                >
                  Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("ecosystem")}
                  className="text-slate-300/80 hover:text-emerald-300 transition"
                >
                  Ecosystem
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("platforms")}
                  className="text-slate-300/80 hover:text-emerald-300 transition"
                >
                  Platforms
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-slate-300/80 hover:text-emerald-300 transition"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/forum")}
                  className="text-slate-300/80 hover:text-emerald-300 transition"
                >
                  Forum
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin
                  size={20}
                  className="text-emerald-300 flex-shrink-0 mt-1"
                />
                <span className="text-slate-300/80">Kathmandu, Nepal</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  size={20}
                  className="text-emerald-300 flex-shrink-0 mt-1"
                />
                <span className="text-slate-300/80">+977 9800000000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-emerald-300 flex-shrink-0 mt-1" />
                <span className="text-slate-300/80">info@allfootsal.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-slate-300/80 mb-4">
              Stay updated with new futsal venues, tournaments, and events!
            </p>
            <p className="text-slate-300/70 mb-2 text-sm">
              Enter your email to subscribe.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-emerald-400 text-white placeholder:text-white/40"
              />
              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold transition shadow-lg shadow-emerald-500/15"
              >
                Subscribe
              </motion.button>
            </form>
            {message && (
              <p
                className={`mt-2 text-sm ${
                  message.includes("Thank")
                    ? "text-emerald-300"
                    : "text-yellow-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-slate-300/70">
          <p>&copy; 2025 AllFootsal. All rights reserved.</p>
          <p className="mt-2 text-sm">Designed to grow Nepal's futsal community.</p>
        </div>
      </div>
    </footer>
  );
}
