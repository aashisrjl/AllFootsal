import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

export interface FutsalProfile {
  id: string;
  futsalCode: string;
  futsalName: string;
  email: string;
  phoneNumber: string;
  ownerName: string;
  // add other fields as necessary
}

interface AuthContextType {
  futsalProfile: FutsalProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [futsalProfile, setFutsalProfile] = useState<FutsalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/futsals-profile');
      if (res.data.success) {
        setFutsalProfile(res.data.data);
      } else {
        setFutsalProfile(null);
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      setFutsalProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setFutsalProfile(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ futsalProfile, loading, refreshProfile: fetchProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
