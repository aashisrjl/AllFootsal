import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import {
  AuthBackground,
  logo_transparent,
  OTPIllustration,
  PasswordIllustration,
} from "@/assets/images";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(180);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email; // get email from previous route

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // Send OTP again
  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate API
      setResendTimer(180);
      toast({
        title: "OTP Resent",
        description: "Check your email for the new OTP.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to resend OTP.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = () => {
    if (otp.length !== 6 || isNaN(Number(otp))) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit numeric OTP.",
        variant: "destructive",
      });
      return;
    }
    setOtpVerified(true);
    toast({
      title: "OTP Verified",
      description: "Now you can set a new password.",
    });
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast({
        title: "Fields Required",
        description: "Please enter and confirm your new password.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with API call for reset password
      await new Promise((resolve) => setTimeout(resolve, 1000)); // mock delay
      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
      });
      navigate("/auth/login");
    } catch {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
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
          {/* Left Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
            {/* Logo */}
            <div className="flex justify-center md:justify-start mb-3">
              <img
                src={logo_transparent}
                alt="AllFutsal Logo"
                className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-md dark:invert dark:brightness-100"
              />
            </div>

            {/* Back Button */}
            <div className="flex justify-start mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 gap-1 w-auto px-4 py-2 rounded-xl transition-all"
              >
                <ArrowLeft size={16} /> Back
              </Button>
            </div>

            {/* OTP Verification */}
            {!otpVerified ? (
              <>
                <h2 className="text-3xl font-black text-gray-900 dark:text-slate-50 mb-2 tracking-tight">
                  Enter OTP
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mb-6 font-medium">
                  Please enter the 6-digit OTP sent to <b className="text-emerald-600 dark:text-emerald-400">{email}</b>
                </p>

                <div className="space-y-5 mt-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">OTP (6 digits)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      placeholder="Enter OTP"
                      className="h-14 text-center text-2xl font-black tracking-[0.5em] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 rounded-xl"
                    />
                  </div>

                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <div className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium pt-2">
                    {resendTimer > 0 ? (
                      <p>Resend OTP in <span className="text-emerald-600 dark:text-emerald-400 font-bold">{resendTimer}s</span></p>
                    ) : (
                      <button
                        onClick={handleResendOTP}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // New Password Form
              <form onSubmit={handleResetPassword} className="space-y-5 mt-6">
                <h2 className="text-3xl font-black text-gray-900 dark:text-slate-50 mb-2 tracking-tight">
                  Reset Password
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mb-6 font-medium">
                  Enter and confirm your new password below.
                </p>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </div>

          {/* Right Illustration */}
          <div className="hidden md:flex w-1/2 bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-sm justify-center items-center p-12">
            <img
              src={otpVerified ? PasswordIllustration : OTPIllustration}
              alt="OTP Illustration"
              className="w-full h-auto object-contain drop-shadow-2xl animate-float p-8"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
