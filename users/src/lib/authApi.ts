import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// LOGIN API
export const loginUser = async (data: any) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// REGISTER API
export const registerUser = async (data: any) => {
  const res = await API.post("/auth/register", data);
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

// FUTSAL REGISTER API
export const registerFutsal = async()=>{
    const res = await API.post("/auth/register-futsal");
    return res.data;
}
