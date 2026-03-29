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

// USER LOGIN API
export const loginUser = async (data: LoginPayload) => {
  const res = await API.post("/auth/user/login", data);
  return res.data;
};

// FUTSAL LOGIN API
export const loginFutsal = async (data: LoginPayload) => {
  const res = await API.post("/auth/futsal/login", data);
  return res.data;
};

// USER REGISTER API
export const registerUser = async (data: UserRegisterPayload) => {
  const res = await API.post("/auth/user/register", data);
  return res.data;
};

// FUTSAL REGISTER API
export const registerFutsal = async (data: FutsalRegisterPayload) => {
  const res = await API.post("/auth/futsal/register", data);
  return res.data;
};

// GOOGLE LOGIN API
export const googleLogin = async (token: string) => {
  const res = await API.post("/auth/google-login", { token });
  return res.data;
};

// LOGOUT API
export const logoutUser = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

// OTP VERIFY API (same for user and futsal)
export const verifyOtp = async (email: string, otp: string) => {
  const res = await API.post(`/auth/verify-otp?email=${encodeURIComponent(email)}`, {
    otp,
  });
  return res.data;
};
