import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect if user is on home page
  const isHome = location.pathname === "/" || location.pathname === "/home";

  const scrollToSection = (id) => {
    if (!isHome) {
      navigate("/#" + id); // redirect to home first if not already there
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  // Dynamic styles
  const navBg = isHome
    ? isScrolled
      ? "bg-white shadow-md"
      : "bg-transparent"
    : "bg-white shadow-md";

  const textColor = isHome
    ? isScrolled
      ? "text-green-600"
      : "text-white"
    : "text-green-600";

  const linkColor = isHome
    ? isScrolled
      ? "text-gray-700 hover:text-green-600"
      : "text-white hover:text-green-300"
    : "text-gray-700 hover:text-green-600";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className={`flex items-center gap-2 font-bold text-2xl transition-colors ${textColor}`}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            AllFootsal
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("pricing")}
              className={`font-medium transition ${linkColor}`}
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/auth/login")}
              className={`font-medium transition ${linkColor}`}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth/register")}
              className={`font-medium transition ${linkColor} bg-green-600 rounded-lg px-3 py-1 text-white hover:bg-blue-500 hover:text-white`}
            >
              Register
            </button>
            <button
              onClick={() => navigate("/contact")}
              className={`font-medium transition ${linkColor}`}
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden transition ${textColor}`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left py-2 text-gray-700 hover:text-green-600"
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/auth/login")}
              className="block w-full text-left py-2 text-gray-700 hover:text-green-600"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth/register")}
              className="block w-full text-left py-2 text-gray-700 hover:bg-blue-600 hover:text-white bg-green-500 rounded-md"
            >
              Register
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="block w-full text-left py-2 text-gray-700 hover:text-green-600"
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
