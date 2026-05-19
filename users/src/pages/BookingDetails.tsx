import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookings } from "@/lib/userApi";
import { getPaymentByBookingId, getFutsalById } from "@/lib/futsalApi";
import { useBooking } from "@/contexts/BookingContext";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, CalendarDays, Clock, MapPin, SearchX, X, RefreshCw, Phone, Download, ShieldCheck, Mail } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const BookingDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { cancelBooking } = useBooking();

    const { data: userBookingsData, isLoading: isBookingsLoading } = useQuery({
        queryKey: ['user-bookings'],
        queryFn: getUserBookings,
        enabled: isAuthenticated
    });

    const bookingRawList = userBookingsData?.data || [];
    const booking = bookingRawList.find((b: any) => b.id === Number(id) || String(b.id) === id);

    const { data: paymentRes, isLoading: isPaymentLoading } = useQuery({
        queryKey: ['booking-payment', booking?.facilityId, booking?.id],
        queryFn: () => getPaymentByBookingId(booking?.facilityId as string, booking?.id as number),
        enabled: !!booking?.facilityId && !!booking?.id
    });
    const payment = paymentRes?.data;

    const { data: futsalRes, isLoading: isFutsalLoading } = useQuery({
        queryKey: ['futsal-profile', booking?.facilityId],
        queryFn: () => getFutsalById(booking?.facilityId as string),
        enabled: !!booking?.facilityId
    });
    const facilityProfile = futsalRes?.data;

    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }

    if (isBookingsLoading || (booking && isFutsalLoading)) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="bg-card border border-border p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-md w-full">
                        <SearchX className="h-20 w-20 text-muted-foreground/40 mb-6" />
                        <h2 className="text-3xl font-extrabold text-foreground">Not Found</h2>
                        <p className="text-muted-foreground mt-3 mb-8">This reservation could not be tracked in your active ledger. It might have been permanently removed.</p>
                        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-bold" onClick={() => navigate("/bookings")}>
                            Return to Ledger
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const handleCancel = async () => {
        if (!user) return;
        try {
            await cancelBooking(booking.id, user.id);
            toast.success("Booking cancelled successfully!");
        } catch(e) {
            toast.error("Failed to cancel this booking.");
        }
    };

    const handleUpdate = () => {
        toast.info("Rescheduling & Updates are handled manually. Please call the facility directly to shift this timeslot.");
    };

    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time || "00:00"}`);
    const timeUntilBooking = bookingDateTime.getTime() - new Date().getTime();
    const canBeCancelled = (booking.status === "confirmed" || booking.status === "pending") && (timeUntilBooking >= 24 * 60 * 60 * 1000);

    // Compute dynamic colors based on status
    const isCancelled = booking.status === 'cancelled';
    const isConfirmed = booking.status === 'confirmed';
    const headerBannerColor = isCancelled ? 'bg-rose-500' : isConfirmed ? 'bg-emerald-500' : 'bg-amber-500';
    const statusText = isCancelled ? 'Void' : isConfirmed ? 'Verified (Paid)' : 'Awaiting Verification';

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1 container mx-auto py-10 px-4 md:px-6 relative">
                {/* Decorative Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
                
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 gap-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl">
                    <ArrowLeft className="h-4 w-4" />
                    Back to History
                </Button>

                <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
                    
                    {/* LEFT COLUMN: The Invoice Ticket */}
                    <div className="flex-1 bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                        {/* Ticket Header Banner */}
                        <div className={`${headerBannerColor} px-8 py-6 flex justify-between items-center bg-opacity-10 border-b border-${headerBannerColor.split('-')[1]}-500/20`}>
                            <div>
                                <p className={`text-xs font-bold uppercase tracking-widest ${isCancelled ? 'text-rose-400' : isConfirmed ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    Reservation Status
                                </p>
                                <h1 className={`text-3xl font-extrabold mt-1 text-foreground`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </h1>
                            </div>
                            <div className="bg-background/40 p-3 rounded-full backdrop-blur-md border border-border/10">
                                {isConfirmed ? <ShieldCheck className="h-8 w-8 text-emerald-500" /> : isCancelled ? <X className="h-8 w-8 text-rose-500" /> : <Clock className="h-8 w-8 text-amber-500" />}
                            </div>
                        </div>

                        {/* Ticket Body: Facility Info */}
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-foreground tracking-tight">{facilityProfile?.futsalName || booking.futsal_name || "Futsal Arena"}</h2>
                                    <div className="flex flex-col gap-2 mt-3 text-muted-foreground text-sm">
                                        <span className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-emerald-500" />
                                            {facilityProfile?.email ? `${facilityProfile.email} (Location DB pending)` : "Kathmandu, Nepal"}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-emerald-500" />
                                            {facilityProfile?.phoneNumber || "Phone unavailable"}
                                        </span>
                                        {facilityProfile?.email && (
                                            <span className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-emerald-500" />
                                                {facilityProfile.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Booking ID</p>
                                    <p className="font-mono text-lg text-muted-foreground mt-1">#RES-{booking.id.toString().padStart(6, '0')}</p>
                                </div>
                            </div>

                            <Separator className="bg-border/60 my-8" />

                            {/* Ticket Body: Match Info */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-sky-500"/> Match Date</p>
                                    <p className="font-bold text-foreground text-lg">
                                        {new Date(booking.booking_date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><Clock className="h-4 w-4 text-purple-500"/> Time Slot</p>
                                    <p className="font-bold text-foreground text-lg">
                                        {booking.start_time} - {booking.end_time}
                                    </p>
                                </div>
                                <div className="col-span-2 lg:col-span-1">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-500"/> Selected Pitch</p>
                                    <p className="font-bold text-foreground text-lg">
                                        {booking.pitch_name || "General Standard"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Footer (Tear-off style) */}
                        <div className="mt-auto border-t border-dashed border-border bg-card/50 p-8 relative">
                            {/* Dash perforations */}
                            <div className="absolute -top-3 -left-3 h-6 w-6 bg-background rounded-full border border-border"></div>
                            <div className="absolute -top-3 -right-3 h-6 w-6 bg-background rounded-full border border-border"></div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground">Total Charged</p>
                                    <p className="text-3xl font-black text-foreground tracking-tight mt-1">Rs. {booking.amount}</p>
                                </div>
                                <Button variant="outline" className="border-border hover:bg-muted text-foreground/80 hidden sm:flex items-center gap-2 rounded-xl">
                                    <Download className="h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Payment Block & Actions */}
                    <div className="w-full lg:w-[320px] flex flex-col gap-6">
                        {/* Transaction Block */}
                        <div className="bg-card border border-border rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 blur-xl rounded-full"></div>
                            
                            <h3 className="text-lg font-bold text-foreground mb-6 tracking-tight relative z-10">Transaction Flow</h3>
                            
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground font-medium">Gateway</span>
                                    <span className={`text-sm font-bold uppercase ${payment?.gateway ? 'text-sky-500' : 'text-muted-foreground/60'}`}>
                                        {payment?.gateway || "N/A"}
                                    </span>
                                </div>

                                {payment?.user && (
                                    <>
                                        <Separator className="bg-border/60" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Billed To</span>
                                            <span className="text-sm font-bold text-foreground">{payment.user.username}</span>
                                            <span className="text-xs text-muted-foreground">{payment.user.email}</span>
                                        </div>
                                    </>
                                )}

                                <Separator className="bg-border/60" />
                                
                                <div className="bg-background/50 p-4 rounded-xl border border-border">
                                    <p className="text-[0.65rem] uppercase font-bold text-muted-foreground tracking-wider mb-2">Ledger Status</p>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${isPaymentLoading ? 'bg-muted-foreground animate-pulse' : payment?.status === 'success' || booking.status === 'confirmed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'}`} />
                                        <p className="text-sm font-bold text-foreground">
                                            {isPaymentLoading ? "Decrypting..." : statusText}
                                        </p>
                                    </div>
                                    {payment?.provider_txn_id && (
                                        <p className="text-[0.6rem] text-muted-foreground/70 mt-2 font-mono break-all leading-relaxed">
                                            {payment.provider_txn_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions Block */}
                        <div className="flex flex-col gap-3">
                            <Button 
                                variant="outline" 
                                className="w-full h-14 bg-card border-border text-foreground hover:bg-muted rounded-2xl gap-2 font-semibold transition-all hover:border-muted-foreground/30"
                                onClick={handleUpdate}
                            >
                                <RefreshCw className="h-5 w-5 text-sky-500" />
                                Reschedule Match
                            </Button>
                            
                            <Button 
                                variant="destructive" 
                                className={`w-full h-14 rounded-2xl gap-2 font-semibold transition-all shadow-lg ${canBeCancelled ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30' : 'bg-muted text-muted-foreground/50 hover:bg-muted cursor-not-allowed opacity-70'}`}
                                disabled={!canBeCancelled}
                                onClick={handleCancel}
                            >
                                <X className="h-5 w-5" />
                                {canBeCancelled ? "Cancel Reservation" : "Cancellation Locked"}
                            </Button>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookingDetails;
