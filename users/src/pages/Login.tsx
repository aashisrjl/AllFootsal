import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";

import { LoginIllustration,AuthImage, AuthBackground } from "@/assets/images"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCaptcha = (value) => {
    if (value) setCaptchaVerified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      toast({
        title: "Captcha Required",
        description: "Please verify you’re not a robot.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials or server issue.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100"
     style={{
        backgroundImage: `url(${AuthBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <main className="flex flex-1 items-center justify-center py-10 px-4 mt-10">
        <div className="bg-white shadow-xl rounded-2xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full">
          {/* Left side form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6 flex justify-left">
              <h1
                className="h-12 w-auto text-3xl font-bold text-green-600 flex items-center"
              >
                AllFootsal
              </h1>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600 mb-6">
              Please fill up the following form to login.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
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
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
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

              <div className="flex justify-between text-sm">
                <a href="/forgot-password" className="text-green-600 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey="YOUR_RECAPTCHA_SITE_KEY"
                  onChange={handleCaptcha}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don’t have an account?{" "}
              <a
                href="/auth/register"
                className="text-green-600 font-medium hover:underline"
              >
                Register
              </a>
            </p>
          </div>

          {/* Right side illustration */}
          <div className="hidden md:flex w-1/2 bg-white justify-center items-center">
            <img
              src={AuthImage}
              alt="Login Illustration"
              className="w-96 h-auto object-contain "
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
