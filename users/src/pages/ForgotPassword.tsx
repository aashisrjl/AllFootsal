import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import {
  AuthBackground,
  logo_transparent,
  ForgotPasswordImage,
} from "@/assets/images";
import { forgotPassword } from "@/lib/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email Required", {
        description: "Please enter your registered email.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email);

      toast.success("OTP Sent", {
        description: "Check your email for the OTP to reset your password.",
      });

      navigate("/auth/reset-password", { state: { email } });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to send OTP. Please try again later.",
      });
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
      <main className="flex flex-1 items-center justify-center py-10 px-4 mt-8">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full border border-green-100 dark:border-slate-800 transition-all duration-300">
          {/* Left side form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="flex justify-center md:justify-start mb-6">
              <img
                src={logo_transparent}
                alt="AllFutsal Logo"
                className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-md dark:invert dark:brightness-100"
              />
            </div>

            <h2 className="text-3xl font-black text-gray-900 dark:text-slate-50 mb-2 tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6 font-medium leading-relaxed">
              Enter your registered email address and we’ll send you a one-time
              password (OTP) to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 mt-10">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300"
              >
                <LogIn className="mr-2 h-5 w-5" />
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>

            <div className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              Remember your password?{" "}
              <a
                href="/auth/login"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Login
              </a>
            </div>
          </div>

          {/* Right side illustration */}
          <div className="hidden md:flex w-1/2 bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-sm justify-center items-center p-12">
            <img
              src={ForgotPasswordImage}
              alt="Forgot Password Illustration"
              className="w-full h-auto object-contain drop-shadow-2xl animate-float p-8"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
