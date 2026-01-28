
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
import UserBookings from "./pages/UserBookings";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Pricing from "./pages/Pricing";
import Forum from "./pages/Forum";
import FootsalAuthRegister from "./pages/FootsalAuthRegister";
import Subscription from "./pages/Subscription";

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
              {/* <Route path="/facilities" element={<Facilities />} />
              <Route path="/facilities/:id" element={<FacilityDetails />} /> */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/verify-email" element={<EmailVerification />} />
              <Route path="/auth/register/footsal" element={<FootsalAuthRegister />} />
              <Route path="/subscription" element={<Subscription />} />

              {/* <Route path="/bookings" element={<UserBookings />} /> */}
              {/* <Route path="/admin" element={<AdminDashboard />} /> */}
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
