import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, ArrowLeft } from "lucide-react";
import {
  AuthBackground,
  logo_transparent,
  RegisterIllustration,
} from "@/assets/images";

const FootsalAuthRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { registerFootsal } = useAuth();

  const [step, setStep] = useState(1); // step 1 = futsal info, step 2 = credentials
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    footsalName: "",
    ownerName: "",
    ownerEmail: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Step 1 - submit futsal info
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.footsalName || !formData.ownerName || !formData.ownerEmail || !formData.phoneNumber) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.ownerEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid owner email.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Info Saved",
      description: "Now set your credentials to complete registration.",
    });
    setStep(2);
  };

  // Step 2 - submit credentials and register
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Fields",
        description: "Please enter email and password.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid futsal account email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await registerFootsal(
        formData.footsalName,
        formData.ownerName,
        formData.ownerEmail,
        formData.email,
        formData.password,
        formData.phoneNumber
      );

      if (success) {
        navigate("/auth/verify-email", { state: { email: formData.email } });
      }
    } catch (error) {
      console.error(error);
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
              {step === 1 ? "Register Your Futsal" : "Set Your Credentials"}
            </h2>
            <p className="text-gray-600 mb-6">
              {step === 1
                ? "Enter your futsal and owner details."
                : "Set up your futsal account credentials."}
            </p>

            <div className="mb-3">
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

            {step === 1 ? (
              <form onSubmit={handleInfoSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="footsalName">
                    Futsal Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="footsalName"
                    type="text"
                    placeholder="Enter your futsal name"
                    value={formData.footsalName}
                    onChange={handleChange}
                    required
                    className="h-11 focus-visible:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerName">
                    Owner Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ownerName"
                    type="text"
                    placeholder="Enter owner full name"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    className="h-11 focus-visible:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">
                    Owner Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    placeholder="Enter owner email"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    required
                    className="h-11 focus-visible:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="h-11 focus-visible:ring-green-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                >
                  {isLoading ? "Processing..." : "Next"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Futsal Account Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter futsal account email"
                    value={formData.email}
                    onChange={handleChange}
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
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
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
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-11 focus-visible:ring-green-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            )}
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
