import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster as HotToaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import FacilityManagement from './pages/FacilityManagement';
import UserManagement from './pages/UserManagement';
import SubscriptionManagement from './pages/SubscriptionManagement';
import Analytics from './pages/Analytics';
import MediaManagement from './pages/MediaManagement';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <Router>
      <HotToaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid #374151',
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/facilities" element={<FacilityManagement />} />
          <Route path="/media" element={<MediaManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/subscriptions" element={<SubscriptionManagement />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;