import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FootsalRegister = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    facilityName: "",
    address: "",
    phone: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Registration submitted",
      description: "Your facility registration has been submitted for review. We'll contact you soon!",
    });
    
    setIsLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12 animate-fade-in">
        <Card className="w-full max-w-2xl animate-scale-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Register Your Futsal Facility</CardTitle>
            <CardDescription>
              Join Goal Futsal Nepal network and reach thousands of players
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Owner Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Full Name</Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="owner@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Facility Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facilityName">Facility Name</Label>
                    <Input
                      id="facilityName"
                      name="facilityName"
                      type="text"
                      placeholder="Goal Futsal Arena"
                      value={formData.facilityName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+977 98XXXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Street, City, Province"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Facility Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tell us about your facility, amenities, and what makes it special..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full gap-2" 
                disabled={isLoading}
              >
                <Building2 className="h-4 w-4" />
                {isLoading ? "Submitting..." : "Register Facility"}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Already registered?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default FootsalRegister;