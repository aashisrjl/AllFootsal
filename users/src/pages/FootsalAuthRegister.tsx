import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Building2 } from "lucide-react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import {
  AuthImage,
  AuthBackground,
  logo_transparent,
} from "@/assets/images";

const FootsalAuthRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { registerFootsal } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await registerFootsal(name, email, password);
      if (success) {
        navigate("/subscription");
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Social Login",
      description: `${provider} login will be available soon.`,
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100 animate-fade-in"
      style={{
        backgroundImage: `url(${AuthBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="flex flex-1 items-center justify-center py-10 px-4 mt-10">
        <div className="bg-white shadow-xl rounded-2xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full animate-scale-in">
          {/* Left side form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex justify-center md:justify-start mb-3">
              <img
                src={logo_transparent}
                alt="AllFutsal Logo"
                className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Register Your Futsal
            </h2>
            <p className="text-gray-600 mb-6">
              Create an account to manage your futsal facility.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Facility Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Facility Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 focus-visible:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 focus-visible:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 focus-visible:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-11 focus-visible:ring-green-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
              >
                <Building2 className="mr-2 h-4 w-4" />
                {isLoading ? "Creating Account..." : "Continue"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
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
                onClick={() => handleSocialLogin("Google")}
              >
                <FaGoogle className="mr-3 text-red-500 text-lg" />
              </Button>

              <Button
                variant="outline"
                className="w-auto h-11 border-gray-300 flex items-center justify-center hover:bg-gray-50"
                onClick={() => handleSocialLogin("Facebook")}
              >
                <FaFacebookF className="mr-3 text-blue-600 text-lg" />
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-green-600 font-medium hover:underline"
              >
                Login
              </a>
            </p>
          </div>

          {/* Right side illustration */}
          <div className="hidden md:flex w-1/2 bg-white justify-center items-center">
            <img
              src={AuthImage}
              alt="Register Illustration"
              className="w-96 h-auto object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FootsalAuthRegister;
