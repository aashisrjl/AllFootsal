import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { FaGoogle } from "react-icons/fa";
import {
  AuthImage,
  AuthBackground,
  logo_transparent,
  RegisterIllustration,
} from "@/assets/images";

const FootsalAuthRegister = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { registerFootsalWithGoogle } = useAuth(); // useAuth should have google register logic
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleRegister = async () => {
    if (!name || !username || !phone) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields before continuing with Google.",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 🔹 First trigger Google Auth
      const googleUser = await registerFootsalWithGoogle();

      if (googleUser) {
        // 🔹 Combine Google user info with manual fields
        const userData = {
          futsalName: name,
          username,
          phone,
          googleEmail: googleUser.email,
          googleId: googleUser.id,
        };

        // Send userData to your backend API to complete registration
        // e.g. await api.post("/futsal/register", userData);

        toast({
          title: "Registration Successful",
          description: "Welcome to AllFutsal!",
        });

        navigate("/subscription");
      }
    } catch (error) {
      toast({
        title: "Google Registration Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          {/* Left Side */}
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
              Enter your futsal details and continue with Google to verify.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Futsal Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your futsal name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 focus-visible:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11 focus-visible:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-11 focus-visible:ring-green-500"
                />
              </div>

              {/* Google Register Button */}
              <Button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleRegister}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center justify-center"
              >
                <FaGoogle className="mr-2 text-white text-lg" />
                {isLoading ? "Connecting..." : "Continue with Google"}
              </Button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  className="text-green-600 font-medium hover:underline"
                >
                  Login
                </a>
              </p>
            </form>
          </div>

          {/* Right Side Image */}
          <div className="hidden md:flex w-1/2 bg-white justify-center items-center">
            <img
              src={RegisterIllustration}
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
