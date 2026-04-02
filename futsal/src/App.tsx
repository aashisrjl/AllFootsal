import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import FacilityProfile from './pages/FacilityProfile';
import BookingManagement from './pages/BookingManagement';
import PitchManagement from './pages/PitchManagement';
import Revenue from './pages/Revenue';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import { Loader2 } from 'lucide-react';
import './index.css';

// ProtectedRoute Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { futsalProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!futsalProfile) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
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
                    <Route path="/pitches" element={<PitchManagement />} />
                    <Route path="/revenue" element={<Revenue />} />
                    <Route path="/settings" element={<Settings />} />
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