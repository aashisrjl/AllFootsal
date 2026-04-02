// No token extraction, no localStorage — cookie is httpOnly, JS can't read it
// Just attach nothing; browser sends cookie on every request automatically

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
  const res = await API.get("/auth/user/google", { token });
  return res.data;
};

export const facebookLogin = async (token: string) => {
  const res = await API.get("/auth/user/facebook", { token });
  return res.data;
};

export const googleLoginFutsal = async (token: string) => {
  const res = await API.get("/auth/futsal/google", { token });
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