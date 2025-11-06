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
      className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100"
      style={{
        backgroundImage: `url(${AuthBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="flex flex-1 items-center justify-center py-10 px-4 mt-8">
        <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full border border-green-100">
          {/* Left Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            {/* Logo */}
            <div className="flex justify-center md:justify-start mb-3">
              <img
                src={logo_transparent}
                alt="AllFutsal Logo"
                className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-md"
              />
            </div>

            {/* Back Button */}
            <div className="flex justify-start mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center bg-green-200 gap-1 w-auto px-3 py-1"
              >
                <ArrowLeft size={16} /> Back
              </Button>
            </div>

            {/* OTP Verification */}
            {!otpVerified ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Enter OTP
                </h2>
                <p className="text-gray-600 mb-6">
                  Please enter the 6-digit OTP sent to <b>{email}</b>
                </p>

                <div className="space-y-5 mt-6">
                  <div className="space-y-2">
                    <Label>OTP (6 digits)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      placeholder="Enter OTP"
                      className="h-11 text-center text-lg tracking-widest"
                    />
                  </div>

                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading}
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    {resendTimer > 0 ? (
                      <p>Resend OTP in {resendTimer}s</p>
                    ) : (
                      <button
                        onClick={handleResendOTP}
                        className="text-green-600 hover:underline"
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter and confirm your new password below.
                </p>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-11 focus-visible:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11 focus-visible:ring-green-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </div>

          {/* Right Illustration */}
          <div className="hidden md:flex w-1/2 bg-white justify-center items-center">
            <img
              src={otpVerified ? PasswordIllustration : OTPIllustration}
              alt="OTP Illustration"
              className="w-96 h-auto object-contain p-8"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
