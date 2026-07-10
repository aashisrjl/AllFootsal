import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { AuthBackground, PasswordIllustration } from "@/assets/images";
import logo_transparent from "/logo_transparent.png";
import { resetPassword } from "@/lib/authApi";

const SetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const otp = location.state?.otp;

  useEffect(() => {
    if (!email || !otp) {
      navigate("/auth/forgot-password");
    }
  }, [email, otp, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter and confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!email || !otp) {
      toast.error("Missing reset details. Please start the flow again.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      await resetPassword({
        email,
        otp,
        newPassword,
        cNewPassword: confirmPassword,
      });
      toast.dismiss(toastId);
      toast.success("Password reset successfully!");
      navigate("/auth/login");
    } catch (error: any) {
      toast.dismiss(toastId);
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to reset password";
      toast.error(errorMsg);
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
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="flex justify-center md:justify-start mb-3">
              <img
                src={logo_transparent}
                alt="AllFutsal Logo"
                className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-md dark:invert dark:brightness-100"
              />
            </div>

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

            <form onSubmit={handleResetPassword} className="space-y-5 mt-6">
              <h2 className="text-3xl font-black text-gray-900 dark:text-slate-50 mb-2 tracking-tight">
                Set New Password
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-6 font-medium">
                Set a new password for <b className="text-emerald-600 dark:text-emerald-400">{email}</b> using the OTP you entered.
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
          </div>

          <div className="hidden md:flex w-1/2 bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-sm justify-center items-center p-12">
            <img
              src={PasswordIllustration}
              alt="Password Illustration"
              className="w-full h-auto object-contain drop-shadow-2xl animate-float p-8"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SetPassword;
