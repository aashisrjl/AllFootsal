import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Menu, X, ArrowLeft, Home, Info, Image, Map, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function FutsalNavigation({ name }: { name?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [activeHash, setActiveHash] = useState("home");

  const isReviewsPage = location.pathname.includes("/reviews");
  const isBookingsPage = location.pathname.includes("/bookings");
  const isGalleryPage = location.pathname.includes("/gallery");
  const isOverviewPage = !isReviewsPage && !isBookingsPage && !isGalleryPage;

  useEffect(() => {
    if (isOverviewPage) {
      const handleScroll = () => {
        const sections = ["home", "about", "gallery", "pitches", "reviews"];
        let current = "home";
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            // If the top of the element is near or above the middle of screen
            if (rect.top <= window.innerHeight / 2) {
              current = section;
            }
          }
        }
        setActiveHash(current);
      };
      
      handleScroll(); // Call once to set initially
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isOverviewPage]);

  // If there's a hash in the URL on mount, scroll to it
  useEffect(() => {
    if (isOverviewPage && location.hash) {
      const hash = location.hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location, isOverviewPage]);

  const handleNav = (hash: string) => {
    setIsMenuOpen(false);
    if (!isOverviewPage) {
       if (hash === "gallery") {
         navigate(`/futsals/${id}/gallery`);
       } else if (hash === "reviews") {
         navigate(`/futsals/${id}/reviews`);
       } else if (hash === "pitches") {
         navigate(`/futsals/${id}/bookings`);
       } else {
         navigate(`/futsals/${id}#${hash}`);
       }
    } else {
       document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
       setActiveHash(hash);
    }
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About Us", icon: Info },
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "pitches", label: "Pitches", icon: Map },
    { id: "reviews", label: "Reviews", icon: Star }
  ];

  const getActiveClass = (itemId: string) => {
    // Determine if the item is active
    let isActive = false;
    if (isOverviewPage) {
        isActive = activeHash === itemId;
    } else if (isReviewsPage && itemId === "reviews") {
        isActive = true;
    } else if (isGalleryPage && itemId === "gallery") {
      isActive = true;
    } else if (isBookingsPage && itemId === "pitches") {
        isActive = true;
    }

    if (isActive) {
      return "text-emerald-500 bg-emerald-500/10";
    }
    return "text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10";
  };

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/futsals")}
              className="text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div 
              className="font-extrabold text-lg text-foreground truncate max-w-[150px] md:max-w-[250px] cursor-pointer"
              onClick={() => handleNav('home')}
              title={name || "Facility"}
            >
              {name || "Loading Futsal..."}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Button 
                    key={item.id}
                    variant="ghost" 
                    onClick={() => handleNav(item.id)} 
                    className={`text-sm font-semibold transition-colors flex items-center gap-1.5 rounded-full ${getActiveClass(item.id)}`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </Button>
              )
            })}
            
            <div className="w-px h-6 bg-border mx-1"></div>
            
            {/* User Info / Login */}
            {isLoading ? null : isAuthenticated ? (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 outline-none hover:opacity-80 transition-opacity ml-1"
              >
                <Avatar className="h-8 w-8 border border-emerald-200">
                  <AvatarFallback className="bg-emerald-600 text-white text-xs">{userInitial}</AvatarFallback>
                </Avatar>
              </button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/auth/login")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full ml-1"
              >
                Login
              </Button>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            {isLoading ? null : isAuthenticated ? (
               <button
                 onClick={() => navigate("/profile")}
                 className="flex items-center outline-none shrink-0"
               >
                 <Avatar className="h-8 w-8 border border-emerald-200">
                   <AvatarFallback className="bg-emerald-600 text-white text-xs">{userInitial}</AvatarFallback>
                 </Avatar>
               </button>
            ) : null}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-emerald-500 p-2 shrink-0"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border shadow-lg absolute w-full py-2 px-4 flex flex-col gap-1 z-50">
            {navItems.map(item => {
               const Icon = item.icon;
               return (
                <Button 
                    key={item.id}
                    variant="ghost" 
                    onClick={() => handleNav(item.id)} 
                    className={`w-full justify-start text-base font-semibold ${getActiveClass(item.id)}`}
                >
                   <Icon className="h-5 w-5 mr-3" /> {item.label}
                </Button>
               )
            })}
            
            {!isLoading && !isAuthenticated && (
              <>
                <div className="h-px w-full bg-border my-2"></div>
                <Button 
                    variant="default" 
                    onClick={() => handleNav(`/auth/login`)} 
                    className="w-full justify-start text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                   <User className="h-5 w-5 mr-3" /> Login
                </Button>
              </>
            )}
        </div>
      )}
    </nav>
  );
}
