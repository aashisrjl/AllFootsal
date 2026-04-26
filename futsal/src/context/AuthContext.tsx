import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getFutsalProfile, loginFutsal, logoutFutsal } from '../lib/authApi';

export interface FutsalProfile {
  id: string;
  futsalCode: string;
  futsalName: string;
  email: string;
  phoneNumber: string;
  ownerName: string;
  profileCompletion?: {
    isLocationComplete: boolean;
    isInfoComplete: boolean;
    isProfileComplete: boolean;
    missingSections: string[];
  };
  // add other fields as necessary
}

interface AuthContextType {
  futsalProfile: FutsalProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [futsalProfile, setFutsalProfile] = useState<FutsalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getFutsalProfile();
      if (res.success) {
        setFutsalProfile(res.data);
      } else {
        setFutsalProfile(null);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setFutsalProfile(null);
        return;
      }
      console.error('Failed to fetch profile', error);
      setFutsalProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const res = await loginFutsal(credentials);
      
      // Axios directly throws on non-2xx status codes, so if we reach here, it succeeded assuming the backend follows REST
      if (res.futsal) {
        setFutsalProfile(res.futsal);
      } else {
        throw new Error('Login failed: Invalid response format');
      }
    } catch (error: unknown) {
      console.error('Login failed', error);
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { error?: string; message?: string } | undefined)?.error ||
          (error.response?.data as { error?: string; message?: string } | undefined)?.message ||
          error.message ||
          'Login failed';
        throw new Error(message);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutFutsal();
      setFutsalProfile(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ futsalProfile, loading, refreshProfile: fetchProfile, login, logout }}>
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
