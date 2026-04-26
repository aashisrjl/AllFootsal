import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

type UserRegisterPayload = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
};

type FutsalRegisterPayload = {
  footsalName: string;
  ownerName: string;
  ownerEmail: string;
  email: string;
  password: string;
  phoneNumber: string;
};

type LoginPayload = {
  password: string;
  email?: string;
  phoneNumber?: string;
};

export const loginUser = async (data: LoginPayload) => {
  const res = await API.post("/auth/user/login", data);
  return res.data;
};

export const loginFutsal = async (data: LoginPayload) => {
  const res = await API.post("/auth/futsal/login", data);
  return res.data;
};

export const registerUser = async (data: UserRegisterPayload) => {
  const res = await API.post("/auth/user/register", data);
  return res.data;
};

export const registerFutsal = async (data: FutsalRegisterPayload) => {
  const res = await API.post("/auth/futsal/register", data);
  return res.data;
};

export const googleLogin = async (token: string) => {
  const res = await API.get("/auth/user/google", { params: { token } });
  return res.data;
};

export const facebookLogin = async (token: string) => {
  const res = await API.get("/auth/user/facebook", { params: { token } });
  return res.data;
};

export const googleLoginFutsal = async (token: string) => {
  const res = await API.get("/auth/futsal/google", { params: { token } });
  return res.data;
};

export const logoutUser = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await API.post(`/auth/verify-otp?email=${encodeURIComponent(email)}`, { otp });
  return res.data;
};

export const resendOtp = async (email: string, type: string) => {
  const res = await API.post("/auth/resend-otp", { email, type });
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await API.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (data: any) => {
  const res = await API.post("/auth/change-forgot-password", data);
  return res.data;
};