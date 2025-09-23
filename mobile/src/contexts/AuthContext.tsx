import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, AuthState } from "../types";
import { users } from "../data/mockData";
import { Alert } from "react-native";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock authentication logic - in a real app, this would verify with a backend
    const user = users.find((u) => u.email === email);
    
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      Alert.alert("Login Successful", `Welcome back, ${user.name}!`);
      
      return true;
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      
      Alert.alert("Login Failed", "Invalid email or password. Please try again.");
      
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    Alert.alert("Logged Out", "You have been successfully logged out.");
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};