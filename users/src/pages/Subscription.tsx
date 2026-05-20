import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import toast from 'react-hot-toast';
import { logo_transparent } from "@/assets/images";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "Free",
    period: "",
    features: [
      "1 Futsal Facility",
      "Basic booking management",
      "Up to 50 bookings/month",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: "$29",
    period: "/month",
    popular: true,
    features: [
      "Up to 5 Futsal Facilities",
      "Advanced booking management",
      "Unlimited bookings",
      "Analytics & Reports",
      "Priority support",
      "Custom branding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: [
      "Unlimited Futsal Facilities",
      "Advanced booking management",
      "Unlimited bookings",
      "Advanced analytics & Reports",
      "24/7 Priority support",
      "Custom branding",
      "API access",
      "Dedicated account manager",
    ],
  },
];

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(`You have subscribed to the ${plans.find(p => p.id === planId)?.name} plan.`);

    setIsLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 animate-fade-in">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <img
            src={logo_transparent}
            alt="AllFutsal Logo"
            className="h-20 w-auto object-contain"
          />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Select the perfect plan for your futsal facility
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all duration-300 hover:shadow-xl animate-scale-in ${
                plan.popular
                  ? "border-green-600 border-2 shadow-lg scale-105"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-green-600">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <CardDescription className="text-base">
                  Perfect for {plan.id === "basic" ? "starters" : plan.id === "pro" ? "growing businesses" : "large enterprises"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading && selectedPlan === plan.id}
                  className={`w-full h-11 font-semibold ${
                    plan.popular
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-white hover:bg-green-50 text-green-600 border-2 border-green-600"
                  }`}
                >
                  {isLoading && selectedPlan === plan.id
                    ? "Processing..."
                    : plan.id === "basic"
                    ? "Start Free"
                    : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include secure payment processing and data encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
