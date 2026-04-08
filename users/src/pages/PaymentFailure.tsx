import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import FutsalNavigation from "@/components/FutsalNavigation";
import FutsalFooter from "@/components/FutsalFooter";

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <FutsalNavigation name="Payment Failed" />
            
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-card border border-border rounded-3xl p-10 shadow-xl shadow-red-500/5 text-center">
                    <div className="space-y-6">
                        <div className="h-20 w-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <XCircle className="h-10 w-10" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-foreground">Payment Failed</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Something went wrong during the payment process. No funds were charged, or your bank may refund automatically.
                        </p>
                        
                        <div className="pt-4 space-y-3">
                            <Button 
                                className="w-full h-14 rounded-xl text-lg font-bold bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20" 
                                onClick={() => navigate(-2)} // Try to go back to the booking page
                            >
                                <RefreshCw className="mr-2 h-5 w-5" />
                                Try Again
                            </Button>
                            <Button 
                                variant="ghost" 
                                className="w-full h-12 rounded-xl text-muted-foreground" 
                                onClick={() => navigate("/futsals")}
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Support & Help
                            </Button>
                        </div>
                        
                        <div className="pt-2">
                            <Link to="/" className="text-emerald-500 font-semibold hover:underline">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <FutsalFooter />
        </div>
    );
};

export default PaymentFailure;
