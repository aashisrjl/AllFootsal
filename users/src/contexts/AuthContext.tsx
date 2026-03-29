
import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, AuthState } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { API } from "@/lib/authApi";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string,email: string,phone: string,password: string,confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  registerFootsal: (name: string, email: string, password: string) => Promise<boolean>;
  //googleLOgin
  googleLogin: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });


const login = async (email: string, password: string): Promise<boolean> => {
  try {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const res = await API.post("/auth/login", {
      email,
      password,
    });

    const user = res.data.user;

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
  } catch (err: any) {
    setAuthState((prev) => ({ ...prev, isLoading: false }));

    toast({
      title: "Login failed",
      description: err.response?.data?.message || "Invalid credentials",
      variant: "destructive",
    });

    return false;
  }
};

const logout = async () => {
  await API.post("/auth/logout"); // backend clears cookie

  setAuthState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  toast({
    title: "Logged out",
  });
};

const registerUser = async (
  name: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string
): Promise<void> => {
  try {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const res = await API.post("/auth/register", {
      name,
      email,
      phone,
      password,
      confirmPassword,
    });

    const user = res.data.user;

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });

    toast({
      title: "Registration successful",
      description: `Welcome, ${user.name}!`,
    });
  } catch (err: any) {
    setAuthState((prev) => ({ ...prev, isLoading: false }));

    toast({
      title: "Registration failed",
      description: err.response?.data?.message || "Error",
      variant: "destructive",
    });
  }
};

const googleLogin = async (token: string): Promise<void> => {
  try {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const res = await API.post("/auth/google-login", { token });
    const user = res.data.user;

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });

    toast({
      title: "Login successful",
      description: `Welcome back, ${user.name}!`,
    });
  } catch (err: any) {
    setAuthState((prev) => ({ ...prev, isLoading: false }));

    toast({
      title: "Google login failed",
      description: err.response?.data?.message || "Unable to login with Google",
      variant: "destructive",
    });
  }
};

 const registerFootsal = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const res = await API.post("/auth/register-futsal", {
      name,
      email,
      password,
    });

    const user = res.data.user;

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });

    toast({
      title: "Registration successful",
      description: `Welcome, ${user.name}!`,
    });

    return true;
  } catch (err: any) {
    setAuthState((prev) => ({ ...prev, isLoading: false }));

    toast({
      title: "Registration failed",
      description: err.response?.data?.message || "Error",
      variant: "destructive",
    });

    return false;
  }
};

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, registerFootsal,registerUser,googleLogin }}>
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
