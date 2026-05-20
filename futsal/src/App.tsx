import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import FacilityProfile from './pages/FacilityProfile';
import BookingManagement from './pages/BookingManagement';
import BookingDetail from './pages/BookingDetail';
import PitchManagement from './pages/PitchManagement';
import MediaManagement from './pages/MediaManagement';
import Revenue from './pages/Revenue';
import Ratings from './pages/Ratings';
import Forums from './pages/Forums';
import Settings from './pages/Settings';
import Subscription from './pages/Subscription';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
import Visitors from './pages/Visitors';
import ContactMessages from './pages/ContactMessages';
import { Loader2 } from 'lucide-react';
import { Toaster as HotToaster } from 'react-hot-toast';
import { useTheme } from './context/ThemeContext';
import './index.css';

// ProtectedRoute Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { futsalProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!futsalProfile) {
    return <Navigate to="/login" replace />;
  }

  const isProfileComplete = futsalProfile.profileCompletion?.isProfileComplete ?? true;
  if (!isProfileComplete && location.pathname !== '/facility') {
    return <Navigate to="/facility" replace />;
  }

  return <>{children}</>;
};

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <HotToaster 
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
          color: resolvedTheme === 'dark' ? '#f3f4f6' : '#111827',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: `1px solid ${resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
        },
      }}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemedToaster />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/facility" element={<FacilityProfile />} />
                    <Route path="/bookings" element={<BookingManagement />} />
                    <Route path="/bookings/:bookingId" element={<BookingDetail />} />
                    <Route path="/pitches" element={<PitchManagement />} />
                    <Route path="/media" element={<MediaManagement />} />
                    <Route path="/ratings" element={<Ratings />} />
                    <Route path="/forums" element={<Forums />} />
                    <Route path="/revenue" element={<Revenue />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/visitors" element={<Visitors />} />
                    <Route path="/messages" element={<ContactMessages />} />
                    <Route path="/payment/success" element={<Subscription />} />
                    <Route path="/payment/failure" element={<Subscription />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;