
import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, AuthState } from "@/types";
import { toast } from "@/components/ui/use-toast";
import {
  loginUser,
  loginFutsal,
  registerUser as registerUserApi,
  registerFutsal as registerFutsalApi,
  googleLogin as googleLoginApi,
  logoutUser,
  verifyOtp as verifyOtpApi,
} from "@/lib/authApi";

interface AuthContextType extends AuthState {
  login: (identifier: string, password: string) => Promise<boolean>;
  loginFootsal: (identifier: string, password: string) => Promise<boolean>;
  registerUser: (username: string,email: string,phoneNumber: string,password: string,confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  registerFootsal: (footsalName: string, ownerName: string, ownerEmail: string, email: string, password: string, phoneNumber: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
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


const mapUser = (rawUser: any): User => {
  return {
    id: String(rawUser?.id ?? rawUser?._id ?? ""),
    name: rawUser?.name ?? rawUser?.username ?? rawUser?.ownerName ?? "User",
    email: rawUser?.email ?? "",
    role: rawUser?.role ?? "user",
  };
};

const login = async (identifier: string, password: string): Promise<boolean> => {
  try {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const payload = identifier.includes("@")
      ? { email: identifier, password }
      : { phoneNumber: identifier, password };

    const res = await loginUser(payload);

    const user = mapUser(res.user);

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

const loginFootsal = async (identifier: string, password: string): Promise<boolean> => {
  try {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const payload = identifier.includes("@")
      ? { email: identifier, password }
      : { phoneNumber: identifier, password };

    const res = await loginFutsal(payload);
    const user = mapUser(res.user);

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
  await logoutUser();

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
  username: string,
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string
): Promise<void> => {
  try {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const res = await registerUserApi({
      username,
      password,
      email,
      confirmPassword,
      phoneNumber,
    });

    const user = mapUser(res.user);

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

    const res = await googleLoginApi(token);
    const user = mapUser(res.user);

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

 const registerFootsal = async (
  footsalName: string,
  ownerName: string,
  ownerEmail: string,
  email: string,
  password: string,
  phoneNumber: string
): Promise<boolean> => {
  try {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const res = await registerFutsalApi({
      footsalName,
      ownerName,
      ownerEmail,
      email,
      password,
      phoneNumber,
    });

    const user = mapUser(res.user);

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

const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
  try {
    await verifyOtpApi(email, otp);

    toast({
      title: "OTP Verified",
      description: "Verification successful.",
    });

    return true;
  } catch (err: any) {
    toast({
      title: "Verification Failed",
      description: err.response?.data?.message || "The OTP entered is incorrect or expired.",
      variant: "destructive",
    });

    return false;
  }
};

  return (
    <AuthContext.Provider value={{ ...authState, login, loginFootsal, logout, registerFootsal, registerUser, verifyOtp, googleLogin }}>
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
