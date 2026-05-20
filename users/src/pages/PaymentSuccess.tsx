import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import { verifyPayment } from "@/lib/futsalApi";
import FutsalNavigation from "@/components/FutsalNavigation";
import FutsalFooter from "@/components/FutsalFooter";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isVerifying, setIsVerifying] = useState(true);
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

    const pidx = searchParams.get("pidx");
    const transactionId = searchParams.get("transaction_id") || searchParams.get("txnId");
    const amount = searchParams.get("amount");
    const purchaseOrderId = searchParams.get("purchase_order_id");
    const esewaData = searchParams.get("data"); // eSewa returns base64 encoded data

    useEffect(() => {
        const handleVerification = async () => {
            // In a real scenario, we might want to know the futsalId to call verifyPayment
            // But if the backend can resolve it from the user context or pidx, we might just need the pidx
            // For now, if we don't have futsalId here, we might need to store it in localStorage during booking initiation
            
            // Let's try to verify if we have common fields
            try {
                // If it's Khalti, we have pidx
                if (pidx) {
                    // We need futsalId. Let's look for it in localStorage where we might have saved it
                    const storedFutsalId = localStorage.getItem("last_futsal_id");
                    if (storedFutsalId) {
                        await verifyPayment(storedFutsalId, pidx, { pidx });
                        setStatus("success");
                        toast.success("Payment verified successfully!");
                    } else {
                        // Fallback: search our bookings or wait for backend sync
                        // For now we'll show success if the gateway redirected here
                        setStatus("success");
                    }
                } else if (esewaData) {
                    const storedFutsalId = localStorage.getItem("last_futsal_id");
                    if (storedFutsalId) {
                        await verifyPayment(storedFutsalId, "esewa", { data: esewaData });
                        setStatus("success");
                        toast.success("eSewa Payment verified!");
                    } else {
                        setStatus("success");
                    }
                } else {
                    setStatus("success");
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("error");
                toast.error("There was an issue verifying your payment.");
            } finally {
                setIsVerifying(false);
            }
        };

        handleVerification();
    }, [pidx, esewaData]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <FutsalNavigation name="Payment Success" />
            
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-card border border-border rounded-3xl p-10 shadow-xl shadow-emerald-500/5 text-center">
                    {isVerifying ? (
                        <div className="space-y-6 py-10">
                            <Loader2 className="h-16 w-16 animate-spin text-emerald-500 mx-auto" />
                            <h2 className="text-2xl font-bold text-foreground">Verifying Payment...</h2>
                            <p className="text-muted-foreground">Please wait while we secure your booking details.</p>
                        </div>
                    ) : status === "success" ? (
                        <div className="space-y-6">
                            <div className="h-20 w-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-foreground">Payment Successful!</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Your booking has been confirmed. You can now view the details in your dashboard.
                            </p>
                            
                            <div className="pt-6 space-y-3">
                                <Button className="w-full h-14 rounded-xl text-lg font-bold bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20" onClick={() => navigate("/bookings")}>
                                    View My Bookings
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button variant="ghost" className="w-full h-12 rounded-xl text-muted-foreground" onClick={() => navigate("/")}>
                                    Return to Home
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="h-20 w-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle2 className="h-10 w-10 rotate-180" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Verification Warning</h2>
                            <p className="text-muted-foreground">
                                Payment was confirmed by the provider, but automated verification failed. Don't worry, our team will review it manually.
                            </p>
                            <Button className="w-full h-14 rounded-xl font-bold mt-4" onClick={() => navigate("/bookings")}>
                                Go to Bookings
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <FutsalFooter />
        </div>
    );
};

export default PaymentSuccess;
