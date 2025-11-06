import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";
import {
  AuthBackground,
  logo_transparent,
  ForgotPasswordImage,
} from "@/assets/images";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your registered email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with your OTP API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // mock delay

      toast({
        title: "OTP Sent",
        description: "Check your email for the OTP to reset your password.",
      });

      navigate("/auth/reset-password", { state: { email } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100"
      style={{
        backgroundImage: `url(${AuthBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="flex flex-1 items-center justify-center py-10 px-4 mt-8">
        <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full border border-green-100">
          {/* Left side form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex justify-center md:justify-start mb-6">
              <img
                src={logo_transparent}
                alt="AllFutsal Logo"
                className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-md"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600 mb-6">
              Enter your registered email address and we’ll send you a one-time
              password (OTP) to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5  mt-10">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 focus-visible:ring-green-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>

            <div className="mt-6 text-center text-gray-700 text-sm">
              Remember your password?{" "}
              <a
                href="/auth/login"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Login
              </a>
            </div>
          </div>

          {/* Right side illustration */}
          <div className="hidden md:flex w-1/2 bg-white justify-center items-center">
            <img
              src={ForgotPasswordImage}
              alt="Forgot Password Illustration"
              className="w-96 h-auto object-contain p-8"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
