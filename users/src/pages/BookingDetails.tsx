import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookings } from "@/lib/userApi";
import { getPaymentByBookingId, getFutsalById, getFutsalPitches, getFutsalTimeSlots, rescheduleBooking } from "@/lib/futsalApi";
import { useBooking } from "@/contexts/BookingContext";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, CalendarDays, Clock, MapPin, SearchX, X, RefreshCw, Phone, Download, ShieldCheck, Mail } from "lucide-react";
import toast from 'react-hot-toast';
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getDayOfWeek = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date.getDay() + 1;
};

const isPastSlot = (dateString: string, startTime: string) => {
    const today = getLocalDateString();
    if (dateString < today) return true;
    if (dateString > today) return false;

    const [hours, minutes] = startTime.split(":").map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime < new Date();
};

const CANCELLATION_WINDOW_HOURS = 15;

const BookingDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { cancelBooking } = useBooking();
    const queryClient = useQueryClient();
    const [isRescheduleOpen, setIsRescheduleOpen] = React.useState(false);
    const [reschedulePitchId, setReschedulePitchId] = React.useState<string>("");
    const [rescheduleDate, setRescheduleDate] = React.useState<string>("");
    const [rescheduleTimeSlotId, setRescheduleTimeSlotId] = React.useState<string>("");
    const [rescheduleSubmitting, setRescheduleSubmitting] = React.useState(false);

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

    const { data: pitchesRes, isLoading: isPitchesLoading } = useQuery({
        queryKey: ['booking-reschedule-pitches', booking?.facilityId],
        queryFn: () => getFutsalPitches(booking?.facilityId as string),
        enabled: !!booking?.facilityId && isRescheduleOpen,
    });

    const { data: rescheduleSlotsRes, isLoading: isRescheduleSlotsLoading } = useQuery({
        queryKey: ['booking-reschedule-slots', booking?.facilityId, reschedulePitchId, rescheduleDate],
        queryFn: async () => {
            const dayOfWeek = getDayOfWeek(rescheduleDate);
            if (!booking?.facilityId || !reschedulePitchId || !dayOfWeek) return { timeslots: [] };
            return getFutsalTimeSlots(booking.facilityId, reschedulePitchId, dayOfWeek, rescheduleDate);
        },
        enabled: !!booking?.facilityId && isRescheduleOpen && !!reschedulePitchId && !!rescheduleDate,
    });

    const pitches = pitchesRes?.data || [];
    const currentPitchId = String(booking?.pitch_id || booking?.pitchId || "");
    const currentTimeslotId = String(booking?.timeslot_id || booking?.timeSlotId || "");
    const currentBookingDate = String(booking?.booking_date || booking?.date || "").slice(0, 10);
    const rescheduleSlots = (rescheduleSlotsRes?.timeslots || []).filter((slot: any) => String(slot.id) !== currentTimeslotId);

    React.useEffect(() => {
        if (!isRescheduleOpen || !booking) return;
        setReschedulePitchId(currentPitchId);
        setRescheduleDate(currentBookingDate || getLocalDateString());
        setRescheduleTimeSlotId("");
    }, [isRescheduleOpen, booking?.id]);

    React.useEffect(() => {
        setRescheduleTimeSlotId("");
    }, [reschedulePitchId, rescheduleDate]);

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
            await cancelBooking(booking.id, booking.facilityId || booking.futsal_id || booking.futsalId || "");
            await queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
            toast.success("Booking cancelled successfully!");
        } catch(e) {
            toast.error("Failed to cancel this booking.");
        }
    };

    const handleUpdate = () => {
        if (!canBeCancelled) {
            toast.error("This reservation can no longer be rescheduled.");
            return;
        }
        setIsRescheduleOpen(true);
    };

    const handleRescheduleSubmit = async () => {
        if (!booking?.facilityId || !reschedulePitchId || !rescheduleDate || !rescheduleTimeSlotId) {
            toast.error("Please select a date, pitch, and timeslot.");
            return;
        }

        try {
            setRescheduleSubmitting(true);
            await rescheduleBooking(booking.facilityId, booking.id, {
                pitch_id: reschedulePitchId,
                timeslot_id: rescheduleTimeSlotId,
                booking_date: rescheduleDate,
            });
            await queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
            toast.success("Booking rescheduled successfully!");
            setIsRescheduleOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reschedule this booking.");
        } finally {
            setRescheduleSubmitting(false);
        }
    };

    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time || "00:00"}`);
    const timeUntilBooking = bookingDateTime.getTime() - new Date().getTime();
    const canBeCancelled = (booking.status === "confirmed" || booking.status === "pending") && (timeUntilBooking >= CANCELLATION_WINDOW_HOURS * 60 * 60 * 1000);

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
                                className="w-full h-14 bg-card border-border text-foreground hover:bg-muted rounded-2xl gap-2 font-semibold transition-all hover:border-muted-foreground/30 disabled:opacity-60"
                                disabled={!canBeCancelled}
                                onClick={handleUpdate}
                            >
                                <RefreshCw className="h-5 w-5 text-sky-500" />
                                {canBeCancelled ? "Reschedule Match" : "Reschedule Locked"}
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

            <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Reschedule Match</DialogTitle>
                        <DialogDescription>
                            Choose a new date, pitch, and timeslot for this reservation.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Date</label>
                                <input
                                    type="date"
                                    value={rescheduleDate}
                                    min={getLocalDateString()}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-foreground">Pitch</label>
                                <select
                                    value={reschedulePitchId}
                                    onChange={(e) => setReschedulePitchId(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
                                >
                                    {pitches.map((pitch: any) => (
                                        <option key={pitch.id} value={pitch.id}>
                                            {pitch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <label className="text-sm font-semibold text-foreground">Available Timeslots</label>
                                {(isPitchesLoading || isRescheduleSlotsLoading) && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading
                                    </span>
                                )}
                            </div>

                            {rescheduleSlots.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {rescheduleSlots.map((slot: any) => {
                                        const slotStart = String(slot.start_time || "").slice(0, 5);
                                        const slotEnd = String(slot.end_time || "").slice(0, 5);
                                        const disabled = Number(slot.is_available) === 0 || Number(slot.is_actually_booked) === 1 || isPastSlot(rescheduleDate, slotStart);

                                        return (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                disabled={disabled}
                                                onClick={() => setRescheduleTimeSlotId(String(slot.id))}
                                                className={`rounded-xl border px-3 py-3 text-left transition-all ${
                                                    rescheduleTimeSlotId === String(slot.id)
                                                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                                                        : 'border-border bg-background text-foreground hover:border-emerald-500/40'
                                                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <p className="text-sm font-bold">{slotStart} - {slotEnd}</p>
                                                <p className="text-[11px] text-muted-foreground mt-1">
                                                    {disabled ? 'Unavailable' : 'Select slot'}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                                    No available timeslots for the selected date and pitch.
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                            Current booking: {booking.pitch_name || booking.pitchName || 'Pitch'} on {String(booking.booking_date || booking.date || '').slice(0, 10)} at {booking.start_time || booking.startTime || '00:00'} - {booking.end_time || booking.endTime || '00:00'}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsRescheduleOpen(false)} disabled={rescheduleSubmitting}>
                            Cancel
                        </Button>
                        <Button onClick={handleRescheduleSubmit} disabled={rescheduleSubmitting || !rescheduleTimeSlotId} className="gap-2">
                            {rescheduleSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            Reschedule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BookingDetails;
