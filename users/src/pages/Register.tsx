import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, ArrowLeft } from "lucide-react";
import {
  AuthBackground,
  logo_transparent,
  LoginIllustration,
  RegisterIllustration,
  PasswordIllustration,
} from "@/assets/images";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Step 1 - submit personal info
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API to register basic info
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Info Saved",
        description: "Now set your password to complete registration.",
      });

      setStep(2); // show password fields
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save info. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 - submit password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API to save password and complete registration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Registration Successful",
        description: "Welcome to AllFutsal! You can now log in.",
      });

      navigate("/auth/verify-email", { state: { email: formData.email } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete registration. Try again.",
        variant: "destructive",
      });
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
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          

            <div className="flex justify-center md:justify-start mb-6 mt-4">
              <img
                src={logo_transparent}
                alt="AllFutsal Logo"
                className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-md"
              />
            </div>
              <div className=" mb-3">
              {step === 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="text-green-600 hover:text-green-700 bg-green-200 p-3 flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {step === 1 ? "Create Account" : "Set Your Password"}
            </h2>
            <p className="text-gray-600 mb-6">
              {step === 1
                ? "Fill in your details to begin registration."
                : "Create a secure password to complete registration."}
            </p>

            {step === 1 ? (
              <>
                <form onSubmit={handleInfoSubmit} className="space-y-5 mt-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    {isLoading ? "Processing..." : "Next"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="flex  items-center my-6">
                  <div className="flex-grow h-px bg-gray-300"></div>
                  <span className="px-4 text-gray-500 text-sm">
                    or continue with
                  </span>
                  <div className="flex-grow h-px bg-gray-300"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="flex justify-center items-center gap-3">
                  <Button
                    variant="outline"
                    className="w-auto h-11 border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    onClick={() => {
                      window.location.href =
                        "https://accounts.google.com/signin";
                    }}
                  >
                    <FaGoogle className="mr-3 text-red-500 text-lg" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-auto h-11 border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    onClick={() => {
                      window.location.href =
                        "https://www.facebook.com/login.php";
                    }}
                  >
                    <FaFacebookF className="mr-3 text-blue-600 text-lg" />
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-5 mt-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-gray-700 text-sm">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Login
              </a>
            </div>
          </div>

          {/* Right side illustration - CONDITIONAL RENDERING APPLIED HERE */}
          <div className="hidden md:flex  bg-white justify-center items-center">
            <img
              src={currentIllustration} // Use the conditionally determined illustration source
              alt={illustrationAltText} // Use the correct alt text
              className="w-100 object-fit p-8"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
