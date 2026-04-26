import { logo_transparent, DashboardBanner } from "@/assets/images";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect if user is on home page
  const isHome = location.pathname === "/" || location.pathname === "/home";

  const scrollToSection = (id: string) => {
    if (!isHome) {
      navigate("/#" + id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  // Text & link color logic
  const textColor = isHome
    ? isScrolled
      ? "text-white"
      : "text-white"
    : "text-white";

  const linkColor = isHome
    ? isScrolled
      ? "text-white hover:text-green-600"
      : "text-white hover:text-green-300"
    : "text-white hover:text-green-600";

  const userImg = user?.profileImage;
  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const avatarFallbackClass = isHome && !isScrolled ? "bg-white/20 text-white" : "bg-green-600 text-white";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "shadow-md" : ""
        }`}
      style={{
        backgroundImage:
          isHome && !isScrolled
            ? "none"
            : `url(${DashboardBanner})`,
        backgroundColor: isHome && !isScrolled ? "transparent" : "rgba(255,255,255,0.9)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className={`flex items-center gap-2 font-bold text-2xl transition-colors ${textColor}`}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <img
              src={logo_transparent}
              alt="NepFutsal Logo"
              className="h-24 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => navigate("/pricing")}
              className={`font-medium transition ${linkColor}`}
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/forum")}
              className={`font-medium transition ${linkColor}`}
            >
              Forum
            </button>

            <button
              onClick={() => navigate("/contact")}
              className={`font-medium transition ${linkColor}`}
            >
              Contact
            </button>

            {isLoading ? null : isAuthenticated ? (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 outline-none"
              >
                <Avatar className="h-12 w-12 border border-white/20">
                  {userImg ? (
                    <img src={userImg} alt="User" className="h-full w-full object-cover" />
                  ) : (
                    <AvatarFallback className={avatarFallbackClass}>{userInitial}</AvatarFallback>
                  )}

                </Avatar>
                <span className={`font-medium transition ${linkColor}`}>
                  {user?.name || "Profile"}
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className={`font-medium transition ${linkColor}`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/register")}
                  className={`font-medium transition ${linkColor} bg-green-600 rounded-lg px-4 py-1 text-white hover:bg-blue-500`}
                >
                  Register
                </button>
              </>
            )}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => scrollToSection("/pricing")}
              className="block w-full text-left py-2 text-gray-700 hover:text-green-600"
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/forum")}
              className="block w-full text-left py-2 text-gray-700 hover:text-green-600"
            >
              Forum
            </button>
            {isLoading ? null : isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-green-600"
                >
                  Profile
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="block w-full text-left py-2 text-gray-700 hover:text-green-600"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/register")}
                  className="block w-full text-left py-2 text-white bg-green-600 hover:bg-blue-600 rounded-md"
                >
                  Register
                </button>
              </>
            )}
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
