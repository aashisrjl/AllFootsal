
import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, AuthState } from "@/types";
import { users } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerFootsal: (name: string, email: string, password: string) => Promise<boolean>;
  //google
  
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
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      return true;
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const registerFootsal = async (name: string, email: string, password: string): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock registration logic
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: "footsal",
    };
    
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
    
    toast({
      title: "Registration successful",
      description: `Welcome, ${name}! Please select a subscription plan.`,
    });
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, registerFootsal }}>
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
