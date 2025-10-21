import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Thank you for subscribing!');
    setEmail('');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-green-400">NepFootsal</h3>
            <p className="text-gray-400 mb-4">
              Nepal's first all-in-one futsal management and booking platform.
            </p>
            <p className="text-gray-400 mb-4 font-semibold">🌐 nepfootsal.com</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-green-400 transition">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-green-400 transition">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-green-400 transition">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-green-400 transition">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-green-400 transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('mission')} className="text-gray-400 hover:text-green-400 transition">
                  Mission
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('ecosystem')} className="text-gray-400 hover:text-green-400 transition">
                  Ecosystem
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('platforms')} className="text-gray-400 hover:text-green-400 transition">
                  Platforms
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-green-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">📍 Kathmandu, Nepal</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-green-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">📞 +977 9812345678</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-green-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">✉️ info@nepfootsal.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Stay updated with new futsal venues, tournaments, and events!
            </p>
            <p className="text-gray-400 mb-2 text-sm">👉 Enter your email to subscribe.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500 text-white"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
              >
                Subscribe
              </button>
            </form>
            {message && (
              <p className={`mt-2 text-sm ${message.includes('Thank') ? 'text-green-400' : 'text-yellow-400'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 NepFootsal. All rights reserved.</p>
          <p className="mt-2 text-sm">Designed and built to grow Nepal's futsal community ⚽🇳🇵</p>
        </div>
      </div>
    </footer>
  );
}
