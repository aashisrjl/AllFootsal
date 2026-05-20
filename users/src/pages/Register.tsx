import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, ArrowLeft } from "lucide-react";
import {
  AuthBackground,
  LoginIllustration,
  RegisterIllustration,
  PasswordIllustration,
} from "@/assets/images";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import  logo_transparent  from "/logo_transparent.png";

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [step, setStep] = useState(1); // step 1 = info, step 2 = password
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log(`📝 Input changed: ${id} = ${value}`);
    setFormData({ ...formData, [id]: value });
  };

  // Step 1 - submit personal info
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 handleInfoSubmit called with formData:", formData);

    if (!formData.fullName || !formData.email || !formData.phone) {
      console.warn("❌ Missing required fields:", { fullName: !formData.fullName, email: !formData.email, phone: !formData.phone });
      toast.error("Please fill all required fields.");
      return;
    }

    // Gmail validation - must be @gmail.com
    if (formData.email.toLowerCase().includes("@gmail")) {
      if (!formData.email.toLowerCase().match(/^[^\s@]+@gmail\.com$/)) {
        console.warn("❌ Gmail validation failed:", formData.email);
        toast.error("Gmail email must be @gmail.com");
        return;
      }
    } else {
      // For custom domains, allow standard TLDs (at least 2 characters)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        console.warn("❌ Email validation failed:", formData.email);
        toast.error("Please enter a valid email address.");
        return;
      }
    }

    console.log("✅ All validations passed, moving to step 2");
    // Just move to step 2, no API call at this stage
    toast.success("Now set your password to complete registration.");

    setStep(2); // show password fields
  };

  // Step 2 - submit password and complete registration
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 handlePasswordSubmit called");

    if (formData.password !== formData.confirmPassword) {
      console.warn("❌ Passwords don't match");
      toast.error("Password and confirm password must match.");
      return;
    }

    if (formData.password.length < 6) {
      console.warn("❌ Password too short:", formData.password.length);
      toast.error("Password must be at least 6 characters.");
      return;
    }

    console.log("✅ Password validation passed, calling registerUser");
    setIsLoading(true);
    try {
      // Call registerUser API with mapped field names
      const success = await registerUser(
        formData.fullName,     // username
        formData.email,        // email
        formData.phone,        // phoneNumber
        formData.password,     // password
        formData.confirmPassword // confirmPassword
      );

      // Only navigate on successful registration
      if (success) {
        console.log("✅ Registration successful, navigating to verify-email");
        navigate("/auth/verify-email", { state: { email: formData.email, type: 'user_registration' } });
      }
    } catch (error) {
      // Error handling is done in the context, just catch silently here
      console.error("❌ Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which illustration to show based on the current step
  const currentIllustration =
    step === 1 ? RegisterIllustration : PasswordIllustration;
  const illustrationAltText =
    step === 1 ? "Register Illustration" : "Password Illustration";

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
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">

            <Link to="/">
              <div className="flex justify-center md:justify-start mb-6 mt-4">
                <img
                  src={logo_transparent}
                  alt="AllFutsal Logo"
                  className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-md dark:invert dark:brightness-100"
                />
              </div>
            </Link>
            <div className=" mb-3">
              {step === 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 p-3 flex items-center rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
            </div>

            <h2 className="text-3xl font-black text-gray-900 dark:text-slate-50 mb-2 tracking-tight">
              {step === 1 ? "Create Account" : "Set Your Password"}
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6 font-medium">
              {step === 1
                ? "Fill in your details to begin registration."
                : "Create a secure password to complete registration."}
            </p>

            {step === 1 ? (
              <>
                <form onSubmit={handleInfoSubmit} className="space-y-5 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 rounded-xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300"
                  >
                    {isLoading ? "Processing..." : "Next"}
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
                      window.location.href =
                        "https://accounts.google.com/signin";
                    }}
                  >
                    <FaGoogle className="text-rose-500 text-xl" />
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 h-12 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all"
                    onClick={() => {
                      window.location.href =
                        "https://www.facebook.com/login.php";
                    }}
                  >
                    <FaFacebookF className="text-blue-600 text-xl" />
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            )}

            <div className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Login
              </a>
            </div>
          </div>

          {/* Right side illustration */}
          <div className="hidden md:flex bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-sm justify-center items-center p-12">
            <img
              src={currentIllustration}
              alt={illustrationAltText}
              className="w-full h-auto object-contain drop-shadow-2xl animate-float rounded-xl"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
