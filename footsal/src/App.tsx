import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import FacilityProfile from './pages/FacilityProfile';
import BookingManagement from './pages/BookingManagement';
import PitchManagement from './pages/PitchManagement';
import Revenue from './pages/Revenue';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;