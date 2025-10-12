
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";

import Index from "./pages/Index";
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FootsalRegister from "./pages/FootsalRegister";
import UserBookings from "./pages/UserBookings";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BookingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/facilities/:id" element={<FacilityDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/footsal-register" element={<FootsalRegister />} />
              <Route path="/bookings" element={<UserBookings />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* External section access pages */}
              <Route path="/admin-portal" element={
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
                  <div className="text-center bg-white rounded-lg shadow-xl p-8 max-w-md">
                    <h1 className="text-3xl font-bold text-blue-600 mb-4">Admin Portal</h1>
                    <p className="text-gray-600 mb-6">Access the dedicated admin dashboard to manage facilities, users, and subscriptions.</p>
                    <a href="/admin_section" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Access Admin Dashboard
                    </a>
                  </div>
                </div>
              } />
              <Route path="/owner-portal" element={
                <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
                  <div className="text-center bg-white rounded-lg shadow-xl p-8 max-w-md">
                    <h1 className="text-3xl font-bold text-green-600 mb-4">Facility Owner Portal</h1>
                    <p className="text-gray-600 mb-6">Manage your facility information, bookings, and revenue through our dedicated owner dashboard.</p>
                    <a href="/footsal_section" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                      Access Owner Dashboard
                    </a>
                  </div>
                </div>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
