import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

import {
  AuthImage,
  AuthBackground,
  logo_transparent,
  Logo,
} from "@/assets/images";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Successfully logged in");
        navigate("/");
      }
    } catch (error) {
      toast.error("Invalid credentials or server issue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500"
      style={{
        backgroundImage: `url(${AuthBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="flex flex-1 items-center justify-center py-10 px-4 mt-10">
        <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full border border-slate-100 dark:border-slate-800 transition-all duration-300">
          {/* Left side form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
            <Link to="/">
              <div className="flex justify-center md:justify-start mb-3">
                <img
                  src={logo_transparent}
                  alt="AllFutsal Logo"
                  className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105 dark:invert dark:brightness-100"
                />
              </div>
            </Link>

            <h2 className="text-3xl font-black text-gray-900 dark:text-slate-50 mb-2 tracking-tight">Login</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6 font-medium">
              Please fill up the following form to login.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email or Phone <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" title="Password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 rounded-xl"
                />
              </div>

              <div className="flex justify-between text-sm">
                <a
                  href="/auth/forgot-password"
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
              >
                <LogIn className="mr-2 h-5 w-5" />
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-grow h-px bg-slate-200 dark:bg-slate-800"></div>
              <span className="px-4 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
                or continue with
              </span>
              <div className="flex-grow h-px bg-slate-200 dark:bg-slate-800"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                className="flex-1 h-12 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all"
                onClick={() => {
                  window.location.href = "http://localhost:3000/api/v1/auth/user/google";
                }}
              >
                <FaGoogle className="text-rose-500 text-xl" />
              </Button>

              <Button
                variant="outline"
                className="flex-1 h-12 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all"
                onClick={() => {
                  window.location.href = "http://localhost:3000/api/v1/auth/user/facebook";
                }}
              >
                <FaFacebookF className="text-blue-600 text-xl" />
              </Button>
            </div>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8 font-medium">
              Don’t have an account?{" "}
              <a
                href="/auth/register"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Register
              </a>
            </p>
          </div>

          {/* Right side illustration */}
          <div className="hidden md:flex w-1/2 bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-sm justify-center items-center p-12">
            <img
              src={AuthImage}
              alt="Login Illustration"
              className="w-full h-auto object-contain drop-shadow-2xl animate-float rounded-xl"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
