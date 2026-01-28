import React from "react";
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
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
}
@keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.3); }
    50% { box-shadow: 0 0 0 18px rgba(16, 185, 129, 0); }
}
@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.animate-fadeInUp {
    animation-name: fadeInUp;
    animation-duration: 0.6s;
    animation-timing-function: ease-out;
}
.fill-mode-forwards {
    animation-fill-mode: forwards;
}
.animate-float {
    animation: float 6s ease-in-out infinite;
}
.animate-pulseGlow {
    animation: pulseGlow 3s ease-in-out infinite;
}
.gradient-shift {
    background: linear-gradient(120deg, #10b981, #0ea5e9, #22c55e, #2563eb);
    background-size: 200% 200%;
    animation: gradientShift 10s ease infinite;
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

    const plan = ownerPlans[0]; // Access the single Standard plan

    return (
        <>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 text-gray-900 font-sans relative overflow-hidden">
            {styleElement}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-10 -top-20 h-64 w-64 rounded-full bg-emerald-300/40 blur-3xl animate-float" />
                <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
                <div className="absolute left-1/3 bottom-0 h-60 w-60 rounded-full bg-emerald-100 blur-3xl" />
            </div>
            
            <Header />

            <main className="flex-1 container mx-auto px-4 py-16 pt-28 relative z-10">
                <div className="max-w-7xl mx-auto space-y-16">
                    
                    {/* Hero */}
                    <div className={`grid gap-10 lg:grid-cols-[1.3fr_1fr] items-center ${ANIMATION_CLASSES}`} style={{ animationDelay: '0.1s' }}>
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-lg border border-emerald-100 backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulseGlow" />
                                <span className="text-sm font-semibold text-emerald-700 ">Built for futsal owners & players</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
                                Pricing that gets you <span className="text-transparent bg-clip-text gradient-shift text-white rounded-lg mt-6">booked fast</span>.
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl">
                                Launch a digital-ready futsal venue with payments, analytics, and bookings in minutes. No hidden fees—just pick the duration that matches your ambition.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button className="shadow-xl" onClick={() => Navigate("/auth/register")}>
                                    <Zap className="w-5 h-5 mr-2" />
                                    Start 7-day free trial
                                </Button>
                                <Button variant="outline" className="border-emerald-500 text-emerald-600" onClick={() => console.log("Demo requested")}>
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Book a live demo
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                                {[
                                    { label: "Avg. booking uplift", value: "38%" },
                                    { label: "Payment success", value: "99.4%" },
                                    { label: "Support", value: "24/7" },
                                    { label: "Venues onboarded", value: "120+" },
                                ].map((item) => (
                                    <div key={item.label} className="rounded-xl bg-white/70 border border-emerald-100 px-4 py-3 shadow-sm backdrop-blur">
                                        <p className="text-sm text-gray-500">{item.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-white/50 border border-emerald-100 rounded-3xl blur-2xl" />
                            <div className="relative rounded-3xl bg-white shadow-2xl p-6 border border-emerald-100/60 backdrop-blur">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield className="w-6 h-6 text-emerald-600" />
                                    <p className="text-sm font-semibold text-emerald-700">Standard Platform Access</p>
                                </div>
                                <div className="space-y-3 text-gray-700">
                                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 border border-emerald-100">
                                        <div>
                                            <p className="text-sm text-emerald-700 font-semibold">Best for busy venues</p>
                                            <p className="text-xl font-extrabold">Annual • Rs {(plan.prices.yearly.amount * plan.prices.yearly.totalDuration).toLocaleString()}</p>
                                        </div>
                                        <span className="text-xs font-bold text-white bg-emerald-500 px-3 py-1 rounded-full">Save Rs {plan.prices.yearly.totalSavings.toLocaleString()}</span>
                                    </div>
                                    <div className="rounded-xl border border-gray-100 p-4">
                                        <p className="text-sm font-semibold text-gray-600 mb-3">Highlights</p>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-emerald-500" /> Instant QR & wallet payments</li>
                                            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-emerald-500" /> Slot automation with reminders</li>
                                            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-emerald-500" /> Player insights & repeat rate</li>
                                        </ul>
                                    </div>
                                    <Button className="w-full mt-4 h-12 text-lg" onClick={() => console.log("Start yearly trial")}>
                                        Go live now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Owner pricing */}
                    <div className={`${ANIMATION_CLASSES}`} style={{ animationDelay: '0.25s' }}>
                        <div className="text-center mb-10 space-y-3">
                            <p className="text-emerald-600 font-semibold uppercase tracking-[0.2em] text-xs">Owners</p>
                            <h2 className="text-4xl font-extrabold">Choose the duration that suits you</h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                The same all-in-one platform, with flexible billing that rewards commitment.
                            </p>
                        </div>

                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                            <PriceOptionCard cycle="monthly" details={plan.prices.monthly} planName={plan.name} />
                            <PriceOptionCard cycle="six_months" details={plan.prices.six_months} planName={plan.name} />
                            <PriceOptionCard cycle="yearly" details={plan.prices.yearly} planName={plan.name} />
                        </div>

                        <Card className="max-w-6xl mx-auto mt-10 p-10 shadow-xl border-t-4 border-emerald-500 bg-white/90 backdrop-blur">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 border-b pb-4">
                                <CardTitle className="flex items-center gap-3 text-3xl text-gray-900">
                                    <plan.icon className="w-7 h-7 text-emerald-600" />
                                    Everything you need to run smarter
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
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
                                <p className="text-gray-500 italic text-sm">
                                    *All plans include a 7-day free trial. Cancel anytime before billing starts.
                                </p>
                                <Button variant="outline" className="border-gray-300 text-gray-800" onClick={() => console.log("Download feature sheet")}>
                                    Download feature sheet
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Players section */}
                    <div className={`mt-4 ${ANIMATION_CLASSES}`} style={{ animationDelay: '0.6s' }}>
                        <div className="text-center mb-8">
                            <p className="text-sky-600 font-semibold uppercase tracking-[0.2em] text-xs">Players</p>
                            <h2 className="text-4xl font-extrabold text-gray-900">Play more. Pay nothing.</h2>
                        </div>
                        
                        <Card className="relative max-w-5xl mx-auto p-10 bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-500 text-white border-none shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%)]" />
                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left md:w-1/3 space-y-4">
                                    <div className="flex flex-col items-center md:items-start gap-2">
                                        <Users className="w-12 h-12 text-white drop-shadow-lg" />
                                        <h3 className="text-4xl font-extrabold tracking-tight">Player Access</h3>
                                    </div>
                                    <p className="text-7xl font-extrabold text-white drop-shadow-xl leading-none">
                                        0<span className="text-3xl font-normal ml-1">Rs</span>
                                    </p>
                                    <p className="text-lg text-sky-100">
                                        Free forever. Find matches, book instantly, and track your game history.
                                    </p>
                                </div>
                                
                                <div className="md:w-2/3 md:pl-4">
                                    <h4 className="text-2xl font-bold mb-4 text-white/90">What you unlock</h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                        {[
                                            "Discover hundreds of futsal venues across Nepal",
                                            "Live slot visibility and instant booking",
                                            "Secure digital payment options (QR, wallet)",
                                            "Personalized game history and stats",
                                            "Rate venues and connect with other players",
                                            "Access to public community tournaments",
                                        ].map((item) => (
                                            <li key={item} className="flex items-start space-x-3 py-1">
                                                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-200" />
                                                <span className="text-sky-50">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="relative mt-10 text-center">
                                <Button 
                                    className="w-full md:w-2/3 h-14 text-xl font-extrabold bg-slate-400  text-emerald-600 hover:bg-slate-200 shadow-2xl"
                                    variant="default"
                                    onClick={() => {Navigate("/auth/register")}}
                                >
                                    <Zap className="w-6 h-6 mr-3" />
                                    Register & Start Playing Today
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* CTA */}
                    <div className={`text-center p-10 bg-white rounded-2xl shadow-xl border border-emerald-100 ${ANIMATION_CLASSES}`} style={{ animationDelay: '0.85s' }}>
                        <div className="flex flex-col gap-3 items-center">
                            <span className="px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs uppercase tracking-[0.2em]">Need more?</span>
                            <h3 className="text-3xl font-bold text-gray-900">Multi-branch or custom requirements?</h3>
                            <p className="text-lg text-gray-600 max-w-2xl">
                                Tell us what you need and we’ll tailor the platform to your locations, branding, or advanced analytics.
                            </p>
                            <Button 
                                variant="default"
                                className="bg-gray-900 text-white hover:bg-gray-800"
                                onClick={() => console.log("Redirect to Contact Page")}
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Speak to Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

        </div>
            <Footer />
            </>
    );
};

export default Pricing;