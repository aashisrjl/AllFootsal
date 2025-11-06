import React, { useState } from "react";
import { CheckCircle, Zap, Shield, Users, CreditCard, MessageCircle } from "lucide-react";

import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Navigate, useNavigate } from "react-router-dom";

// 1. Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link' | 'accent';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
    variant = 'default', 
    size = 'default', 
    className = '', 
    children, 
    ...props 
}) => {
    // Base styles for professional appearance and animation
    let baseStyle = "font-medium rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
    
    let sizeStyle = {
        default: 'h-10 px-4 py-2 text-base',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
    }[size];

    // Color logic: Green (default) and Blue (accent)
    let variantStyle = '';
    if (variant === 'default') {
        variantStyle = 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl';
    } else if (variant === 'accent') {
        variantStyle = 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg hover:shadow-xl';
    } else if (variant === 'outline') {
        variantStyle = 'border-2 border-emerald-500 bg-white text-emerald-600 hover:bg-emerald-50 hover:border-emerald-700';
    } else {
        variantStyle = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    }

    return (
        <button className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`} {...props}>
            {children}
        </button>
    );
};

// 2. Card Components
interface CardProps { children: React.ReactNode; className?: string; }
const Card: React.FC<CardProps> = ({ children, className }) => (
    <div className={`bg-white rounded-xl shadow-2xl border border-gray-100 p-8 transition-all duration-500 ${className}`}>
        {children}
    </div>
);
const CardTitle: React.FC<CardProps> = ({ children, className }) => (
    <h3 className={`text-2xl font-bold tracking-tight text-gray-900 ${className}`}>{children}</h3>
);
const CardDescription: React.FC<CardProps> = ({ children, className }) => (
    <p className={`text-base text-gray-600 ${className}`}>{children}</p>
);

// Custom Animation Class (for subtle entrance)
const ANIMATION_CLASSES = "opacity-0 translate-y-4 animate-fadeInUp fill-mode-forwards";

// CSS for the custom animation (must be inline)
const animationStyle = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp {
    animation-name: fadeInUp;
    animation-duration: 0.6s;
    animation-timing-function: ease-out;
}
.fill-mode-forwards {
    animation-fill-mode: forwards;
}
`;
// --- END: PLACEHOLDER UI COMPONENTS ---

// TYPES
type BillingCycle = 'monthly' | 'six_months' | 'yearly';
interface PriceDetail {
    amount: number; // Price in Rupees (effective per month)
    label: string; // e.g., "per month" or "total"
    fullPrice: number; // Full price for comparison
    totalDuration: number; // Duration in months
    totalSavings: number; // Total savings calculation
}
interface FeatureItemProps {
    text: string;
    isIncluded: boolean;
    color: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text, isIncluded, color }) => (
    <li className="flex items-start space-x-3 py-1">
        <CheckCircle className={`h-5 w-5 shrink-0 ${isIncluded ? color : 'text-gray-400'}`} />
        <span className={`${isIncluded ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
            {text}
        </span>
    </li>
);

// Billing Data Definition - Only Standard plan is kept
const ownerPlans = [
    {
        name: "Standard Platform Access",
        icon: Shield,
        description: "Essential tools to digitize your futsal venue, manage all bookings, and access customer payments.",
        color: "emerald",
        tag: "Core Platform Access",
        prices: {
            monthly: { amount: 1500, label: "per month", fullPrice: 1500, totalDuration: 1, totalSavings: 0, buttonText: "Choose Monthly" },
            six_months: { amount: 1400, label: "per month", fullPrice: 9000, totalDuration: 6, totalSavings: 600, buttonText: "Choose 6 Months" }, // Total: 8,400. Saves 600.
            yearly: { amount: 1250, label: "per month", fullPrice: 18000, totalDuration: 12, totalSavings: 3000, buttonText: "Choose 1 Year (Best Value)" }, // Total: 15,000. Saves 3,000.
        } as Record<BillingCycle, PriceDetail & { buttonText: string }>,
        features: [
            { text: "Register and manage one Futsal Venue (unlimited pitches)", included: true },
            { text: "Add multiple pitches and time slots easily", included: true },
            { text: "Centralized Booking Management Dashboard", included: true },
            { text: "Track customer activity, payments, and basic reports", included: true },
            { text: "Enable digital payments and instant QR booking", included: true }, 
            { text: "Daily, Weekly, and Monthly Analytics", included: false }, 
            { text: "AI-powered Review Summarization", included: false }, 
            { text: "24/7 Priority Email Support", included: true },
        ],
        buttonText: "Start 7-Day Free Trial", 
        buttonVariant: "default" as const
    },
];

// Component for a single price option card
const PriceOptionCard: React.FC<{ 
    cycle: BillingCycle, 
    details: PriceDetail & { buttonText: string },
    planName: string
}> = ({ cycle, details, planName }) => {
    const isYearly = cycle === 'yearly';
    const isMonthly = cycle === 'monthly';
    const effectiveTotal = details.amount * details.totalDuration;

    return (
        <div className={`p-6 rounded-xl border-2 ${isYearly ? 'border-sky-500 bg-sky-50 shadow-lg' : 'border-gray-200 bg-white'} transition-all duration-300 hover:shadow-xl hover:border-sky-500`}>
            <h4 className="text-xl font-extrabold text-gray-900 mb-2">
                {cycle === 'monthly' ? 'Monthly' : cycle === 'six_months' ? 'Half-Yearly (6 Months)' : 'Annual (1 Year)'}
            </h4>
            
            {isYearly && (
                <div className="text-xs font-bold uppercase text-white bg-emerald-600 px-3 py-1 rounded-full inline-block mb-3">
                    Best Value!
                </div>
            )}
            
            <p className="text-4xl font-extrabold text-gray-900 my-3">
                Rs {effectiveTotal.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-gray-500">
                {isMonthly ? 'Billed monthly' : `Total up-front payment`}
            </p>

            {!isMonthly && (
                <p className="text-xs font-semibold text-emerald-600 mt-2">
                    You save Rs {details.totalSavings.toLocaleString()}
                </p>
            )}
            
            <p className="text-sm font-bold text-gray-700 mt-4 border-t pt-3">
                Rs {details.amount.toLocaleString()} / month (effective)
            </p>

            <Button 
                className={`mt-6 w-full h-10 text-base ${isYearly ? 'bg-sky-600 hover:bg-sky-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                variant={isYearly ? 'accent' : 'default'}
                onClick={() => console.log(`Attempting to sign up for ${planName} - ${cycle}`)}
            >
                {details.buttonText}
            </Button>
        </div>
    );
}


const Pricing: React.FC = () => {
    const Navigate = useNavigate();
    // Inject Custom CSS for animation
    const styleElement = <style>{animationStyle}</style>;
    
    // State and cycle options are removed as requested.

    const plan = ownerPlans[0]; // Access the single Standard plan

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            {styleElement}
            
            {/* Header Placeholder */}
            <Header />

            <main className="flex-1 container mx-auto px-4 py-16 pt-32">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Title Section */}
                    <div className={`text-center mb-16 ${ANIMATION_CLASSES}`} style={{animationDelay: '0.1s'}}>
                        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                            Transparent Pricing for the Futsal Ecosystem
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Whether you're a player looking for a game or an owner digitalizing their business, we have you covered.
                        </p>
                    </div>

                    {/* --- Pricing for FUTSAL OWNERS (Now with fixed grid options) --- */}
                    <div className={`mb-16 ${ANIMATION_CLASSES}`} style={{animationDelay: '0.3s'}}>
                        <h2 className="text-4xl font-extrabold text-center text-emerald-600 mb-10">
                            Futsal Owners: Choose Your Standard Plan Duration
                        </h2>

                        {/* Pricing Options Grid */}
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* 1. Monthly Option */}
                            <PriceOptionCard cycle="monthly" details={plan.prices.monthly} planName={plan.name} />

                            {/* 2. Half-Yearly Option */}
                            <PriceOptionCard cycle="six_months" details={plan.prices.six_months} planName={plan.name} />

                            {/* 3. Yearly Option (Most Prominent) */}
                            <PriceOptionCard cycle="yearly" details={plan.prices.yearly} planName={plan.name} />
                        </div>


                        {/* Feature List Card (Separate from pricing options) */}
                        <Card className="max-w-6xl mx-auto mt-8 p-10 shadow-xl border-t-4 border-emerald-500">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <CardTitle className="flex items-center gap-3 text-3xl text-gray-900">
                                    <plan.icon className="w-6 h-6 text-emerald-600" />
                                    Features Included in Standard Access
                                </CardTitle>
                                <CardDescription className="text-lg text-emerald-600 font-semibold">
                                    {plan.tag}
                                </CardDescription>
                            </div>
                            
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-left">
                                {plan.features.map((feature, idx) => (
                                    <FeatureItem
                                        key={idx}
                                        text={feature.text}
                                        isIncluded={feature.included}
                                        color={`text-emerald-600`}
                                    />
                                ))}
                            </ul>
                            <div className="text-center mt-8">
                                <p className="text-gray-500 italic text-sm">
                                    *All plans include a 7-day free trial. You can cancel anytime before the billing cycle begins.
                                </p>
                            </div>
                        </Card>
                    </div>


                    {/* --- Pricing for PLAYERS (Enhanced Design) --- */}
                    <div className={`mt-20 ${ANIMATION_CLASSES}`} style={{animationDelay: '0.7s'}}>
                        <h2 className="text-4xl font-extrabold text-center text-green-600 mb-10">
                            Players: Connect, Play, and Enjoy the Game
                        </h2>
                        
                        <Card className="max-w-5xl mx-auto p-10 bg-sky-600 text-white border-sky-800 shadow-2xl shadow-sky-400/30">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="text-center md:text-left md:w-1/3 mb-6 md:mb-0">
                                    <div className="flex flex-col items-center md:items-start gap-1 mb-4">
                                        <Users className="w-12 h-12 text-white drop-shadow-lg" />
                                        <h3 className="text-5xl font-extrabold tracking-tight">Player Access</h3>
                                    </div>
                                    <p className="text-8xl font-extrabold text-white mt-2 drop-shadow-xl">
                                        0
                                        <span className="text-4xl font-normal ml-2">Rs</span>
                                    </p>
                                    <p className="text-xl font-light text-sky-200 mt-2">
                                        Forever. No hidden fees or credit card required.
                                    </p>
                                </div>
                                
                                <div className="md:w-2/3 md:pl-10">
                                    <h4 className="text-2xl font-bold mb-4 text-sky-200">What You Get:</h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                        <li className="flex items-start space-x-3 py-1">
                                            <CheckCircle className={`h-5 w-5 shrink-0 text-emerald-300`} />
                                            <span className="text-sky-100">Discover hundreds of futsal venues across Nepal</span>
                                        </li>
                                        <li className="flex items-start space-x-3 py-1">
                                            <CheckCircle className={`h-5 w-5 shrink-0 text-emerald-300`} />
                                            <span className="text-sky-100">View available slots and book instantly</span>
                                        </li>
                                        <li className="flex items-start space-x-3 py-1">
                                            <CheckCircle className={`h-5 w-5 shrink-0 text-emerald-300`} />
                                            <span className="text-sky-100">Secure digital payment options (QR, wallet)</span>
                                        </li>
                                        <li className="flex items-start space-x-3 py-1">
                                            <CheckCircle className={`h-5 w-5 shrink-0 text-emerald-300`} />
                                            <span className="text-sky-100">Personalized game history and stats</span>
                                        </li>
                                        <li className="flex items-start space-x-3 py-1">
                                            <CheckCircle className={`h-5 w-5 shrink-0 text-emerald-300`} />
                                            <span className="text-sky-100">Rate venues and connect with other players</span>
                                        </li>
                                        <li className="flex items-start space-x-3 py-1">
                                            <CheckCircle className={`h-5 w-5 shrink-0 text-emerald-300`} />
                                            <span className="text-sky-100">Access to public community tournaments</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-8 text-center">
                                <Button 
                                    className="w-full md:w-2/3 h-14 text-xl font-extrabold bg-gray-200 shadow-2xl"
                                    variant="default"
                                    onClick={() => {Navigate("/auth/register")}}
                                >
                                    <Zap className="w-6 h-6 mr-3" />
                                    Register & Start Playing Today!
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* CTA for further questions */}
                    <div className={`text-center mt-20 p-8 bg-white rounded-xl shadow-lg ${ANIMATION_CLASSES}`} style={{animationDelay: '0.9s'}}>
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">
                            Need Custom Features or have Multiple Branches?
                        </h3>
                        <p className="text-lg text-gray-600 mb-6">
                            Contact our sales team to discuss multi-location licensing or enterprise solutions.
                        </p>
                        <Button 
                            variant="default"
                            className="bg-gray-800 text-white hover:bg-gray-700"
                            onClick={() => console.log("Redirect to Contact Page")}
                        >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Speak to Sales
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer Placeholder */}
            <Footer />
        </div>
    );
};

export default Pricing;