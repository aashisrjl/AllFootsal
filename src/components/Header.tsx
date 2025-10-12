
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  CalendarDays, 
  LogOut, 
  LogIn, 
  Menu 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="border-b sticky top-0 z-10 bg-white">
      <div className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-footsal-green" />
          <span className="text-xl font-bold text-footsal-dark">Goal Futsal Nepal</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-footsal-green font-medium">
            Home
          </Link>
          <Link to="/facilities" className="text-gray-700 hover:text-footsal-green font-medium">
            Facilities
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-footsal-green font-medium">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-footsal-green font-medium">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/bookings">My Bookings</Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button asChild>
              <Link to="/login" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 md:hidden">
              <DropdownMenuItem asChild>
                <Link to="/" className="w-full">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/facilities" className="w-full">Facilities</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/about" className="w-full">About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contact" className="w-full">Contact</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
